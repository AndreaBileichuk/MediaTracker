using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.DAL.Entities;

namespace MediaTracker.BLL.Services.MediaProvider;

public interface IMediaProvider
{
    Task<List<IMediaProviderDto>> Search(string query);

    Task<MediaItem> GetByIdAsync(string externalId);
}