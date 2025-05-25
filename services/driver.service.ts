import { ApiResponse, RegisterDriverReqBody, ROLE } from '@/types';
import RestApiService from './rest.api';

const driverService = {

    async registerDriver(reqBody: RegisterDriverReqBody): Promise<ApiResponse> {
        try {
            const res = await RestApiService.postRequest('/driver/register', reqBody, ROLE.CUSTOMER)
            return res;
        } catch (error: any) {
            throw error;
        }
    },

    async checkRegistered(): Promise<ApiResponse> {
        try {
            const res = await RestApiService.getRequest('/driver/check-registered', {}, ROLE.CUSTOMER)
            return res;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return { success: false };
            }
            throw error;
        }
    }

}

export default driverService;