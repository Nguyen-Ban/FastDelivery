// backgroundTask.ts
import BackgroundService from 'react-native-background-actions';
import { ROLE } from '@/types';

import SocketService from '@/services/socket';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const socketTask = async (taskData?: { role: ROLE }) => {
    const role = taskData?.role;
    console.log('[BG] Bắt đầu socket background');

    if (role && !SocketService.isConnected()) {
        await SocketService.connect(role);
    }

    SocketService.on('order:new', (order) => {
        console.log('[BG] Đơn hàng mới:', order);
    });

    while (BackgroundService.isRunning()) {
        await sleep(10000);
    }
};

export const startSocketBackground = async (role: ROLE) => {
    await BackgroundService.start(socketTask, {
        taskName: 'FastDeliverySocket',
        taskTitle: 'Socket đang chạy nền',
        taskDesc: 'Nhận đơn hàng, tin nhắn...',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        parameters: { role },
    });
};

export const stopSocketBackground = async () => {
    await BackgroundService.stop();
    SocketService.disconnect();
};
