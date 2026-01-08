import axiosClient from "./axiosClient.ts";
import type {BackendResult} from "./types.ts";
import type {ChangePasswordRequest, User} from "../bll/account/accountSlice.ts";

export const accountApi = {
    me: async () => {
        return await axiosClient.get<BackendResult<User>>("/account/me");
    },

    uploadAvatar: async (formData: FormData) => {
        return await axiosClient.post<BackendResult<string>>("/account/avatar", formData,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },

    changePassword: async (request: ChangePasswordRequest) => {
        return await axiosClient.post<BackendResult<void>>("/account/change-password", request)
    }
};