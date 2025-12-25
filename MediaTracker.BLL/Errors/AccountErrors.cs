using MediaTracker.BLL.Infrastructure;

namespace MediaTracker.BLL.Errors;

public static class AccountErrors
{
    public static readonly Error InvalidImage = new(
        "Account.InvalidImage",
        "File is too small."
    );

    public static readonly Error UpdateFailed = new("User.UpdateFailed", "Failed to update user in DB");
}