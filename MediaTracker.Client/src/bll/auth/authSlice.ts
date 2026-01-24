import {createSlice} from "@reduxjs/toolkit";
import {fetchCurrentUser} from "../account/thunks.ts";
import {forgotPassword, loginUser, registerUser, resendConfirmation, resetPassword} from "./thunks.ts";

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    status: 'idle',
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
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload);
            })
            .addCase(registerUser.rejected, (state) => {
                state.status = 'failed';
            });

        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        });

        builder
            .addCase(resetPassword.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(resetPassword.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(resetPassword.fulfilled, state => {
                state.status = 'succeeded';
            });

        builder
            .addCase(forgotPassword.pending, state => {
                state.status = 'loading';
            })
            .addCase(forgotPassword.fulfilled, state => {
                state.status = 'succeeded';
            })
            .addCase(forgotPassword.rejected, (state) => {
                state.status = 'failed'
            })

        builder
            .addCase(resendConfirmation.pending, state => {
                state.status = 'loading';
            })
            .addCase(resendConfirmation.rejected, (state) => {
                state.status = 'failed'
            })
            .addCase(resendConfirmation.fulfilled, state => {
                state.status = 'succeeded'
            })
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;