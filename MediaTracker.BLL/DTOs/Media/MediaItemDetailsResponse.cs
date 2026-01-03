using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.DAL.Enums;

namespace MediaTracker.BLL.DTOs.Media;

public class MediaItemDetailsResponse
{
    public int Id { get; set; }
    
    public EMediaType Type { get; set; }

    public EMediaStatus Status { get; set; }

    public int? UserRating { get; set; }

    public MediaProviderDetailsResponse MediaInfo { get; set; }
}