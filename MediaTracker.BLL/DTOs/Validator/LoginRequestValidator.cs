using FluentValidation;
using MediaTracker.BLL.DTOs.Auth;

namespace MediaTracker.BLL.DTOs.Validator;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Password)
            .NotEmpty()
            .WithErrorCode("Auth.PasswordRequired")
            .WithMessage("Password can't be empty");

        RuleFor(x => x.Email)
            .NotEmpty().WithErrorCode("Auth.EmailRequired").WithMessage("Email can't be empty")
            .EmailAddress().WithErrorCode("Auth.EmailInvalidFormat").WithMessage("Email must be in a valid format (e.g., user@example.com)");
    }
}