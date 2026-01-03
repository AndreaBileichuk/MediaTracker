using MediaTracker.DAL.Entities;
using MediaTracker.DAL.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MediaTracker.DAL.Configuration;

public class MediaItemConfiguration : IEntityTypeConfiguration<MediaItem>
{
    public void Configure(EntityTypeBuilder<MediaItem> builder)
    {
        builder.ToTable("MediaItems", "App", t =>
        {
            t.HasCheckConstraint("CK_MediaItems_UserRating_Range", 
                "\"UserRating\" IS NULL OR (\"UserRating\" >= 1 AND \"UserRating\" <= 10)");
        });

        builder.HasKey(mi => mi.Id);

        builder.Property(mi => mi.Title)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(mi => mi.Type)
            .IsRequired();

        builder.Property(mi => mi.Status)
            .IsRequired()
            .HasDefaultValue(EMediaStatus.Planned);

        builder.Property(mi => mi.UserRating)
            .IsRequired(false);
        
        builder.Property(mi => mi.DateAdded)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(mi => mi.User)
            .WithMany(u => u.MediaItems)
            .HasForeignKey(mi => mi.ApplicationUserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}