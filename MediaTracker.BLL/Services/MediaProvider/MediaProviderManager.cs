using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Entities;
using MediaTracker.DAL.Enums;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace MediaTracker.BLL.Services.MediaProvider;

public class MediaProviderManager(
    MediaProviderServiceFactory mediaProviderServiceFactory, IDistributedCache distributedCache
    ) : IMediaProviderManager
{
    public async Task<Result<List<IMediaProviderDto>>> Search(string query, EMediaType type)
    {        
        var key = $"media-provider-{query}-{type}";

        var cachedMember = await distributedCache.GetStringAsync(key);

        if (!string.IsNullOrEmpty(cachedMember))
        {
            try
            {
                var cachedResult = JsonConvert.DeserializeObject<Result<List<IMediaProviderDto>>>(cachedMember);

                if (cachedResult != null)
                {
                    return cachedResult;
                }
            }
            catch (Exception)
            {
                await distributedCache.RemoveAsync(key);
            }
        }

        var result = await (mediaProviderServiceFactory.GetProvider(type)).Search(query);

        if (result is { IsSuccess: true, Value.Count: > 0 })
        {
            await distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(result), new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10) 
            });
        }

        return result;
    }

    public async Task<Result<IMediaProviderDetailsDto>> GetByIdAsync(string externalId, EMediaType type)
    {
        var key = $"media-provider-{externalId}-{type}";

        var cachedMember = await distributedCache.GetStringAsync(key);

        if (!string.IsNullOrEmpty(cachedMember))
        {
            try
            {
                var cachedResult = JsonConvert.DeserializeObject<Result<IMediaProviderDetailsDto>>(cachedMember);

                if(cachedResult != null)
                {
                    return cachedResult;
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
            await distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(result),
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                });
        }

        return result;
    }

    public async Task<Result<List<IMediaProviderDto>>> GetTopRated(EMediaType type)
    {
        throw new NotImplementedException();
    }
}