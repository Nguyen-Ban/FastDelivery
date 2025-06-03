import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "./socket"


const ChatService = {
    joinRoom: (orderId: string) => {
        console.log('aaa')
        socket.connect();
        socket.emit('chat:join', { orderId });
        console.log('aaa')

    },

    sendMessage: (senderId: string, content: string, orderId: string) => {
        socket.emit('chat:sendMessage', { senderId, content, orderId });
    },

    listenNewMessage: (callback: (data: any) => void) => {
        socket.on('chat:newMessage', callback);
    },

    // fetchMessageHistory: (orderId: string, callback: (data: any) => void) => {
    //     (socket.emit as any)('chat:getMessageHistory', { orderId }, callback);
    // },


};

export default ChatService;