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
            .WithMessage("Your note's text should be at least 10 characters!")
            .MaximumLength(2000)
            .WithMessage("Your note's text should be less than 2000 characters!");

        RuleFor(x => x.Title)
            .MinimumLength(3)
            .WithMessage("The title should be at least 3 characters!")
            .MaximumLength(40)
            .WithMessage("The title should be less than 40 characters!");
    }
}