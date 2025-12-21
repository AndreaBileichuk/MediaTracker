using MediaTracker.BLL.Infrastructure;

namespace MediaTracker.Presentation.Helpers;

public class ApiResponse
{
    public bool IsSuccess { get; init; }
    public string Code { get; init; } = "OK";
    public string? Message { get; init; }
    public IEnumerable<Error>? Errors { get; init; }

    public static ApiResponse Success(string message = "Success") => 
        new() { IsSuccess = true, Message = message };

    public static ApiResponse Failure(Error error) => 
        new() { IsSuccess = false, Code = error.Code, Message = error.Message };

    public static ApiResponse Validation(IEnumerable<Error> errors) => 
        new() { IsSuccess = false, Code = "Validation.Error", Message = "Validation failed", Errors = errors };
}

public class ApiResponse<T> : ApiResponse
{
    public T? Data { get; init; }

    public static ApiResponse<T> Success(T data, string message = "Success") => 
        new() { IsSuccess = true, Message = message, Data = data };
        
    public new static ApiResponse<T> Failure(Error error) => 
        new() { IsSuccess = false, Code = error.Code, Message = error.Message };

    public new static ApiResponse<T> Validation(IEnumerable<Error> errors) => 
        new() { IsSuccess = false, Code = "Validation.Error", Message = "Validation failed", Errors = errors };
}