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
            .Where(x => x.Value!.Errors.Any())
            .SelectMany(x => x.Value!.Errors.Select(e 
                => new Error(x.Key, e.ErrorMessage)))
            .Distinct()
            .ToArray();

        context.Result = new BadRequestObjectResult(ApiResponse.Validation(errors));
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.Result is not ObjectResult objectResult) return;

        var value = objectResult.Value;

        if (value is not Result result) return;
        
        var type = value.GetType();
        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Result<>))
        {
            var dataProperty = type.GetProperty("Value");
            var dataValue = dataProperty?.GetValue(value);

            var apiResponse = ResponseFactory.FromGenericResult(result, dataValue);
                
            context.Result = result.IsSuccess 
                ? new OkObjectResult(apiResponse) 
                : new BadRequestObjectResult(apiResponse);
        }
        else
        {
            var apiResponse = ResponseFactory.FromResult(result);
                
            context.Result = result.IsSuccess 
                ? new OkObjectResult(apiResponse) 
                : new BadRequestObjectResult(apiResponse);
        }
    }
}