import axiosInstance from './axios';
import { ApiResponse } from './types';

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
        const response = await axiosInstance.post<ApiResponse>('/auth/start-auth', request);
        return response.data;
    },
    async verifyOtp(request: VerifyOtpReqBody): Promise<ApiResponse> {
        const response = await axiosInstance.post<ApiResponse>('/auth/verify-otp', request);
        return response.data;
    },
    async login(request: LoginReqBody): Promise<ApiResponse> {
        const response = await axiosInstance.post<ApiResponse>('/auth/login', request);
        return response.data;
    },


    async register(request: RegisterReqBody): Promise<ApiResponse> {
        const response = await axiosInstance.post<ApiResponse>('/auth/register', request);
        return response.data;
    },
};


export default authService;
