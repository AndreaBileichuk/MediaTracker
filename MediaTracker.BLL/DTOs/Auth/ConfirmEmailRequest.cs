namespace MediaTracker.BLL.DTOs.Auth;

public record ConfirmEmailRequest(string UserId, string Code);