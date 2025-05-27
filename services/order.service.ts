import { ApiResponse, Coordinate, VEHICLE_TYPES } from '@/types';
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
    async fetchStats(): Promise<ApiResponse> {
        try {
            const res = await RestApiService.getRequest('/order/stats');
            return res;
        } catch (error: any) {
            throw error;
        }
    },
}

export default orderService;