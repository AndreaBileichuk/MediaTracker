import type { BackendResult } from "../api/types";

export function mapBackendErrors<T>(backendResult: BackendResult<T>): Record<string, string> {
    const errorsMap: Record<string, string> = {};

    if (backendResult.errors && backendResult.errors.length > 0) {
        backendResult.errors.forEach((e) => {
            if (e.code.includes("Email")) errorsMap["Email"] = e.message || "Invalid email";
            else if (e.code.includes("Password")) errorsMap["Password"] = e.message || "Invalid password";
            else errorsMap[e.code] = e.message || "Error";
        });
    }

    return errorsMap;
}