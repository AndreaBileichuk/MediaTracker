using MediaTracker.BLL.Infrastructure;

namespace MediaTracker.BLL.Errors;

public static class AuthErrors
{
    public static readonly Error InvalidCredentials = new(
        "Auth.InvalidCredentials",
        "Invalid email or password"
        );

    public static readonly Error EmailTaken = new(
        "Auth.EmailTaken",
        "Email already taken"
        );

    public static readonly Error UserNotFound = new(
        "Auth.UserNotFound",
        "User not found");
}