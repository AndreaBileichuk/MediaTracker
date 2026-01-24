using System.Security.Claims;
using MediaTracker.BLL.DTOs.Auth;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.Auth;
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

    [HttpPost("forgot-password")]
    public async Task<Result> ForgotPassword([FromBody] ForgotPasswordRequest forgotPasswordRequest)
    {
        return await service.ForgotPasswordAsync(forgotPasswordRequest);
    }

    [HttpPost("reset-password")]
    public async Task<Result> ResetPassword([FromBody] ResetPasswordRequest resetPasswordRequest)
    {
        return await service.ResetPasswordAsync(resetPasswordRequest);
    }

    [HttpPost("confirm-email")]
    public async Task<Result> ConfirmEmail([FromBody] ConfirmEmailRequest confirmEmailRequest)
    {
        return await service.ConfirmEmail(confirmEmailRequest);
    }

    [HttpPost("resend-confirmation-email")]
    public async Task<Result> ResendConfirmation([FromBody] ResendConfirmationEmailRequest resendConfirmationEmailRequest)
    {
        return await service.ResendConfirmation(resendConfirmationEmailRequest);
    }
}