import axios from 'axios';
import authService from './auth.service';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse } from './types';

const tokenAxios = axios.create({
    baseURL: 'http://192.168.31.110:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});


// Flag to track if we're refreshing token
let isRefreshing = false;
// Store pending requests
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

// Add a request interceptor
tokenAxios.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
tokenAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu là lỗi 401 và request không phải là refresh token
        if (error.response?.status === 401 && !originalRequest.url?.includes('/auth/refresh-token')) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => tokenAxios(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                const response = await refreshToken();

                if (!response.success) {
                    processQueue(new Error('Token refresh failed'));
                    return Promise.reject(error);
                }

                if (response.data?.accessToken) {
                    originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                    processQueue();
                    return tokenAxios(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

const refreshToken = async () => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
        authService.logout();
        return { success: false, message: 'No refresh token available' };
    }

    try {
        const response = await tokenAxios.post<ApiResponse>('/auth/refresh-token', {
            refreshToken
        });

        if (response.data.success && response.data.data) {
            await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
            return response.data;
        }

        // Nếu refresh token hết hạn hoặc không hợp lệ
        authService.logout();
        return { success: false, message: 'Invalid refresh token' };
    } catch (error) {
        authService.logout();
        return { success: false, message: 'Failed to refresh token' };
    }
}


// const plainAxios = axios.create({
//     baseURL: 'http://192.168.47.110:3000/api',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

export default tokenAxios;

