using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MediaTracker.BLL.DTOs.Auth;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.Email;
using MediaTracker.BLL.Settings;
using MediaTracker.DAL.Data;
using MediaTracker.DAL.Entities;
using Microsoft.AspNetCore.Identity;
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
        
        if (result.Succeeded)
        {
            return Result.Success(GenerateToken(user));
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