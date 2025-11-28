import {createSlice} from "@reduxjs/toolkit";

interface User {
    id: string,
    email: string,
    username: string
}

interface AuthState {
    isAuth: boolean,
    user: User | null
}

const initialState : AuthState = {
    isAuth: false,
    user: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state) {
            state.isAuth = true;
        },
        logout(state) {
            state.isAuth = false;
            state.user = null;
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;