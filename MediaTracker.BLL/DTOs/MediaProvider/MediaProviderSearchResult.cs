namespace MediaTracker.BLL.DTOs.MediaProvider;

public class MediaProviderSearchResult
{
    public string ExternalId { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string? PosterUrl { get; set; }

    public string? Year { get; set; }

    public bool IsAdult { get; set; }

    public string Overview { get; set; } = string.Empty;

    public DateOnly ReleaseDate { get; set; }
}