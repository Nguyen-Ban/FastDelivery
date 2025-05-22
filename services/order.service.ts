import { Position } from '@/types/Location';
import { axiosInstance } from './axios';
import { ApiResponse } from './types';


const orderService = {

    async getPrices(vehicleType: string, origin: Position | null, destination: Position | null) {
        try {
            const response = await axiosInstance.get<ApiResponse>('/order/prices', {
                params: {
                    transportType: vehicleType, orgLat: origin?.lat, orgLng: origin?.lng, desLat: destination?.lat, desLng: destination?.lng
                }
            });
            return response.data;
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
}

export default orderService;