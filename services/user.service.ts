import { ApiResponse } from "./types";
import axiosInstance from './axios';

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

interface UserProfile {
    fullName: string;
    email: string;
    gender: string;
    dateOfBirth: string;
    phoneNumber: string;
}

interface ProfileResponse extends ApiResponse {
    data: UserProfile;
}

const userService = {

    async getProfile() {
        try {
            const response = await axiosInstance.get<ProfileResponse>('/profile');
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.log('❌ RESPONSE ERROR:', error.response.status, error.response.data);
            } else if (error.request) {
                console.log('❌ NO RESPONSE:', error.request);
            } else {
                console.log('❌ AXIOS ERROR:', error.message);
            }
            throw error;
        }
    },

    async updateProfile(request: UpdateProfileReqBody) {
        try {
            const response = await axiosInstance.put<ProfileResponse>('/profile', request);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.log('❌ RESPONSE ERROR:', error.response.status, error.response.data);
            } else if (error.request) {
                console.log('❌ NO RESPONSE:', error.request);
            } else {
                console.log('❌ AXIOS ERROR:', error.message);
            }
            throw error;
        }
    },

    async changePasscode(request: ChangePasscodeReqBody) {
        try {
            const response = await axiosInstance.patch<ProfileResponse>('/profile/passcode', request);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.log('❌ RESPONSE ERROR:', error.response.status, error.response.data);
            } else if (error.request) {
                console.log('❌ NO RESPONSE:', error.request);
            } else {
                console.log('❌ AXIOS ERROR:', error.message);
            }
            throw error;
        }
    },

}

export default userService;