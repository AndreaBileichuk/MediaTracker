using MediaTracker.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MediaTracker.DAL.Configuration;

public class NotesConfiguration : IEntityTypeConfiguration<Note>
{
    public void Configure(EntityTypeBuilder<Note> builder)
    {
        builder.ToTable("Notes", "App");

        builder.HasKey(n => n.Id);

        builder.Property(n => n.Text)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(n => n.CreateAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .ValueGeneratedOnAdd();

        builder.HasOne(n => n.MediaItem)
            .WithMany(mi => mi.UserNotes)
            .HasForeignKey(n => n.MediaItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}