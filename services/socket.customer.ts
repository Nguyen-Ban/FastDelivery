import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './axios';

const API_URL = `${BASE_URL}/customer`;

class SocketCustomerService {
    private socket: Socket | null = null;
    private static instance: SocketCustomerService;

    private constructor() { }

    public static getInstance(): SocketCustomerService {
        if (!SocketCustomerService.instance) {
            SocketCustomerService.instance = new SocketCustomerService();
        }
        return SocketCustomerService.instance;
    }

    public async connect(): Promise<void> {
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
                                role: 'CUSTOMER'
                            }
                        }
                    }
                });

                this.socket.on('connect', () => {
                    console.log('Socket connected');
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

    public emit(event: string, data: any): void {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

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

export default SocketCustomerService.getInstance(); 