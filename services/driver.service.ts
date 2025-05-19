import axiosInstance from './axios';
import { ApiResponse } from './types';

interface RegisterDriverReqBody {
    vehicleType: string,
    vehiclePlate: string,
    licenseNumber: string,
}

const driverService = {

    async registerDriver(request: RegisterDriverReqBody) {
        try {
            const response = await axiosInstance.post<ApiResponse>(
                '/driver/register',
                request, // 👈 đây là body đúng của request
                {
                    headers: {
                        role: 'CUSTOMER',
                    },
                }
            );
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

    async checkRegistered() {
        try {
            const response = await axiosInstance.get<ApiResponse>('/driver/check-registered', {
                headers: {
                    role: 'CUSTOMER', // 👈 Gắn role vào header cho request này
                },
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return { success: false }; // Trả về mặc định, không throw
            }
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

}

export default driverService;