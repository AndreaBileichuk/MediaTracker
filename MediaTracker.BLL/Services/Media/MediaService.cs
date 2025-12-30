using MediaTracker.BLL.DTOs.Media;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Data;
using MediaTracker.DAL.Entities;
using MediaTracker.DAL.Enums;
using Microsoft.EntityFrameworkCore;

namespace MediaTracker.BLL.Services.Media;


public class MediaService(ApplicationDbContext context) : IMediaService
{
    private readonly int _pageSize = 10;
    
    public async Task<Result<MediaListResponse>> GetAsync(int page, string? userId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return Result.Failure<MediaListResponse>(AuthErrors.UserNotFound);
        }

        if (page < 1) page = 1;
        
        var query = context.MediaItems
            .AsNoTracking()
            .Where(m => m.ApplicationUserId == userId);

        var totalCount = await query.CountAsync();
        
        var totalPages = (int)Math.Ceiling((double)totalCount / _pageSize);
        
        var items = await query
            .OrderByDescending(m => m.DateAdded) 
            .Skip(_pageSize * (page - 1))
            .Take(_pageSize)
            .Select(m => new MediaItemResponse
            {
                Id = m.Id,
                Title = m.Title,
                PosterPath = m.PosterPath,
                Status = m.Status,
                Type = m.Type
            })
            .ToListAsync();
        
        return Result.Success(new MediaListResponse()
        {
            Results = items,
            TotalPages = totalPages,
        });
    }

    public async Task<Result<MediaItemResponse>> CreateAsync(MediaItemRequest request, string? userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Result.Failure<MediaItemResponse>(AuthErrors.UserNotFound);
        }
        
        var newMediaItem = new MediaItem()
        {
            Title = request.Title,
            PosterPath = request.PosterPath,
            ExternalId = request.ExternalId,
            Type = request.Type,
            Status = EMediaStatus.Want,
            ApplicationUserId = userId
        };

        var result = await context.MediaItems.AddAsync(newMediaItem);
        
        await context.SaveChangesAsync();

        return Result.Success(new MediaItemResponse()
        {
            Id = result.Entity.Id
        });
    }
}