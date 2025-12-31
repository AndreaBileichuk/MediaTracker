using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Entities;

namespace MediaTracker.BLL.Services.MediaProvider;

public interface IMediaProviderService
{
    Task<Result<MediaSearchResponse>> SearchAsync(string query, int page);

    Task<Result<MediaProviderDetailsResponse>> GetByIdAsync(string externalId);
    
    Task<Result<MediaSearchResponse>> GetTopRatedAsync(int page = 1);
}