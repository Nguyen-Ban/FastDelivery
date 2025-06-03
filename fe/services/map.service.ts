import { ApiResponse, Coordinate, VEHICLE_TYPES } from '@/types';
import { axiosInstance } from './axios';
import RestApiService from './rest.api';
import { SuggestPlaceReqBody } from '@/types';

const mapService = {

    async fetchLocationFromCoord(coord: Coordinate): Promise<ApiResponse> {
        try {
            const res = await RestApiService.getRequest('/map/revgeocode', { lat: coord.lat, lng: coord.lng })
            return res;
        } catch (error: any) {
            throw error;
        }
    },

    async fetchSuggestPlaces(coord: Coordinate, query: string): Promise<ApiResponse> {
        try {
            const res = await RestApiService.getRequest('/map/suggest', { lat: coord.lat, lng: coord.lng, q: query })
            return res;
        } catch (error: any) {
            throw error;
        }
    },

    async getPolyline(vehicleType: VEHICLE_TYPES, origin: Coordinate, destination: Coordinate): Promise<ApiResponse> {
        try {
            const res = await RestApiService.getRequest('/map/polyline', {
                vehicleType: vehicleType,
                origin: `${origin.lat},${origin.lng}`,
                destination: `${destination.lat},${destination.lng}`
            })
            return res;
        } catch (error: any) {
            throw error;
        }
    },
}

export default mapService;