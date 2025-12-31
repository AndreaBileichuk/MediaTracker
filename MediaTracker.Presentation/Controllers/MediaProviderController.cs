using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.MediaProvider;
using MediaTracker.DAL.Enums;
using Microsoft.AspNetCore.Mvc;

namespace MediaTracker.Presentation.Controllers;

[Route("[controller]")]
public class MediaProviderController(IMediaProviderManager mediaManager) : ControllerBase
{
    [HttpGet]
    public async Task<Result<MediaSearchResponse>> Search(string query, EMediaType type, int page = 1)
    {
        return await mediaManager.SearchAsync(query, type, page);
    }
    
    [HttpGet("top-rated")]
    public async Task<Result<MediaSearchResponse>> GetTopRated([FromQuery] EMediaType type, [FromQuery] int page = 1)
    {
        return await mediaManager.GetTopRatedAsync(type, page);
    }

    [HttpGet("{id}")]
    public async Task<Result<MediaProviderDetailsResponse>> GetByIdAsync([FromRoute] string id, [FromQuery] EMediaType type)
    {
        return await mediaManager.GetByIdAsync(id, type);
    }
}