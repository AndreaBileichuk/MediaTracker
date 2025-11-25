using MediaTracker.BLL.DTOs.Auth;
using MediaTracker.BLL.Infrastructure;

namespace MediaTracker.BLL.Services.Auth;

public interface IAuthService
{
    Task<Result<string>> LoginAsync(LoginRequest loginRequest);

    Task<Result<string>> RegisterAsync(RegisterRequest registerRequest);

    Task<Result<UserResponse>> GetMeAsync(string? userId);
}