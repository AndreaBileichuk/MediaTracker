using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.Media;
using MediaTracker.BLL.Services.MediaProvider;
using MediaTracker.DAL.Enums;
using Microsoft.AspNetCore.Mvc;

namespace MediaTracker.Presentation.Controllers;

[Route("[controller]")]
public class MediaProviderController(IMediaProviderManager mediaService) : ControllerBase
{
    [HttpGet]
    public async Task<Result<List<IMediaProviderDto>>> Search(string query, EMediaType type)
    {
        return await mediaService.Search(query, type);
    }
}