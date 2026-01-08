import {createAsyncThunk} from "@reduxjs/toolkit";
import type {BackendResult} from "../../api/types.ts";
import {accountApi} from "../../api/accountApi.ts";
import type {AxiosError} from "axios";
import type {ChangePasswordRequest, User} from "./accountSlice.ts";
import {handleThunkError} from "../helpers/errorHelpers.ts";

export const fetchCurrentUser = createAsyncThunk<User, void, {rejectValue: BackendResult<User>}>
(
    "account/fetchMe",
    async (_, { rejectWithValue }) => {
        try {
            const response = await accountApi.me();

            return response.data.data!;
        } catch (err) {
            const error = err as AxiosError<BackendResult<User>>;

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

export const uploadUserAvatar = createAsyncThunk<string, File, {rejectValue: BackendResult<string>}>(
    "account/uploadAvatar",
    async (file, {rejectWithValue}) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await accountApi.uploadAvatar(formData);

            return response.data.data!;
        }
        catch (err) {
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
)

export const changePassword = createAsyncThunk<void, ChangePasswordRequest, {rejectValue: BackendResult<void>}>(
    "account/changePassword",
    async (request, {rejectWithValue}) => {
        try {
            const response = await accountApi.changePassword(request);

            return response.data.data;
        }
        catch(err) {
            return handleThunkError(err, rejectWithValue);
        }
    }
)