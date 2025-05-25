interface registerDeviceReqBody {
    userId: string;
    token: string;
    platform: string;
}

interface unregisterDeviceReqBody {
    token: string;
}

interface UpdateProfileReqBody {
    fullName: string;
    email: string;
    gender: string;
    dateOfBirth: string;
}

interface ChangePasscodeReqBody {
    currentPasscode: string;
    newPasscode: string;
    confirmPasscode: string;
}

export { registerDeviceReqBody, unregisterDeviceReqBody, UpdateProfileReqBody, ChangePasscodeReqBody }