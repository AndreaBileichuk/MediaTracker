using System.Text.Json.Serialization;

namespace MediaTracker.BLL.DTOs.MediaProvider;

public class TmdbGenreDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}