import { ApiResponse } from "@/types";
import { axiosInstance } from "./axios";

const RestApiService = {
    async postRequest(path: string, reqBody?: any, role?: string): Promise<ApiResponse> {
        try {
            const response = await axiosInstance.post<ApiResponse>(path, reqBody, {
                headers: {
                    role: role,
                }
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.log(`POST Request ${path} with RESPONSE ERROR:`, error.response.status, error.response.data);
            } else if (error.request) {
                console.log(`POST Request ${path} with NO RESPONSE:`, error.request);
            } else {
                console.log(`POST Request ${path} with AXIOS ERROR:`, error.message);
            }
            throw error;
        }
    },
    async getRequest(path: string, params?: any, role?: string): Promise<ApiResponse> {
        try {
            const response = await axiosInstance.get<ApiResponse>(path, {
                headers: {
                    role: role,
                },
                params: params
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.log(`GET Request ${path} with RESPONSE ERROR:`, error.response.status, error.response.data);
            } else if (error.request) {
                console.log(`GET Request ${path} with NO RESPONSE:`, error.request);
            } else {
                console.log(`GET Request ${path} with AXIOS ERROR:`, error.message);
            }
            throw error;
        }
    },

    async putRequest(path: string, reqBody?: any, role?: string): Promise<ApiResponse> {
        try {
            const response = await axiosInstance.put<ApiResponse>(path, reqBody, {
                headers: {
                    role: role,
                }
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.log(`PUT Request ${path} with RESPONSE ERROR:`, error.response.status, error.response.data);
            } else if (error.request) {
                console.log(`PUT Request ${path} with NO RESPONSE:`, error.request);
            } else {
                console.log(`PUT Request ${path} with AXIOS ERROR:`, error.message);
            }
            throw error;
        }
    },

    async patchRequest(path: string, reqBody?: any, role?: string): Promise<ApiResponse> {
        try {
            const response = await axiosInstance.patch<ApiResponse>(path, reqBody, {
                headers: {
                    role: role,
                }
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.log(`PATCH Request ${path} with RESPONSE ERROR:`, error.response.status, error.response.data);
            } else if (error.request) {
                console.log(`PATCH Request ${path} with NO RESPONSE:`, error.request);
            } else {
                console.log(`PATCH Request ${path} with AXIOS ERROR:`, error.message);
            }
            throw error;
        }
    },
    async deleteRequest(path: string, role?: string): Promise<ApiResponse> {
        try {
            const response = await axiosInstance.patch<ApiResponse>(path, {
                headers: {
                    role: role,
                }
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.log(`DELETE Request ${path} with RESPONSE ERROR:`, error.response.status, error.response.data);
            } else if (error.request) {
                console.log(`DELETE Request ${path} with NO RESPONSE:`, error.request);
            } else {
                console.log(`DELETE Request ${path} with AXIOS ERROR:`, error.message);
            }
            throw error;
        }
    },
}

export default RestApiService;