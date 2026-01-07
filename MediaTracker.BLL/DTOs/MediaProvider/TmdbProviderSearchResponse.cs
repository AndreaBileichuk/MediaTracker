using System.Text.Json.Serialization;
 
namespace MediaTracker.BLL.DTOs.MediaProvider;
 
public class TmdbProviderSearchResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    
    // MOVIE specific
    [JsonPropertyName("title")]
    public string? Title { get; set; } 
    
    [JsonPropertyName("release_date")]
    public string? ReleaseDate { get; set; }

    // SERIES specific
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("first_air_date")]
    public string? FirstAirDate { get; set; }
    
    // Shared
    [JsonPropertyName("overview")]
    public string Overview { get; set; } = string.Empty;
    
    [JsonPropertyName("poster_path")]
    public string? PosterPath { get; set; }
    
    [JsonPropertyName("adult")]
    public bool IsAdult { get; set; }
}

public class TmdbProviderSearchResponseList
{
    [JsonPropertyName("results")]
    public List<TmdbProviderSearchResponse> Results { get; set; }

    [JsonPropertyName("total_pages")]
    public int TotalPages { get; set; }
}