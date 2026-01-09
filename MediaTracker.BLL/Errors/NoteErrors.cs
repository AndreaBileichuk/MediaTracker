using MediaTracker.BLL.Infrastructure;

namespace MediaTracker.BLL.Errors;

public static class NoteErrors
{
    public static readonly Error NotFoundDeletion = new(
        "Note.NotFoundDeletion",
        "The note you're trying to delete was not found.");
    
    public static readonly Error NotFound = new(
        "Note.NotFound",
        "The note you're trying to find was not found.");
}