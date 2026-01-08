import type {AxiosError} from "axios";
import type {BackendResult} from "../../api/types.ts";
import type {AsyncThunkConfig} from "@reduxjs/toolkit";


export function handleThunkError(err : unknown, rejectWithValue: AsyncThunkConfig["rejectValue"]) {
    const error = err as AxiosError<BackendResult<string>>;

    if (error.response && error.response.data) {
        // @ts-ignore
        return rejectWithValue(error.response.data);
    }

    // @ts-ignore
    return rejectWithValue({
        isSuccess: false,
        code: "Network.Error",
        message: "Network error. Please check your connection.",
        errors: [],
        data: undefined
    });
}

export function mapBackendErrors<T>(backendResult: BackendResult<T>): Record<string, string> {
    const errorsMap: Record<string, string> = {};

    if (backendResult.errors && backendResult.errors.length > 0) {
        backendResult.errors.forEach((e) => {
            if (e.code.toLowerCase().includes("email")) errorsMap["email"] = e.message || "Invalid email";
            else if (e.code.toLowerCase().includes("password")) errorsMap["password"] = e.message || "Invalid password";
            else if (e.code.toLowerCase().includes("username")) errorsMap["username"] = e.message || "Invalid username";
            else errorsMap[e.code] = e.message || "Error";
        });
    }

    return errorsMap;
}

export function mapBackendErrorsForChangePassword<T>(backendResult: BackendResult<T>): Record<string, string> {
    const errorsMap: Record<string, string> = {};

    if(backendResult.errors && backendResult.errors.length > 0) {
        backendResult.errors.forEach((e) => {
            if(e.code.toLowerCase().includes("mismatch")) errorsMap["oldPassword"] = e.message || "Invalid password";
            else errorsMap["newPassword"] = e.message || "Invalid password";
        })
    }

    return errorsMap;
}