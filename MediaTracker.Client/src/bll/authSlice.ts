import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {AxiosError} from "axios";
import {authApi, type LoginRequest} from "../api/authApi.ts";
import type {BackendResult} from "../api/types.ts";

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

export const fetchCurrentUser = createAsyncThunk<User, void, {rejectValue: BackendResult<User>}>
(
    "auth/fetchMe",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.me();

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

export interface User {
    email: string;
    username: string;
}

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    user: User | null
}

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    status: 'idle',
    user: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.status = 'idle';
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload);
            })
            .addCase(loginUser.rejected, (state) => {
                state.status = 'failed';
            });

        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.status = 'failed';
                state.user = null;
                state.isAuthenticated = false;
                state.token = null;
                localStorage.removeItem('token');
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;