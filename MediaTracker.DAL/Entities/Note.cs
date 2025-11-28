namespace MediaTracker.DAL.Entities;

public class Note
{
    public int Id { get; set; }

    public string Text { get; set; } = string.Empty;

    public DateTime CreateAt { get; set; } = DateTime.UtcNow;

    public int MediaItemId { get; set; }

    public MediaItem? MediaItem { get; set; }
}