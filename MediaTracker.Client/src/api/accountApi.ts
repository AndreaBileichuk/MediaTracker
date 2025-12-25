import axiosClient from "./axiosClient.ts";
import type {BackendResult} from "./types.ts";
import type {User} from "../bll/auth/authSlice.ts";

export const accountApi = {
    me: async () => {
        return await axiosClient.get<BackendResult<User>>("/account/me");
    }
};