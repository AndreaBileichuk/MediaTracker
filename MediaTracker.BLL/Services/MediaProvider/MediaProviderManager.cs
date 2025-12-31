using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Enums;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace MediaTracker.BLL.Services.MediaProvider;

public class MediaProviderManager(
    MediaProviderServiceFactory mediaProviderServiceFactory, IDistributedCache distributedCache
    ) : IMediaProviderManager
{
    public async Task<Result<MediaSearchResponse>> SearchAsync(string query, EMediaType type, int page = 1)
    {
        if (page < 1) page = 1;

        var key = $"media-provider-{query}-{type}-{page}";

        var cachedMember = await distributedCache.GetStringAsync(key);

        if (!string.IsNullOrEmpty(cachedMember))
        {
            try
            {

                var cachedResult = JsonConvert.DeserializeObject<MediaSearchResponse>(cachedMember);

                if (cachedResult != null)
                {
                    return Result.Success(cachedResult);
                }
            }
            catch (Exception exception)
            {
                await distributedCache.RemoveAsync(key);
            }
        }

        var result = await (mediaProviderServiceFactory.GetProvider(type)).SearchAsync(query, page);

        if (result is { IsSuccess: true, Value.Results.Count: > 0 })
        {
            await distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(result.Value), new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10) 
            });
        }

        return result;
    }

    public async Task<Result<MediaProviderDetailsResponse>> GetByIdAsync(string externalId, EMediaType type)
    {
        var key = $"media-provider-{externalId}-{type}";

        var cachedMember = await distributedCache.GetStringAsync(key);

        if (!string.IsNullOrEmpty(cachedMember))
        {
            try
            {
                var cachedResult = JsonConvert.DeserializeObject<MediaProviderDetailsResponse>(cachedMember);

                if(cachedResult != null)
                {
                    return Result.Success(cachedResult);
                }
            }
            catch (Exception)
            {
                await distributedCache.RemoveAsync(key);
            }
        }

        var result = await (mediaProviderServiceFactory.GetProvider(type)).GetByIdAsync(externalId);

        if (result.IsSuccess)
        {
            await distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(result.Value),
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                });
        }

        return result;
    }

    public async Task<Result<MediaSearchResponse>> GetTopRatedAsync(EMediaType type, int page = 1)
    {
        if (page < 1) page = 1;

        var key = $"media-provider-top-rated-{page}-{type}";

        var cachedMember = await distributedCache.GetStringAsync(key);

        if (!string.IsNullOrEmpty(cachedMember))
        {
            try
            {
                var cachedResult = JsonConvert.DeserializeObject<MediaSearchResponse>(cachedMember);

                if (cachedResult != null)
                {
                    return Result.Success(cachedResult);
                }
            }
            catch (Exception exception)
            {
                Console.Write(exception);
                await distributedCache.RemoveAsync(key);
            }
        }

        var result = await (mediaProviderServiceFactory.GetProvider(type)).GetTopRatedAsync(page);

        if (result is { IsSuccess: true, Value.Results.Count: > 0 })
        {
            await distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(result.Value), new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10) 
            });
        }

        return result;
    }
}