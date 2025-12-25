import {createAsyncThunk} from "@reduxjs/toolkit";
import type {BackendResult} from "../../api/types.ts";
import {accountApi} from "../../api/accountApi.ts";
import type {AxiosError} from "axios";
import type {User} from "./accountSlice.ts";

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
