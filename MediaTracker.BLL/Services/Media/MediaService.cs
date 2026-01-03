using MediaTracker.BLL.DTOs.Media;
using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.MediaProvider;
using MediaTracker.DAL.Data;
using MediaTracker.DAL.Entities;
using MediaTracker.DAL.Enums;
using Microsoft.EntityFrameworkCore;

namespace MediaTracker.BLL.Services.Media;


public class MediaService(ApplicationDbContext context, IMediaProviderManager mediaProviderManager) : IMediaService
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
            TotalCount = totalCount
        });
    }

    public async Task<Result<MediaItemResponse>> CreateAsync(MediaItemRequest request, string? userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Result.Failure<MediaItemResponse>(AuthErrors.UserNotFound);
        }

        var media = await context.MediaItems.SingleOrDefaultAsync(m => m.ApplicationUserId == userId && m.ExternalId == request.ExternalId);

        if (media != null) return Result.Failure<MediaItemResponse>(MediaErrors.AlreadyExists);
        
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

    public async Task<Result<MediaItemDetailsResponse>> GetDetailsAsync(string? userId, int mediaItemId)
    {
        if (string.IsNullOrWhiteSpace(userId)) return Result.Failure<MediaItemDetailsResponse>(AuthErrors.UserNotFound);

        var mediaItem = await context.MediaItems.FindAsync(mediaItemId);

        if (mediaItem is null || mediaItem.ApplicationUserId != userId) return Result.Failure<MediaItemDetailsResponse>(MediaErrors.NotFound);

        var externalMediaResult = await mediaProviderManager.GetByIdAsync($"{mediaItem.ExternalId}", mediaItem.Type);

        if (!externalMediaResult.IsSuccess || externalMediaResult.Value == null) 
            return Result.Failure<MediaItemDetailsResponse>(MediaErrors.NotFound);

        var result = new MediaItemDetailsResponse()
        {
            Id = mediaItem.Id,
            Type = mediaItem.Type,
            Status = mediaItem.Status,
            UserRating = mediaItem.UserRating,
            MediaInfo = externalMediaResult.Value
        };

        return Result.Success(result);
    }

    public async Task<Result> DropAsync(string? userId, int mediaItemId)
    {
        if (string.IsNullOrWhiteSpace(userId)) return Result.Failure(AuthErrors.UserNotFound);
        
        var mediaItem = await context.MediaItems.FindAsync(mediaItemId);

        if (mediaItem is null || mediaItem.ApplicationUserId != userId) 
            return Result.Failure(MediaErrors.NotFound);

        if (mediaItem.Status == EMediaStatus.Dropped) 
            return Result.Failure(new Error("Media.AlreadyDropped", "The media is already dropped"));
        
        mediaItem.Status = EMediaStatus.Dropped;

        await context.SaveChangesAsync();

        return Result.Success();
    }
}