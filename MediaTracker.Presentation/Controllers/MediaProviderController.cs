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
    public async Task<Result<List<IMediaProviderDto>>> Search(string query, EMediaType type)
    {
        return await mediaManager.Search(query, type);
    }
    
    [HttpGet("top-rated")]
    public async Task<Result<List<IMediaProviderDto>>> GetTopRated(EMediaType type)
    {
        return await mediaManager.GetTopRated(type);
    }

    [HttpGet("{id}")]
    public async Task<Result<IMediaProviderDetailsDto>> GetByIdAsync([FromRoute] string id, [FromQuery] EMediaType type)
    {
        return await mediaManager.GetByIdAsync(id, type);
    }
}