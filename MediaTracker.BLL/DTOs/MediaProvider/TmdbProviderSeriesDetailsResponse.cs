using System.Text.Json.Serialization;

namespace MediaTracker.BLL.DTOs.MediaProvider;

public class TmdbProviderSeriesDetailsResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    
    [JsonPropertyName("name")]
    public string Title { get; set; } = string.Empty;
    
    [JsonPropertyName("overview")]
    public string Overview { get; set; } = string.Empty;
    
    [JsonPropertyName("poster_path")]
    public string? PosterPath { get; set; }

    [JsonPropertyName("backdrop_path")]
    public string? BackdropPath { get; set; }

    [JsonPropertyName("first_air_date")]
    public string? ReleaseDate { get; set; }
    
    [JsonPropertyName("adult")]
    public bool IsAdult { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }

    [JsonPropertyName("tagline")]
    public string? Tagline { get; set; }
    
    [JsonPropertyName("vote_average")]
    public double VoteAverage { get; set; }

    [JsonPropertyName("vote_count")]
    public int VoteCount { get; set; }
    
    [JsonPropertyName("genres")]
    public List<TmdbGenreDto> Genres { get; set; } = new();

    [JsonPropertyName("seasons")]
    public List<TmdbSeasonsResponse> Seasons { get; set; } = new();
}

public class TmdbSeasonsResponse
{
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("overview")]
    public string Overview { get; set; } = string.Empty;
    
    [JsonPropertyName("poster_path")]
    public string? PosterPath { get; set; } = string.Empty;
    
    [JsonPropertyName("season_number")]
    public int SeasonNumber { get; set; }
    
    [JsonPropertyName("episode_count")]
    public int EpisodeCount { get; set; }

    [JsonPropertyName("air_date")]
    public string AirDate { get; set; } = string.Empty;
}