using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MediaTracker.BLL.DTOs.Auth;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.Email;
using MediaTracker.BLL.Settings;
using MediaTracker.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace MediaTracker.BLL.Services.Auth;

public class AuthService(
    IOptions<JwtOptions> jwtOptions,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IEmailService emailService,
    IConfiguration configuration
    ) : IAuthService
{
    public async Task<Result<string>> LoginAsync(LoginRequest loginRequest)
    {
        var user = await userManager.FindByEmailAsync(loginRequest.Email);
        
        if (user == null)
        {
            return Result.Failure<string>(AuthErrors.InvalidCredentials);
        }
        
        var result = await signInManager.CheckPasswordSignInAsync(user, loginRequest.Password, lockoutOnFailure: false);
        
        if (result.Succeeded) return Result.Success(GenerateToken(user));
        
        if (result.IsNotAllowed && !user.EmailConfirmed)
        {
            return Result.Failure<string>(AuthErrors.EmailNotConfirmed);
        } 
        
        return Result.Failure<string>(AuthErrors.InvalidCredentials);
    }

    public async Task<Result<string>> RegisterAsync(RegisterRequest registerRequest)
    {
        var user = new ApplicationUser()
        {
            Email = registerRequest.Email,
            UserName = registerRequest.UserName
        };
        
        var result = await userManager.CreateAsync(user, registerRequest.Password);
        
        if (result.Succeeded)
        {
            await ResendConfirmation(new ResendConfirmationEmailRequest(user.Email));
            return Result.Success(GenerateToken(user));
        }

        var errors =  result.Errors
            .Select(e => new Error(e.Code, e.Description))
            .ToArray();
        
        return ValidationResult<string>.WithErrors(errors);
    }

    public async Task<Result> ForgotPasswordAsync(ForgotPasswordRequest forgotPasswordRequest)
    {
        var user = await userManager.FindByEmailAsync(forgotPasswordRequest.Email);

        if (user == null)
            return Result.Success();

        if (user.Email == null || configuration["FrontEndUrl"] == null)
            return Result.Failure(GeneralErrors.SomethingWentWrong);

        var token = await userManager.GeneratePasswordResetTokenAsync(user);

        var encodedToken = Uri.EscapeDataString(token);
        var frontendUrl = configuration["FrontEndUrl"];

        var resetLink = $"{frontendUrl}/reset-password?token={encodedToken}&email={user.Email}";

        await emailService.SendEmailAsync(user.Email, "Reset Password", 
            $"<a href='{resetLink}'>Click here to reset</a>");

        return Result.Success();
    }

    public async Task<Result> ResetPasswordAsync(ResetPasswordRequest resetPasswordRequest)
    {
        var user = await userManager.FindByEmailAsync(resetPasswordRequest.Email);

        if (user is null) return Result.Failure(AuthErrors.UserNotFound);

        var result = await userManager.ResetPasswordAsync(user, resetPasswordRequest.Token, resetPasswordRequest.NewPassword);

        if (result.Succeeded) return Result.Success();
        
        var errors =  result.Errors
            .Select(e => new Error(e.Code, e.Description))
            .ToArray();
        
        return ValidationResult.WithErrors(errors);
    }

    public async Task<Result> ConfirmEmail(string? userId, ConfirmEmailRequest confirmEmailRequest)
    {
        if (userId == null || string.IsNullOrWhiteSpace(confirmEmailRequest.code)) return Result.Failure(AuthErrors.Unauthorized);

        var user = await userManager.FindByIdAsync(userId);
        if (user is null) return Result.Failure(AuthErrors.UserNotFound);

        var decodedBytes = WebEncoders.Base64UrlDecode(confirmEmailRequest.code);
        var codeDecoded = Encoding.UTF8.GetString(decodedBytes);

        var result = await userManager.ConfirmEmailAsync(user, codeDecoded);

        if (!result.Succeeded) return Result.Failure(AuthErrors.EmailVerificationInvalidCode);

        return Result.Success();
    }

    public async Task<Result> ResendConfirmation(ResendConfirmationEmailRequest resendConfirmationEmailRequest)
    {
        var user = await userManager.FindByEmailAsync(resendConfirmationEmailRequest.Email);

        if (user is null || user.EmailConfirmed)
        {
            return Result.Success();
        }
        
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            
        var tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);
        var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);
            
        var callbackUrl = $"{configuration["FrontEndUrl"]}/email-confirmation?userId={user.Id}&code={codeEncoded}";

        await emailService.SendEmailAsync(user.Email!, "Confirm your email", 
            $"Please, confirm your account by <a href='{callbackUrl}'>Clicking here</a>.");

        return Result.Success();
    }

    private string GenerateToken(ApplicationUser user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Value.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new Claim(ClaimTypes.Name, user.UserName ?? "")
        };
        
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Issuer = jwtOptions.Value.Issuer,
            Audience = jwtOptions.Value.Audience,
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(jwtOptions.Value.ExpireDays),
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        
        return tokenHandler.WriteToken(token);
    }
}