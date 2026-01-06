
export interface ApiError {
    code: string,
    message: string | null
}

export interface BackendResult<T> {
    data?: T,
    isSuccess: boolean,
    code: string,
    message: string,
    errors: ApiError[],
}

export const VALIDATION_ERROR = "Validation.Error";