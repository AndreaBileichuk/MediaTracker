namespace MediaTracker.BLL.DTOs.Auth;

public record RegisterRequest(string UserName, string Email, string Password);