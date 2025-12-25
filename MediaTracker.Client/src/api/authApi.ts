import axiosClient from "./axiosClient.ts";
import type {BackendResult} from "./types.ts";
import type {User} from "../bll/authSlice.ts";

export interface LoginRequest {
    email: string,
    password: string
}

export interface RegisterRequest {
    username: string,
    email: string,
    password: string
}

export const authApi = {
    login: async (data: LoginRequest) => {
        return await axiosClient.post<BackendResult<string>>('/auth/login', data);
    },

    register: async (data: RegisterRequest) => {
        return await axiosClient.post<BackendResult<string>>('/auth/register', data);
    },

    me: async () => {
        return await axiosClient.get<BackendResult<User>>("/auth/me");
    }
};