namespace MediaTracker.BLL.DTOs.MediaProvider;

public class MediaProviderResponse
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Overview { get; set; } = string.Empty;

    public string? PosterPath { get; set; }

    public string? ReleaseDate { get; set; }

    public bool IsAdult { get; set; }
}

public class MediaSearchResponse
{
    public List<MediaProviderResponse> Results { get; set; } = [];
    public int TotalPages { get; set; }
}