using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Entities;
using MediaTracker.DAL.Enums;

namespace MediaTracker.BLL.Services.MediaProvider;

public class MediaProviderManager(MediaProviderServiceFactory mediaProviderServiceFactory) : IMediaProviderManager
{
    public async Task<Result<List<IMediaProviderDto>>> Search(string query, EMediaType type)
    {        
        var mediaProvider = mediaProviderServiceFactory.GetProvider(type);
        
        return await mediaProvider.Search(query);
    }

    public async Task<Result<MediaItem>> GetByIdAsync(string externalId, EMediaType type)
    {
        throw new NotImplementedException();
    }
}