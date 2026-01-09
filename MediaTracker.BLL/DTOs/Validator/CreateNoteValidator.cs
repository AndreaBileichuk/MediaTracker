using FluentValidation;
using FluentValidation.Validators;
using MediaTracker.BLL.DTOs.Note;

namespace MediaTracker.BLL.DTOs.Validator;

public class CreateNoteValidator : AbstractValidator<CreateNoteRequest>
{
    public CreateNoteValidator()
    {
        RuleFor(x => x.Text)
            .MinimumLength(10)
            .WithMessage("Your note should be at least 10 characters!")
            .MaximumLength(2000)
            .WithMessage("Your note should be less than 2000 characters!");
    }
}