import {createSlice} from "@reduxjs/toolkit";
import {logout} from "../auth/authSlice.ts";
import {fetchCurrentUser} from "./thunks.ts";

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

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
    },
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
            });

        builder.addCase(logout, (state) => {
            state.user = null;
            state.status = 'idle';
        });
    },
});

export default accountSlice.reducer;