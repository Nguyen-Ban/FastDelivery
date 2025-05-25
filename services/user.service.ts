import { ChangePasscodeReqBody, UpdateProfileReqBody } from "@/types";
import RestApiService from "./rest.api";


const userService = {

    async getProfile() {
        try {
            const res = await RestApiService.getRequest('/profile')
            return res;
        } catch (error: any) {
            throw error;
        }
    },

    async updateProfile(reqBody: UpdateProfileReqBody) {
        try {
            const res = await RestApiService.putRequest('/profile', reqBody)
            return res;
        } catch (error: any) {
            throw error;
        }
    },

    async changePasscode(reqBody: ChangePasscodeReqBody) {
        try {
            const res = await RestApiService.patchRequest('/profile/passcode', reqBody)
            return res;
        } catch (error: any) {
            throw error;
        }
    },

}

export default userService;