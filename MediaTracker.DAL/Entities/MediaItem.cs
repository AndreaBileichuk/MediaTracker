using MediaTracker.DAL.Enums;

namespace MediaTracker.DAL.Entities;

public class MediaItem
{
    public int Id { get; set; }
    
    public string Title { get; set; } = string.Empty;

    public string PosterPath { get; set; } = string.Empty;

    public int ExternalId { get; set; }
    
    public EMediaType Type { get; set; }

    public EMediaStatus Status { get; set; }

    public int? UserRating { get; set; }

    public List<Note> UserNotes { get; set; } = [];

    public DateTime DateAdded { get; set; } = DateTime.UtcNow;

    public string ApplicationUserId { get; set; } = string.Empty;

    public ApplicationUser? User { get; set; }
}