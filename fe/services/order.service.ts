import { ApiResponse, Coordinate, ROLE, VEHICLE_TYPES } from '@/types';
import RestApiService from './rest.api';


const orderService = {

    async getPrices(vehicleType: VEHICLE_TYPES, origin: Coordinate, destination: Coordinate): Promise<ApiResponse> {
        try {
            const res = await RestApiService.getRequest('/order/prices', {
                vehicleType: vehicleType,
                origin: `${origin.lat},${origin.lng}`,
                destination: `${destination.lat},${destination.lng}`
            })
            return res;
        } catch (error: any) {
            throw error;
        }
    },
    async fetchAdminStats(): Promise<ApiResponse> {
        try {
            const res = await RestApiService.getRequest('/order/admin/stats');
            return res;
        } catch (error: any) {
            throw error;
        }
    },
    async getCustomerOrderList(): Promise<ApiResponse> {
        try {
            const res = await RestApiService.getRequest('/order/customer/list', {}, ROLE.CUSTOMER);
            return res;
        } catch (error: any) {
            throw error;
        }
    },
    async getDriverOrderList(): Promise<ApiResponse> {
        try {
            const res = await RestApiService.getRequest('/order/driver/list', {}, ROLE.DRIVER);
            return res;
        } catch (error: any) {
            throw error;
        }
    },

    async fetchEventDetail(id: string): Promise<ApiResponse> {
        try {
            const res = await RestApiService.getRequest(`/order/event/${id}`);
            return res;
        } catch (error: any) {
            throw error;
        }
    },
    async fetchCustomerStats(): Promise<ApiResponse> {
        try {
            const res = await RestApiService.getRequest(`/order/customer/stats`);
            return res;
        } catch (error: any) {
            throw error;
        }
    },

}

export default orderService;