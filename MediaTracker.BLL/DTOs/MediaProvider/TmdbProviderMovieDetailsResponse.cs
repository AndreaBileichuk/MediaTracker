using System.Text.Json.Serialization;

namespace MediaTracker.BLL.DTOs.MediaProvider;

public class TmdbProviderMovieDetailsResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    
    [JsonPropertyName("overview")]
    public string Overview { get; set; } = string.Empty;
    
    [JsonPropertyName("poster_path")]
    public string? PosterPath { get; set; }

    [JsonPropertyName("backdrop_path")]
    public string? BackdropPath { get; set; }

    [JsonPropertyName("runtime")]
    public int? Runtime { get; set; }
    
    [JsonPropertyName("release_date")]
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
}