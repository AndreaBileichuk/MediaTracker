using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Services.MediaProvider;
using MediaTracker.DAL.Entities;
using MediaTracker.DAL.Enums;

namespace MediaTracker.BLL.Services.Media;

public class MediaService(MediaProviderFactory mediaProviderFactory) : IMediaService
{
    public async Task<List<IMediaProviderDto>> Search(string query, EMediaType mediaType)
    {
        var mediaProvider = mediaProviderFactory.GetProvider(mediaType);
        
        return await mediaProvider.Search(query);
    }

    public async Task<MediaItem> GetByIdAsync(string externalId, EMediaType type)
    {
        throw new NotImplementedException();
    }
}