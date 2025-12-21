using MediaTracker.BLL.Infrastructure;

namespace MediaTracker.BLL.Errors;

public static class MediaErrors
{
    public static readonly Error ProviderRequestFailed = new(
        "Media.ProviderRequestFailed", 
        "Failed to fetch data from the external media provider.");

    public static readonly Error ExternalIdNotFound = new(
        "Media.ExternalIdNotFound", 
        "The media item with the provided external ID was not found.");

    public static readonly Error NotFound = new(
            "Media.NotFound",
            "The media you're trying to find by id was not found."
        );
}