using System.Security.Claims;
using FluentValidation;
using MediaTracker.BLL.DTOs;
using MediaTracker.BLL.DTOs.Auth;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.Auth;
using MediaTracker.Presentation.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
    
namespace MediaTracker.Presentation.Controllers;
    
[Route("[controller]")]
public class AuthController(IAuthService service) : ControllerBase
{   
    [HttpPost("[action]")]
    public async Task<Result<string>> Login([FromBody] LoginRequest loginRequest)
    {
        return await service.LoginAsync(loginRequest);
    }
    
    [HttpPost("[action]")]
    public async Task<Result<string>> Register([FromBody] RegisterRequest registerRequest)
    {
        return await service.RegisterAsync(registerRequest);
    }
    
    [Authorize]
    [HttpGet("[action]")]
    public async Task<Result<UserResponse>> Me()
    {
        return await service.GetMeAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
    }
}