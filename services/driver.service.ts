import { ApiResponse, RegisterDriverReqBody, ReviewDriverReqBody, ROLE } from '@/types';
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
    },

    async fetchAllDrivers(): Promise<ApiResponse> {
        try {
            const res = await RestApiService.getRequest('/drivers/list');
            return res;
        } catch (error: any) {
            throw error;
        }
    },

    async reviewDriver(reqBody: ReviewDriverReqBody): Promise<ApiResponse> {
        try {
            const res = await RestApiService.postRequest('/driver/review', reqBody, ROLE.CUSTOMER)
            return res;
        } catch (error: any) {
            throw error;
        }
    },


}

export default driverService;