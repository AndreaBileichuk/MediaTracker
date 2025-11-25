using Microsoft.AspNetCore.Identity;

namespace MediaTracker.DAL.Entities;

public class ApplicationUser : IdentityUser
{
    public List<MediaItem> MediaItems { get; set; } = [];
}