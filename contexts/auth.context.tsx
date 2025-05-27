import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router'; // Dùng với Expo Router
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/auth.service'; // Dịch vụ xác thực
import { AuthContextType, AuthState } from '../types/auth';

import { useNotification } from '@/hooks/useNotification';
import { ROLE, User } from '@/types';


const initialState = {
    isAuthenticated: false
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { registerForPushNotificationsAsync } = useNotification();

    const [state, setState] = useState<AuthState>(initialState);
    const router = useRouter();

    // Kiểm tra người dùng khi ứng dụng khởi động
    useEffect(() => {
        const checkAuth = async () => {
            const userStr = await AsyncStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null

            if (user && !!await AsyncStorage.getItem('accessToken')) {
                setState({
                    user,
                    isAuthenticated: true
                });
            } else {
                setState(initialState);
                router.push('/authentication/auth-method'); // Điều hướng nếu chưa đăng nhập
            }
        };

        checkAuth();
    }, [router]);

    const login = async (phoneNumber: string, passcode: string) => {
        try {
            const response = await authService.login({ phoneNumber, passcode });
            if (response.success && response.data) {
                setState({
                    user: response.data.user,
                    isAuthenticated: true
                });
                await AsyncStorage.setItem('accessToken', response.data.accessToken);
                await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
                if (response.data.user.roles.includes(ROLE.ADMIN) || response.data.user.roles.includes(ROLE.SYSADMIN)) router.push('/admin')
                else router.push("/customer/home");
                await registerForPushNotificationsAsync(response.data.user.id);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setState(initialState);
            router.push('/authentication/auth-method'); // Điều hướng về trang đăng nhập
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = (user: User) => {
        setState(prev => ({
            ...prev,
            user
        }));
    };


    const value: AuthContextType = {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        login,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
