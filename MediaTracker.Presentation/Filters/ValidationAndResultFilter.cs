using MediaTracker.BLL.Infrastructure;
using MediaTracker.Presentation.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MediaTracker.Presentation.Filters;

public class ValidationAndResultFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (context.ModelState.IsValid) return;

        var errors = context.ModelState
            .SelectMany(kvp => kvp.Value!.Errors
                .Select(e => new Error(kvp.Key, e.ErrorMessage))).ToArray();

        var validationResult = ValidationResult.WithErrors(errors);
        context.Result = new BadRequestObjectResult(
            ActionResultFactory.ValidationActionResult(validationResult));
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.Result is ObjectResult objectResult
            && objectResult.Value is Result result)
        {
            if (result is IValidationResult validationResult)
            {
                context.Result = new BadRequestObjectResult(ActionResultFactory.ValidationActionResult(validationResult));
                return;
            }

            if (result.IsSuccess)
            {
                context.Result = new OkObjectResult(result);
            }
            else
            {
                context.Result = new BadRequestObjectResult(ActionResultFactory.ResultActionResult(result));
            }
        }
    }
}