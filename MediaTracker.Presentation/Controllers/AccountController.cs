using System.Security.Claims;
using MediaTracker.BLL.DTOs.Auth;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediaTracker.Presentation.Controllers;

[Authorize]
[Route("[controller]")]
public class AccountController(IAccountService service) : ControllerBase
{
    [HttpPost("avatar")]
    public async Task<Result<string>> UploadAvatar(IFormFile file)
    {
        return await service.SetUserAvatarAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!, file);    
    }
    
    [HttpGet("me")]
    public async Task<Result<UserResponse>> GetMe()
    {
        return await service.GetMeAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}