using MediaTracker.BLL.DTOs.Note;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Data;
using Microsoft.EntityFrameworkCore;

namespace MediaTracker.BLL.Services.Note;

public class NoteService(ApplicationDbContext context) : INoteService
{
    private readonly int _pageSize = 5;
    
    public async Task<Result<NoteListResponse>> GetAsync(string? userId, int mediaItemId, int page = 0)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return Result.Failure<NoteListResponse>(AuthErrors.Unauthorized);

        if (page < 0) page = 0;

        var media = await context.MediaItems.FindAsync(mediaItemId);

        if (media is null)
            return Result.Failure<NoteListResponse>(MediaErrors.NotFound);

        var query = context.Notes
                .Where(n => n.MediaItemId == mediaItemId && media.ApplicationUserId == userId);

        var totalCount = await query.CountAsync();
        
        var totalPages = (int)Math.Ceiling((double)totalCount / _pageSize);
        
        var items = await query
            .OrderByDescending(m => m.CreateAt) 
            .Skip(_pageSize * (page - 1))
            .Take(_pageSize)
            .Select(m => new NoteResponse(m.Id, m.Text, m.CreateAt))
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
            Text = request.Text,
            MediaItemId = mediaItemId,
            CreateAt = DateTime.UtcNow
        };

        var entity = (await context.Notes.AddAsync(note)).Entity;

        await context.SaveChangesAsync();

        return Result.Success(new NoteResponse(entity.Id, entity.Text, entity.CreateAt));
    }

    public async Task<Result> DeleteAsync(string? userId, int mediaItemId, int noteId)
    {
        throw new NotImplementedException();
    }
}