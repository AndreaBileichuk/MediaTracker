using MediaTracker.DAL.Enums;

namespace MediaTracker.BLL.DTOs.Media;

public class MediaItemRequest
{
    public string Title { get; set; } = string.Empty;

    public string PosterPath { get; set; } = string.Empty;

    public int ExternalId { get; set; }
    
    public EMediaType Type { get; set; }
}