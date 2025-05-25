import { ApiResponse, LoginReqBody, RegisterReqBody, StartAuthReqBody, VerifyOtpReqBody } from '@/types';
import { axiosInstance } from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RestApiService from './rest.api';

const authService = {
    async startAuth(reqBody: StartAuthReqBody): Promise<ApiResponse> {
        try {
            const res = await RestApiService.postRequest('/auth/start-auth', reqBody)
            return res;
        } catch (error: any) {
            throw error;
        }
    },

    async verifyOtp(reqBody: VerifyOtpReqBody): Promise<ApiResponse> {
        try {
            const res = await RestApiService.postRequest('/auth/verify-otp', reqBody)
            return res;
        } catch (error: any) {
            throw error;
        }
    },

    async login(reqBody: LoginReqBody): Promise<ApiResponse> {
        try {
            const res = await RestApiService.postRequest('/auth/login', reqBody)
            return res;
        } catch (error: any) {
            throw error;
        }
    },


    async register(reqBody: RegisterReqBody): Promise<ApiResponse> {
        try {
            const res = await RestApiService.postRequest('/auth/register', reqBody)
            return res;
        } catch (error: any) {
            throw error;
        }
    },

    async logout(): Promise<ApiResponse> {
        try {
            const res = await RestApiService.postRequest('/auth/logout')
            return res;
        } catch (error: any) {
            throw error;
        }
    }
};

export default authService;
