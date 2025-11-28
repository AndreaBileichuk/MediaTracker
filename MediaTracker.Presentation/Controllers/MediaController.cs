using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Services.Media;
using MediaTracker.DAL.Enums;
using Microsoft.AspNetCore.Mvc;

namespace MediaTracker.Presentation.Controllers;

[Route("[controller]")]
public class MediaController(IMediaService mediaService) : ControllerBase
{
    [HttpGet]
    public async Task<List<IMediaProviderDto>> Search(string query, EMediaType type)
    {
        return await mediaService.Search(query, type);
    }
}