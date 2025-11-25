using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Entities;
using Microsoft.AspNetCore.Mvc.Formatters;

namespace MediaTracker.BLL.Services.MediaProvider;

public interface IMediaProvider
{
    Task<Result<List<MediaProviderSearchResult>>> Search(string query, MediaType mediaType);

    Task<Result<MediaItem>> GetByIdAsync(string externalId, MediaType type);
}