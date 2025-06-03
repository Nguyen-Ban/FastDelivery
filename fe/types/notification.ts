interface registerDeviceReqBody {
    userId: string;
    token: string;
    platform: string;
}

interface unregisterDeviceReqBody {
    token: string;
}

export { registerDeviceReqBody, unregisterDeviceReqBody };