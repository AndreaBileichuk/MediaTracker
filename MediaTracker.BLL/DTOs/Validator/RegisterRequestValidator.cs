using FluentValidation;
using MediaTracker.BLL.DTOs.Auth;

namespace MediaTracker.BLL.DTOs.Validator;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty().WithErrorCode("UserName.Required")
            .WithMessage("Username is required.")
            .MinimumLength(4)
            .WithMessage("Username must be at least 4 characters")
            .MaximumLength(15)
            .WithMessage("Username must be less than 15 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithErrorCode("Email.Required").WithMessage("Email is required.")
            .EmailAddress().WithErrorCode("Email.Invalid")
            .WithMessage("A valid email is required.");

        RuleFor(x => x.Password)
            .NotEmpty().WithErrorCode("Password.Required").WithMessage("Password is required!")
            .MinimumLength(6).WithErrorCode("Password.TooShort")
            .WithMessage("Password must be at least 6 characters.");
    }
}