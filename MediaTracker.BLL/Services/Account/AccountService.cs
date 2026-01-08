using MediaTracker.BLL.DTOs.Account;
using MediaTracker.BLL.DTOs.Auth;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.PhotoService;
using MediaTracker.DAL.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace MediaTracker.BLL.Services.Account;

public class AccountService(UserManager<ApplicationUser> userManager, IPhotoService service) : IAccountService
{
    public async Task<Result<string>> SetUserAvatarAsync(string userId, IFormFile file)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null) return Result.Failure<string>(AuthErrors.UserNotFound);
        
        if (!string.IsNullOrEmpty(user.AvatarUrl))
        {
            var publicId = GetPublicIdFromUrl(user.AvatarUrl);
            await service.DeletePhotoAsync(publicId);
        }
        
        var uploadResult = await service.AddPhotoAsync(file);
        if (!uploadResult.IsSuccess) return Result.Failure<string>(uploadResult.Error);

        user.AvatarUrl = uploadResult.Value!.SecureUrl.AbsoluteUri;
        
        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded) 
            return Result.Failure<string>(new Error("User.UpdateFailed", "Failed to update user in DB"));

        return Result.Success(user.AvatarUrl);
    }
    
    public async Task<Result<UserResponse>> GetMeAsync(string userId)
    {
        var applicationUser =  await userManager.FindByIdAsync(userId);

        if (applicationUser == null)
        {
            return Result.Failure<UserResponse>(AuthErrors.UserNotFound);
        }

        var user = new UserResponse(
            applicationUser.AvatarUrl,
            applicationUser.Email!,
            applicationUser.UserName!
            );

        return Result.Success(user);
    }

    public async Task<Result> ChangePasswordAsync(string userId, ChangePasswordRequest request)
    {
        var user = await userManager.FindByIdAsync(userId);
 
        if (user is null) return Result.Failure(AuthErrors.UserNotFound);

        var result = await userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);

        if (result.Succeeded)
        {
            return Result.Success();
        }

        var errors = result.Errors.Select(e => new Error(e.Code, e.Description)).ToArray();

        return ValidationResult<string>.WithErrors(errors);
    }

    private static string GetPublicIdFromUrl(string url)
    {
        var uri = new Uri(url);
        var segment = uri.Segments.Last(); 
        var fileName = Path.GetFileNameWithoutExtension(segment);
    
        return fileName;
    }
}