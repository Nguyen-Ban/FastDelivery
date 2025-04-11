import axios from 'axios';
import authService from './auth.service';
import * as Keychain from 'react-native-keychain';

// Helper function to get token from keychain
const getToken = async (): Promise<string | null> => {
    try {
        const credentials = await Keychain.getGenericPassword({ service: 'auth' });
        if (credentials) {
            return credentials.password;
        }
        return null;
    } catch (error) {
        console.error('Error retrieving token from keychain:', error);
        return null;
    }
};

const tokenAxios = axios.create({
    baseURL: 'http://192.168.47.110:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
tokenAxios.interceptors.request.use(
    async (config) => {
        if ((config as any).skipAuth) {
            return config; // Bỏ qua thêm token
        }

        const token = await getToken();
        console.log(1);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const plainAxios = axios.create({
    baseURL: 'http://192.168.47.110:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export { tokenAxios, plainAxios };