using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.DAL.Entities;
using MediaTracker.DAL.Enums;

namespace MediaTracker.BLL.Services.Media;

public interface IMediaService
{
    Task<List<IMediaProviderDto>> Search(string query, EMediaType mediaType);

    Task<MediaItem> GetByIdAsync(string externalId, EMediaType type);
}