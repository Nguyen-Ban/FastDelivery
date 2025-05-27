import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './axios';
import { ROLE } from '@/types';
import { useCallback } from 'react';

const API_URL = `${BASE_URL}`;

class SocketService {
    private socket: Socket | null = null;
    private static instance: SocketService;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public async connect(role: ROLE): Promise<void> {
        if (!this.socket) {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                if (!accessToken) {
                    throw new Error('No access token found');
                }

                this.socket = io(API_URL, {
                    transports: ['polling'],
                    transportOptions: {
                        polling: {
                            extraHeaders: {
                                token: accessToken,
                                role: role
                            }
                        }
                    }
                });

                this.socket.on('connect', () => {
                    console.log('Socket 1 connected');
                });

                this.socket.on('disconnect', () => {
                    console.log('Socket disconnected');
                });

                this.socket.on('error', (error) => {
                    console.error('Socket error:', error);
                });

                this.socket.on('connect_error', (error) => {
                    console.error('Socket connection error:', error);
                    if (error.message.includes('Unauthorized')) {
                        // Token might be invalid or expired
                        this.disconnect();
                    }
                });
            } catch (error) {
                console.error('Error connecting to socket:', error);
                throw error;
            }
        }
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }


    public emit = useCallback(
        (event: string, payload: any, callback?: (...args: any[]) => void) => {
            if (this.socket && this.socket.connected) {
                this.socket.emit(event, payload, callback);
            } else {
                console.warn(`[SOCKET] Not connected. Cannot emit "${event}"`);
            }
        },
        []
    );

    public on(event: string, callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    public off(event: string): void {
        if (this.socket) {
            this.socket.off(event);
        }
    }

    public isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

export default SocketService.getInstance();