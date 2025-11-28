namespace MediaTracker.BLL.Settings;

public class TmdbOptions
{
    public const string SectionName = "Tmdb";

    public string ApiKey { get; set; } = string.Empty;

    public string BaseUrl { get; set; } = string.Empty;

    public string ImageBaseUrl { get; set; } = string.Empty;    
}