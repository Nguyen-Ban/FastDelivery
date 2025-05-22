// contexts/socket.context.tsx
import React, {
    createContext,
    useContext,
    useRef,
    useCallback,
    useState,
} from "react";
import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/services/axios";

const API_URL = `${BASE_URL}/driver`;

interface ISocketDriverContext {
    socket: Socket | null;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const SocketDriverContext = createContext<ISocketDriverContext>({
    socket: null,
    connect: async () => { },
    disconnect: () => { },
});

export const SocketDriverProvider = ({ children }: { children: React.ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    const connect = useCallback(async () => {
        if (socketRef.current && socketRef.current.connected) return;

        const accessToken = await AsyncStorage.getItem("accessToken");
        if (!accessToken) {
            console.warn("No access token found");
            return;
        }

        const socket = io(API_URL, {
            transports: ["polling"],
            transportOptions: {
                polling: {
                    extraHeaders: {
                        token: accessToken,
                        role: "DRIVER", // hoặc lấy role từ AsyncStorage nếu cần
                    },
                },
            },
        });

        socket.on("connect", () => {
            console.log("Socket connected");
            setConnected(true);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
            setConnected(false);
        });

        socketRef.current = socket;
    }, []);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setConnected(false);
        }
    }, []);

    return (
        <SocketDriverContext.Provider
            value={{
                socket: socketRef.current,
                connect,
                disconnect,
            }}
        >
            {children}
        </SocketDriverContext.Provider>
    );
};

export const useSocketDriver = () => useContext(SocketDriverContext);
