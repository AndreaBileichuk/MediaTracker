using MediaTracker.BLL.Infrastructure;

namespace MediaTracker.BLL.Errors;

public static class MediaErrors
{
    public static readonly Error ProviderRequestFailed = new(
        "Media.ProviderRequestFailed", 
        "Failed to fetch data from the external media provider.");

    public static readonly Error ProviderInvalidResponse = new(
        "Media.ProviderInvalidResponse", 
        "Something is wrong with provided data.");

    public static readonly Error NotFound = new(
            "Media.NotFound",
            "The media you're trying to find by id was not found."
        );

    public static readonly Error AlreadyExists = new(
        "Media.AlreadyExists", 
        "The media you are trying to add is already in your list.");

}