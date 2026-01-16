using MediaTracker.DAL.Enums;

namespace MediaTracker.BLL.DTOs.Note;

public record NoteResponse(
    int Id,
    string Title,
    string Text,
    ENoteType Type,
    TimeSpan? TimeSpan,
    DateTime CreatedAt);
