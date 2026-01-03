using MediaTracker.BLL.DTOs.Media;
using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.DAL.Entities;
using MediaTracker.DAL.Enums;

namespace MediaTracker.BLL.Services.Media;

public interface IMediaService
{
    Task<Result<MediaListResponse>> GetAsync(int page, string? userId);

    Task<Result<MediaItemResponse>> CreateAsync(MediaItemRequest request, string? userId);

    Task<Result<MediaItemDetailsResponse>> GetDetailsAsync(string? userId, int mediaItemId);
}