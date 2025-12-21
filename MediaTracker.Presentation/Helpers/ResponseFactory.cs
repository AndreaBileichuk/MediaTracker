using System.Reflection;
using MediaTracker.BLL.Infrastructure;

namespace MediaTracker.Presentation.Helpers;

public static class ResponseFactory
{
    public static ApiResponse FromResult(Result result)
    {
        if (result is IValidationResult validation)
            return ApiResponse.Validation(validation.Errors);

        if (result.IsSuccess)
            return ApiResponse.Success();

        return ApiResponse.Failure(result.Error);
    }

    public static object FromGenericResult(Result result, object? value)
    {
        if (result is IValidationResult validation)
        {
            var resultType = result.GetType();
            var valueType = resultType.GetGenericArguments()[0];
            
            var responseType = typeof(ApiResponse<>).MakeGenericType(valueType);
            var method = responseType.GetMethod("Validation", BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy);
            
            return method!.Invoke(null, new object[] { validation.Errors })!;
        }

        if (!result.IsSuccess)
        {
            var resultType = result.GetType();
            var valueType = resultType.GetGenericArguments()[0];
            var responseType = typeof(ApiResponse<>).MakeGenericType(valueType);
            var method = responseType.GetMethod("Failure", BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy);
            
            return method!.Invoke(null, new object[] { result.Error })!;
        }
        else
        {
            var resultType = result.GetType();
            var valueType = resultType.GetGenericArguments()[0];
            
            var responseType = typeof(ApiResponse<>).MakeGenericType(valueType);
            var method = responseType.GetMethod("Success", 
                BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy,
                null,
                new Type[] {valueType, typeof(string)}
                ,null);
            
            if (method == null)
            {
                throw new InvalidOperationException($"Method 'Success' not found on type {responseType.Name}");
            }

            return method.Invoke(null, new object[] { value!, "Success" })!;
        }
    }
}