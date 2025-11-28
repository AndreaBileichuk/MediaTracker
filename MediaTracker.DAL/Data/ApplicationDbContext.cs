using System.Reflection;
using MediaTracker.DAL.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MediaTracker.DAL.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<MediaItem> MediaItems { get; set; }
    
    public DbSet<Note> Notes { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        builder.HasDefaultSchema("Identity");

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}