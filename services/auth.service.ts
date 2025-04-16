import {plainAxios, tokenAxios} from './axios';
import { ApiResponse } from './types';
import * as Keychain from 'react-native-keychain';

interface StartAuthReqBody {
    phoneNumber: string
}

interface VerifyOtpReqBody {
    phoneNumber: string;
    otp: string;
}

interface RegisterReqBody {
    fullName: string;
    email: string;
    gender: string;
    dateOfBirth: Date;
    phoneNumber: string;
    passcode: string;
}

interface LoginReqBody {
    phoneNumber: string;
    passcode: string;
}

const authService = {
    // Token management functions
    async saveToken(token: string): Promise<boolean> {
        try {
            await Keychain.setGenericPassword('accessToken', token);
            return true;
        } catch (error) {
            console.error('Error saving token to keychain:', error);
            return false;
        }
    },

    async getToken(): Promise<string | null> {
        try {
            const credentials = await Keychain.getGenericPassword({ service: 'auth' });
            if (credentials) {
                return credentials.password;
            }
            return null;
        } catch (error) {
            console.error('Error retrieving token from keychain:', error);
            return null;
        }
    },

    async removeToken(): Promise<boolean> {
        try {
            await Keychain.resetGenericPassword({ service: 'auth' });
            return true;
        } catch (error) {
            console.error('Error removing token from keychain:', error);
            return false;
        }
    },

    async startAuth(request: StartAuthReqBody): Promise<ApiResponse> {
        console.log(2);
        try {
          const response = await plainAxios.post<ApiResponse>('/auth/start-auth', request);
          console.log(3);
          return response.data;
        } catch (error: any) {
          if (error.response) {
            console.log('❌ RESPONSE ERROR:', error.response.status, error.response.data);
          } else if (error.request) {
            console.log('❌ NO RESPONSE:', error.request);
          } else {
            console.log('❌ AXIOS ERROR:', error.message);
          }
          throw error; // Có thể throw lại để xử lý phía gọi hàm
        }
      },
    async verifyOtp(request: VerifyOtpReqBody): Promise<ApiResponse> {
        const response = await plainAxios.post<ApiResponse>('/auth/verify-otp', request);
        return response.data;
    },
    async login(request: LoginReqBody): Promise<ApiResponse> {
        const response = await plainAxios.post<ApiResponse>('/auth/login', request);
        console.log(response.data.data.accessToken)
        // If the response includes a token, save it to keychain
        if (response.data.success && response.data.data) {
            await this.saveToken(response.data.data.accessToken);
        }
        return response.data;
    },


    async register(request: RegisterReqBody): Promise<ApiResponse> {
        try {
            const response = await plainAxios.post<ApiResponse>('/auth/register', request);
            // If the response includes a token, save it to keychain
            if (response.data.success && response.data.data) {
                await this.saveToken(response.data.data.accessToken);
            }
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.log('❌ RESPONSE ERROR:', error.response.status, error.response.data);
            } else if (error.request) {
                console.log('❌ NO RESPONSE:', error.request);
            } else {
                console.log('❌ AXIOS ERROR:', error.message);
            }
            throw error; // Có thể throw lại để xử lý phía gọi hàm
        }
    },
};

export default authService;
