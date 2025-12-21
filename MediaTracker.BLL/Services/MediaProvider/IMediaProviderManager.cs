using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Enums;

namespace MediaTracker.BLL.Services.MediaProvider;

public interface IMediaProviderManager
{
    Task<Result<List<IMediaProviderDto>>> Search(string query, EMediaType type);

    Task<Result<IMediaProviderDetailsDto>> GetByIdAsync(string externalId, EMediaType type);
    
    Task<Result<List<IMediaProviderDto>>> GetTopRated(EMediaType type);
}