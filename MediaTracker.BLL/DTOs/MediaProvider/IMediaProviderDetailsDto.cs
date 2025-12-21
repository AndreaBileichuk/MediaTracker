namespace MediaTracker.BLL.DTOs.MediaProvider;

public interface IMediaProviderDetailsDto : IMediaProviderDto
{
    public string? BackdropPath { get; set; }

    public int? Runtime { get; set; }
    
    public string? Status { get; set; }

    public string? Tagline { get; set; }
    
    public double VoteAverage { get; set; }

    public int VoteCount { get; set; }
    
    public List<TmdbGenreDto> Genres { get; set; }
}