using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Entities;

namespace MediaTracker.BLL.Services.MediaProvider;

public interface IMediaProviderService
{
    Task<Result<List<IMediaProviderDto>>> Search(string query);

    Task<Result<IMediaProviderDetailsDto>> GetByIdAsync(string externalId);
    
    Task<Result<List<IMediaProviderDto>>> GetTopRated();
}