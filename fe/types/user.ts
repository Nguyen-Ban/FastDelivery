interface User {
    id: string,
    fullName: string,
    phoneNumber: string,
    email: string,
    passcode?: string
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

export {
    UpdateProfileReqBody, ChangePasscodeReqBody, User
}