using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Entities;
using MediaTracker.DAL.Enums;

namespace MediaTracker.BLL.Services.MediaProvider;

public interface IMediaProviderManager
{
    Task<Result<List<IMediaProviderDto>>> Search(string query, EMediaType type);

    Task<Result<MediaItem>> GetByIdAsync(string externalId, EMediaType type);
}