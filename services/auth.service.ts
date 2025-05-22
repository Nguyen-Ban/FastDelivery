import { User } from '@/contexts';
import { axiosInstance } from './axios';
import { ApiResponse } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    async startAuth(request: StartAuthReqBody): Promise<ApiResponse> {
        try {
            const response = await axiosInstance.post<ApiResponse>('/auth/start-auth', request);
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
        const response = await axiosInstance.post<ApiResponse>('/auth/verify-otp', request);
        return response.data;
    },
    async login(request: LoginReqBody): Promise<ApiResponse> {
        try {
            const response = await axiosInstance.post<ApiResponse>('/auth/login', request);
            // If the response includes a token, save it to keychain
            if (response.data.success && response.data.data) {
                await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
                await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            console.log('async storage', await AsyncStorage.getAllKeys())
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


    async register(request: RegisterReqBody): Promise<ApiResponse> {
        try {
            const response = await axiosInstance.post<ApiResponse>('/auth/register', request);
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

    async logout() {
        try {
            const response = await axiosInstance.post<ApiResponse>('/auth/logout');
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            await AsyncStorage.removeItem('user');
        } catch (error: any) {
            if (error.response) {
                console.log('❌ RESPONSE ERROR:', error.response.status, error.response.data);
            } else if (error.request) {
                console.log('❌ NO RESPONSE:', error.request);
            } else {
                console.log('❌ AXIOS ERROR:', error.message);
            }
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const userStr = await AsyncStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error: any) {
            if (error.response) {
                console.log('❌ RESPONSE ERROR:', error.response.status, error.response.data);
            } else if (error.request) {
                console.log('❌ NO RESPONSE:', error.request);
            } else {
                console.log('❌ AXIOS ERROR:', error.message);
            }
            throw error;
        }

    },

    async isAuthenticated() {
        try {
            return !!await AsyncStorage.getItem('accessToken');
        } catch (error: any) {
            if (error.response) {
                console.log('❌ RESPONSE ERROR:', error.response.status, error.response.data);
            } else if (error.request) {
                console.log('❌ NO RESPONSE:', error.request);
            } else {
                console.log('❌ AXIOS ERROR:', error.message);
            }
            throw error;
        }
    }
};

export default authService;
