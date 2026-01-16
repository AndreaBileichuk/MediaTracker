using MediaTracker.BLL.DTOs.Note;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Data;
using Microsoft.EntityFrameworkCore;

namespace MediaTracker.BLL.Services.Note;

public class NoteService(ApplicationDbContext context) : INoteService
{
    private readonly int _pageSize = 5;
    
    public async Task<Result<NoteListResponse>> GetAsync(string? userId, int mediaItemId, int page = 1)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return Result.Failure<NoteListResponse>(AuthErrors.Unauthorized);

        if (page < 1) page = 1;

        var media = await context.MediaItems.AsNoTracking().FirstOrDefaultAsync(m => m.Id == mediaItemId);

        if (media is null)
            return Result.Failure<NoteListResponse>(MediaErrors.NotFound);

        if (media.ApplicationUserId != userId)
            return Result.Failure<NoteListResponse>(MediaErrors.NotFound);
        
        var query = context.Notes.AsNoTracking()
                .Where(n => n.MediaItemId == mediaItemId && media.ApplicationUserId == userId);

        var totalCount = await query.CountAsync();
        
        var totalPages = (int)Math.Ceiling((double)totalCount / _pageSize);
        
        var items = await query
            .OrderByDescending(note => note.CreatedAt) 
            .Skip(_pageSize * (page - 1))
            .Take(_pageSize)
            .Select(note => new NoteResponse(note.Id, note.Title, note.Text, note.Type, note.Timestamp, note.CreatedAt))
            .ToListAsync();
        
        return Result.Success(new NoteListResponse()
        {
            Results = items,
            TotalPages = totalPages,
        });
    }

    public async Task<Result<NoteResponse>> CreateAsync(string? userId, int mediaItemId, CreateNoteRequest request)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return Result.Failure<NoteResponse>(AuthErrors.Unauthorized);
        
        var media = await context.MediaItems.FindAsync(mediaItemId);

        if (media is null || media.ApplicationUserId != userId)
            return Result.Failure<NoteResponse>(MediaErrors.NotFound);

        var note = new DAL.Entities.Note
        {
            Title = request.Title,
            Text = request.Text,
            Type = request.Type,
            Timestamp = ValidateTimeStamp(request.Timestamp),
            MediaItemId = mediaItemId,
            CreatedAt = DateTime.UtcNow
        };

        context.Notes.Add(note);

        await context.SaveChangesAsync();

        return Result.Success(new NoteResponse(note.Id, note.Title, note.Text, note.Type, note.Timestamp, note.CreatedAt));
    }

    public async Task<Result> DeleteAsync(string? userId, int mediaItemId, int noteId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return Result.Failure(AuthErrors.Unauthorized);
        
        var note = await context.Notes
            .Include(n => n.MediaItem) 
            .FirstOrDefaultAsync(n => n.Id == noteId);
        
        if (note is null || note.MediaItemId != mediaItemId)
            return Result.Failure(NoteErrors.NotFoundDeletion);

        if (note.MediaItem?.ApplicationUserId != userId)
            return Result.Failure(MediaErrors.NotFound);
        
        context.Remove(note);
        await context.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result<NoteResponse>> UpdateAsync(string? userId, int mediaItemId, int noteId, CreateNoteRequest request)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return Result.Failure<NoteResponse>(AuthErrors.Unauthorized);
        
        var note = await context.Notes
            .Include(n => n.MediaItem) 
            .FirstOrDefaultAsync(n => n.Id == noteId);
        
        if (note is null || note.MediaItemId != mediaItemId)
            return Result.Failure<NoteResponse>(NoteErrors.NotFound);

        if (note.MediaItem?.ApplicationUserId != userId)
            return Result.Failure<NoteResponse>(MediaErrors.NotFound);

        note.Text = request.Text;
        note.Title = request.Title;
        note.Timestamp = ValidateTimeStamp(request.Timestamp);
        note.Type = request.Type;
        
        await context.SaveChangesAsync();

        return Result.Success(new NoteResponse(note.Id, note.Title, note.Text, note.Type, note.Timestamp, note.CreatedAt));
    }

    public static TimeSpan? ValidateTimeStamp(string? timestamp)
    {
        if (!string.IsNullOrWhiteSpace(timestamp))
        {
            if (TimeSpan.TryParse(timestamp, out var result))
            {
                return result;
            }
            else if (TimeSpan.TryParse("00:" + timestamp, out var resultMmSs))
            {
                return resultMmSs;
            }
        }

        return null;
    }
}