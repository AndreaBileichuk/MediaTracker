using MediaTracker.BLL.DTOs.Note;
using MediaTracker.BLL.Infrastructure;

namespace MediaTracker.BLL.Services.Note;

public interface INoteService
{
    Task<Result<NoteListResponse>> GetAsync(string? userId, int mediaItemId, int page = 0);

    Task<Result<NoteResponse>> CreateAsync(string? userId, int mediaItemId, CreateNoteRequest request);

    Task<Result> DeleteAsync(string? userId, int mediaItemId, int noteId);
}