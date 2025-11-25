using MediaTracker.BLL.Infrastructure;

namespace MediaTracker.Presentation.Helpers;

public class ActionResultFactory
{
    public static object ValidationActionResult(IValidationResult validationResult) => new{
        IsSuccess = false,
        Code = IValidationResult.ValidationError.Code,
        Message = IValidationResult.ValidationError.Message,
        Errors = validationResult.Errors.Select(e => new { e.Code, e.Message })
    };

    public static object ResultActionResult(Result result) => new
    {
        IsSuccess = result.IsSuccess,
        Code = result.Error.Code,
        Message = result.Error.Message
    };
}