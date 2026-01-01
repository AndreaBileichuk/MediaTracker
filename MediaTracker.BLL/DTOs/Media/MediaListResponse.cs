namespace MediaTracker.BLL.DTOs.Media;

public class MediaListResponse
{
    public List<MediaItemResponse> Results { get; set; } = [];

    public int TotalPages { get; set; }

    public int TotalCount { get; set; }
}