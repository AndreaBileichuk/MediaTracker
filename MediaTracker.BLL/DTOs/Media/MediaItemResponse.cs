using MediaTracker.DAL.Enums;

namespace MediaTracker.BLL.DTOs.Media;

public class MediaItemResponse
{
    public int Id { get; set; }
    
    public string Title { get; set; } = string.Empty;

    public string PosterPath { get; set; } = string.Empty;

    public EMediaType Type { get; set; }

    public EMediaStatus Status { get; set; }

}