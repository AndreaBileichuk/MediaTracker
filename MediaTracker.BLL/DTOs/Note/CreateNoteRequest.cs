using MediaTracker.DAL.Enums;

namespace MediaTracker.BLL.DTOs.Note;

public record CreateNoteRequest(
    string Title,
    string Text,
    ENoteType Type,
    TimeSpan? Timestamp);
