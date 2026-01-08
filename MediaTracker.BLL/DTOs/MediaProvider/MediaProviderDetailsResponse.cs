namespace MediaTracker.BLL.DTOs.MediaProvider;

public class MediaProviderDetailsResponse : MediaProviderResponse
{
    public string? BackdropPath { get; set; }

    public int? Runtime { get; set; }
    
    public string? Status { get; set; }

    public string? Tagline { get; set; }
    
    public double VoteAverage { get; set; }

    public int VoteCount { get; set; }

    public List<TmdbGenreDto> Genres { get; set; } = [];

    public List<SeasonsResponse>? Seasons { get; set; }
}

public class SeasonsResponse
{
    public int Id { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string Overview { get; set; } = string.Empty;
    
    public string? PosterPath { get; set; } = string.Empty;
    
    public int SeasonNumber { get; set; }
    
    public int EpisodeCount { get; set; }

    public string AirDate { get; set; } = string.Empty;
}