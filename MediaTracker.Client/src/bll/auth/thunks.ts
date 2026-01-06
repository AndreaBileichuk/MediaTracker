import {createAsyncThunk} from "@reduxjs/toolkit";
import {authApi, type LoginRequest, type RegisterRequest} from "../../api/authApi.ts";
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