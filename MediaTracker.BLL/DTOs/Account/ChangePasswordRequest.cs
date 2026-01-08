namespace MediaTracker.BLL.DTOs.Account;

public record ChangePasswordRequest(string OldPassword, string NewPassword);