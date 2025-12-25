import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.ts";
import accountSlice from "./account/accountSlice.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        account: accountSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;