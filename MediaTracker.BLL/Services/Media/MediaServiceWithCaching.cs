using MediaTracker.BLL.DTOs.Media;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Enums;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace MediaTracker.BLL.Services.Media;

public class MediaServiceWithCaching(MediaService mediaService, IDistributedCache distributedCache) : IMediaService
{
    public async Task<Result<MediaListResponse>> GetAsync(int page, string? userId, EMediaStatus? status)
    {
        if (string.IsNullOrEmpty(userId)) return Result.Failure<MediaListResponse>(AuthErrors.UserNotFound);

        var version = await GetUserCacheVersion(userId);
        var key = $"my-media-{page}-{userId}-{status}-{version}";

        var cachedMedia = await distributedCache.GetStringAsync(key);

        if (!string.IsNullOrEmpty(cachedMedia))
        {
            try
            {
                var cachedResult = JsonConvert.DeserializeObject<MediaListResponse>(cachedMedia);
                if (cachedResult != null) return Result.Success(cachedResult);
            }
            catch (Exception)
            {
                await distributedCache.RemoveAsync(key);
            }
        }

        var result = await mediaService.GetAsync(page, userId, status);

        if (result is { IsSuccess: true, Value.Results.Count: > 0 })
        {
            await distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(result.Value),
                new DistributedCacheEntryOptions()
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                });
        }

        return result;
    }

    public async Task<Result<MediaItemResponse>> CreateAsync(MediaItemRequest request, string? userId)
    {
        var result = await mediaService.CreateAsync(request, userId);

        if (result is { IsSuccess: true } && !string.IsNullOrEmpty(userId))
        {
            await InvalidateUserCache(userId);
        }
        
        return result;
    }

    public async Task<Result<MediaItemDetailsResponse>> GetDetailsAsync(string? userId, int mediaItemId)
    {
        if (string.IsNullOrWhiteSpace(userId)) return Result.Failure<MediaItemDetailsResponse>(AuthErrors.UserNotFound);

        var key = $"media-item-details-{userId}-{mediaItemId}";

        var cachedMedia = await distributedCache.GetStringAsync(key);

        if (!string.IsNullOrWhiteSpace(cachedMedia))
        {
            try
            {
                var cachedResult = JsonConvert.DeserializeObject<MediaItemDetailsResponse>(cachedMedia);
                if (cachedResult != null) return Result.Success(cachedResult);
            }
            catch (Exception)
            {
                await distributedCache.RemoveAsync(key);
            }
        }

        var result = await mediaService.GetDetailsAsync(userId, mediaItemId);

        if (result is { IsSuccess: true, Value: not null })
        {
            await distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(result.Value),
                new DistributedCacheEntryOptions()
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24)
                });
        }

        return result;
    }

    public async Task<Result> DropAsync(string? userId, int mediaItemId)
    {
        var result = await mediaService.DropAsync(userId, mediaItemId);

        if (result.IsSuccess && !string.IsNullOrEmpty(userId))
        {
            await InvalidateUserCache(userId);
            await distributedCache.RemoveAsync($"media-item-details-{userId}-{mediaItemId}");
        }

        return result;
    }
    
    public async Task<Result> ChangeStatusAsync(string? userId, int mediaItemId, ChangeStatusRequest request)
    {
        var result = await mediaService.ChangeStatusAsync(userId, mediaItemId, request);

        if (result.IsSuccess && !string.IsNullOrEmpty(userId))
        {
            await InvalidateUserCache(userId);
            await distributedCache.RemoveAsync($"media-item-details-{userId}-{mediaItemId}");
        }

        return result;
    }

    private async Task InvalidateUserCache(string userId)
    {
        var versionKey = $"user-media-ver-{userId}";
        await distributedCache.SetStringAsync(versionKey, Guid.NewGuid().ToString());
    }

    private async Task<string> GetUserCacheVersion(string userId)
    {
        var versionKey = $"user-media-ver-{userId}";
        var version = await distributedCache.GetStringAsync(versionKey);

        if (string.IsNullOrEmpty(version))
        {
            version = Guid.NewGuid().ToString();
            await distributedCache.SetStringAsync(versionKey, version);
        }

        return version;
    }
}