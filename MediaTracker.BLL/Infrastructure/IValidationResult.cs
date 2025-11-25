namespace MediaTracker.BLL.Infrastructure;

public interface IValidationResult
{
    public static readonly Error ValidationError = new("Validation.Error", "A validation problem occurred.");

    Error[] Errors { get; }
}