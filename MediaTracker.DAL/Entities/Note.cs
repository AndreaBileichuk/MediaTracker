using MediaTracker.DAL.Enums;

namespace MediaTracker.DAL.Entities;

public class Note
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    
    public string Text { get; set; } = string.Empty;

    public ENoteType Type { get; set; } = ENoteType.General;

    public TimeSpan? Timestamp { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int MediaItemId { get; set; }

    public MediaItem? MediaItem { get; set; }
}