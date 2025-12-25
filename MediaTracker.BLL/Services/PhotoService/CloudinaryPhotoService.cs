using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Error = MediaTracker.BLL.Infrastructure.Error;

namespace MediaTracker.BLL.Services.PhotoService;

public class CloudinaryPhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;
    
    public CloudinaryPhotoService(IOptions<CloudinaryOptions> options)
    {
        var acc = new CloudinaryDotNet.Account(
            options.Value.CloudName,
            options.Value.ApiKey,
            options.Value.ApiSecret
            );

        _cloudinary = new Cloudinary(acc);
    }
    
    public async Task<Result<ImageUploadResult>> AddPhotoAsync(IFormFile file)
    {
        if (file.Length <= 0) return Result.Failure<ImageUploadResult>(AccountErrors.InvalidImage);

        await using var stream = file.OpenReadStream();
            
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
                
            Transformation = new Transformation()
                .Height(500)
                .Width(500)
                .Crop("fill")
                .Gravity("face") 
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
        {
            return Result.Failure<ImageUploadResult>(
                new Error("Photo.UploadFailed", uploadResult.Error.Message)
            );
        }
        
        return Result.Success(uploadResult);
    }

    public async Task<Result<DeletionResult>> DeletePhotoAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deleteParams);
    
        if (result.Error != null) 
        {
            return Result.Failure<DeletionResult>(
                new Error("Photo.DeleteFailed", result.Error.Message)
            );
        }

        return Result.Success(result);
    }
}