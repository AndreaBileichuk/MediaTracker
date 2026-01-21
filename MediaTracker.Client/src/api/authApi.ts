import axiosClient from "./axiosClient.ts";
import type {BackendResult} from "./types.ts";

export interface LoginRequest {
    email: string,
    password: string
}

export interface RegisterRequest {
    username: string,
    email: string,
    password: string
}

export interface ForgotPasswordRequest {
    email: string,
}

export interface PasswordResetRequest {
    email: string,
    token: string,
    newPassword: string
}

export const authApi = {
    login: async (data: LoginRequest) => {
        return await axiosClient.post<BackendResult<string>>('/auth/login', data);
    },

    register: async (data: RegisterRequest) => {
        return await axiosClient.post<BackendResult<string>>('/auth/register', data);
    },
    forgotPassword: async (data: ForgotPasswordRequest) => {
        return await axiosClient.post<BackendResult<void>>('/auth/forgot-password', data)
    },
    resetPassword: async (data: PasswordResetRequest) => {
        return await axiosClient.post<BackendResult<void>>('/auth/reset-password', data);
    }
};