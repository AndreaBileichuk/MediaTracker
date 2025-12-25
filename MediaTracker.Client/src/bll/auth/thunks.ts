import {createAsyncThunk} from "@reduxjs/toolkit";
import {authApi, type LoginRequest} from "../../api/authApi.ts";
import type {BackendResult} from "../../api/types.ts";
import type {AxiosError} from "axios";

export const loginUser = createAsyncThunk<string, LoginRequest, { rejectValue: BackendResult<string> }>
(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);

            return response.data.data!;
        } catch (err) {
            const error = err as AxiosError<BackendResult<string>>;

            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }

            return rejectWithValue({
                isSuccess: false,
                code: "Network.Error",
                message: "Network error. Please check your connection.",
                errors: [],
                data: undefined
            });
        }
    }
);