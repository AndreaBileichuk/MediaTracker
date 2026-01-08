using MediaTracker.BLL.DTOs.Account;
using MediaTracker.BLL.DTOs.Auth;
using MediaTracker.BLL.Infrastructure;
using Microsoft.AspNetCore.Http;

namespace MediaTracker.BLL.Services.Account;

public interface IAccountService
{
    Task<Result<string>> SetUserAvatarAsync(string userId, IFormFile file);
    
    Task<Result<UserResponse>> GetMeAsync(string userId);

    Task<Result> ChangePasswordAsync(string userId, ChangePasswordRequest request);
}