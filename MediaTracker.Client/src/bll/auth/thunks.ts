import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    authApi,
    type ForgotPasswordRequest,
    type LoginRequest,
    type PasswordResetRequest,
    type RegisterRequest, type ResendConfirmationRequest
} from "../../api/authApi.ts";
import type {BackendResult} from "../../api/types.ts";
import {handleThunkError} from "../helpers/errorHelpers.ts";

export const loginUser = createAsyncThunk<string, LoginRequest, { rejectValue: BackendResult<string> }>
(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);

            return response.data.data!;
        } catch (err) {
            return handleThunkError(err, rejectWithValue);
        }
    }
);

export const registerUser = createAsyncThunk<string, RegisterRequest, {rejectValue: BackendResult<string>}>
(
    'auth/registerUser',
    async (credentials, {rejectWithValue}) => {
        try {
            const response = await authApi.register(credentials);

            return response.data.data!;
        } catch(err) {
            return handleThunkError(err, rejectWithValue);
        }
    }
)

export const forgotPassword = createAsyncThunk<void, ForgotPasswordRequest, {rejectValue: BackendResult<void>}>(
    'auth/forgotPassword',
    async (credentials, {rejectWithValue}) => {
        try {
            const response = await authApi.forgotPassword(credentials);
            return response.data.data!;
        }
        catch(err) {
            return handleThunkError(err, rejectWithValue);
        }
    }
)

export const resetPassword = createAsyncThunk<void, PasswordResetRequest, {rejectValue: BackendResult<void>}>
(
    'auth/resetPassword',
    async (credentials, {rejectWithValue}) => {
        try {
            const response = await authApi.resetPassword(credentials);

            return response.data.data;
        }
        catch(err) {
            return handleThunkError(err, rejectWithValue);
        }
    }
)

export const resendConfirmation = createAsyncThunk<void, ResendConfirmationRequest, {rejectValue: BackendResult<void>}>(
    'auth/resendConfirmation',
    async (credentials, {rejectWithValue}) => {
        try {
            const response = await authApi.resendConfirmation(credentials);

            return response.data.data;
        }
        catch(err) {
            return handleThunkError(err, rejectWithValue);
        }
    }
)

