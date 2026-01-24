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

export interface ResendConfirmationRequest {
    email: string,
}

export interface ConfirmEmailRequest {
    userId: string,
    code: string
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
    },
    resendConfirmation: async (data: ResendConfirmationRequest) => {
        return await axiosClient.post<BackendResult<void>>('/auth/resend-confirmation-email', data);
    },
    confirmEmail: async (data: ConfirmEmailRequest) => {
        return await axiosClient.post<BackendResult<void>>('/auth/confirm-email', data);
    }
};