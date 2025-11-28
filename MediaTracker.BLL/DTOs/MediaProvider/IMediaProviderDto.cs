using System.Text.Json.Serialization;

namespace MediaTracker.BLL.DTOs.MediaProvider;

public interface IMediaProviderDto
{
    public int Id { get; set; }

    public string Title { get; set; }

    public string Overview { get; set; }

    public string? PosterPath { get; set; }

    public string? ReleaseDate { get; set; }

    public bool IsAdult { get; set; }
}