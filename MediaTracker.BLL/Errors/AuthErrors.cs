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

    public static readonly Error Unauthorized = new(
        "Auth.Unauthorized"
        , "User is not authorized");

    public static readonly Error EmailNotConfirmed = new(
        "Auth.EmailNotConfirmed",
        "Please verify your email address to login.");
    
    public static readonly Error EmailVerificationInvalidCode = new(
        "Auth.InvalidCode",
        "The code for email verification is invalid.");
}