import { axiosInstance } from './axios';
import { ApiResponse } from './types';

interface registerDeviceReqBody {
    userId: string;
    token: string;
    platform: string;
}

interface unregisterDeviceReqBody {
    token: string;
}

const notificationService = {
    async registerDevice(request: registerDeviceReqBody): Promise<ApiResponse> {
        try {
            const response = await axiosInstance.post<ApiResponse>('/notification/register-device', request);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.log('❌ RESPONSE ERROR:', error.response.status, error.response.data);
            } else if (error.request) {
                console.log('❌ REQUEST ERROR:', error.request);
            } else {
                console.log('❌ ERROR:', error);
            }
            throw error;
        }
    },

    async unregisterDevice(request: unregisterDeviceReqBody): Promise<ApiResponse> {
        try {
            const response = await axiosInstance.post<ApiResponse>('/notification/unregister-device', request);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.log('❌ RESPONSE ERROR:', error.response.status, error.response.data);
            } else if (error.request) {
                console.log('❌ REQUEST ERROR:', error.request);
            } else {
                console.log('❌ ERROR:', error);
            }
            throw error;
        }
    }
}

export default notificationService;




