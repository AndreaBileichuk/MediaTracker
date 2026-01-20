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
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace MediaTracker.BLL.Services.Auth;

public class AuthService(
    IOptions<JwtOptions> jwtOptions,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    ApplicationDbContext context,
    IEmailService emailService) : IAuthService
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

    private string GenerateToken(ApplicationUser user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Value.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new Claim(ClaimTypes.Name, user.UserName ?? "")
        };
        
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Issuer = jwtOptions.Value.Issuer,
            Audience = jwtOptions.Value.Audience,
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(jwtOptions.Value.ExpireDays),
            SigningCredentials = creds
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        
        return tokenHandler.WriteToken(token);
    }
}