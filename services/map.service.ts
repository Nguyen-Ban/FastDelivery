
import { Position } from '@/types/Location';
import { axiosInstance } from './axios';
import { ApiResponse } from './types';

interface SuggestPlaceReqBody {
    userLocation: {
        lng: number,
        lat: number
    }
}

const mapService = {

    async getAddressFromLocation(lng: number, lat: number) {
        try {
            const response = await axiosInstance.get<ApiResponse>('/map/revgeocode', {
                params: {
                    lng, lat
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
    async getSuggestPlaces(q: string, request: SuggestPlaceReqBody) {
        try {
            const response = await axiosInstance.post<ApiResponse>('/map/suggest', request, {
                params: {
                    q
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
    async getPolyline(vehicleType: string, origin: Position | null, destination: Position | null) {
        try {
            const response = await axiosInstance.get<ApiResponse>('/map/polyline', {
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

export default mapService;