import { User } from "./user";

interface StartAuthReqBody {
    phoneNumber: string
}

interface VerifyOtpReqBody {
    phoneNumber: string;
    otp: string;
}

interface RegisterReqBody {
    fullName: string;
    email: string;
    gender: string;
    dateOfBirth: Date;
    phoneNumber: string;
    passcode: string;
}

interface LoginReqBody {
    phoneNumber: string;
    passcode: string;
}

interface AuthState {
    user?: User;
    isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
    login: (phoneNumber: string, passcode: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

export {
    StartAuthReqBody, VerifyOtpReqBody, RegisterReqBody,
    LoginReqBody, AuthState, AuthContextType
}