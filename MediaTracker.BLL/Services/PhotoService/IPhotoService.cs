using CloudinaryDotNet.Actions;
using MediaTracker.BLL.Infrastructure;
using Microsoft.AspNetCore.Http;

namespace MediaTracker.BLL.Services.PhotoService;

public interface IPhotoService
{
    Task<Result<ImageUploadResult>> AddPhotoAsync(IFormFile file);
    
    Task<Result<DeletionResult>> DeletePhotoAsync(string publicId);
}