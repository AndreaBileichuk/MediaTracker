import {createSlice} from "@reduxjs/toolkit";
import {logout} from "../auth/authSlice.ts";
import {fetchCurrentUser, uploadUserAvatar} from "./thunks.ts";

export interface User {
    email: string;
    username: string;
    avatarUrl: string | null;
}

interface AccountState {
    user: User | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AccountState = {
    user: null,
    status: 'idle'
};

export interface ChangePasswordRequest {
    oldPassword: string,
    newPassword: string
}

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.status = 'failed';
                state.user = null;
            })
            .addCase(logout, (state) => {
                state.user = null;
                state.status = 'idle';
            })
            .addCase(uploadUserAvatar.pending, (state) => {
                state.status = "loading";
            })
            .addCase(uploadUserAvatar.fulfilled, (state, action) => {
                state.status = 'succeeded';

                if (state.user) {
                    state.user.avatarUrl = action.payload;
                }
            })
            .addCase(uploadUserAvatar.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export default accountSlice.reducer;