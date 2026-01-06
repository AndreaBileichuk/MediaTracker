using FluentValidation;
using MediaTracker.BLL.DTOs.Media;

namespace MediaTracker.BLL.DTOs.Validator;

public class RateMediaRequestValidator : AbstractValidator<RateMediaRequest>
{
    public RateMediaRequestValidator()
    {
        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 10)
            .WithMessage("Rating must be between 1 and 10.");
    }
}