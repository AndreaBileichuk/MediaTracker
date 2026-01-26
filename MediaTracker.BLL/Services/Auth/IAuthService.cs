using MediaTracker.BLL.DTOs.Auth;
using MediaTracker.BLL.Infrastructure;
using Microsoft.AspNetCore.Identity.Data;
using ForgotPasswordRequest = MediaTracker.BLL.DTOs.Auth.ForgotPasswordRequest;
using LoginRequest = MediaTracker.BLL.DTOs.Auth.LoginRequest;
using RegisterRequest = MediaTracker.BLL.DTOs.Auth.RegisterRequest;
using ResendConfirmationEmailRequest = MediaTracker.BLL.DTOs.Auth.ResendConfirmationEmailRequest;
using ResetPasswordRequest = MediaTracker.BLL.DTOs.Auth.ResetPasswordRequest;

namespace MediaTracker.BLL.Services.Auth;

public interface IAuthService
{
    Task<Result<string>> LoginAsync(LoginRequest loginRequest);

    Task<Result> RegisterAsync(RegisterRequest registerRequest);

    Task<Result> ForgotPasswordAsync(ForgotPasswordRequest forgotPasswordRequest);

    Task<Result> ResetPasswordAsync(ResetPasswordRequest resetPasswordRequest);

    Task<Result> ConfirmEmail(ConfirmEmailRequest confirmEmailRequest);

    Task<Result> SendConfirmation(ResendConfirmationEmailRequest resendConfirmationEmailRequest);
}