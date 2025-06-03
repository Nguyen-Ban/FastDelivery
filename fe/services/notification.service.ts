import { registerDeviceReqBody, unregisterDeviceReqBody } from '@/types/user';
import RestApiService from './rest.api';
import { ApiResponse } from '@/types';

const NotificationService = {
    async registerDevice(reqBody: registerDeviceReqBody): Promise<ApiResponse> {
        try {
            const res = await RestApiService.postRequest('/notification/register-device', reqBody)
            return res;
        } catch (error: any) {
            if (error.response?.status === 400) {
                return { success: false };
            }
            throw error;
        }
    },

    async unregisterDevice(reqBody: unregisterDeviceReqBody): Promise<ApiResponse> {
        try {
            const res = await RestApiService.postRequest('/notification/unregister-device', reqBody)
            return res;
        } catch (error: any) {
            throw error;
        }
    }
}

export default NotificationService;




