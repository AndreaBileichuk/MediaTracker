using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Enums;

namespace MediaTracker.BLL.Services.MediaProvider;

public interface IMediaProviderManager
{
    Task<Result<MediaSearchResponse>> SearchAsync(string query, EMediaType type, int page = 1);

    Task<Result<MediaProviderDetailsResponse>> GetByIdAsync(string externalId, EMediaType type);
    
    Task<Result<MediaSearchResponse>> GetTopRatedAsync(EMediaType type, int page = 1);
}