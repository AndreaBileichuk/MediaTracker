using Microsoft.AspNetCore.Identity;

namespace MediaTracker.DAL.Entities;

public class ApplicationUser : IdentityUser
{
    public string? AvatarUrl { get; set; }
    
    public List<MediaItem> MediaItems { get; set; } = [];
}