using System.Security.Claims;
using MediaTracker.BLL.DTOs.Media;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.Media;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediaTracker.Presentation.Controllers;

[Authorize]
[Route("[controller]")]
public class MediaController(IMediaService service) : ControllerBase
{
    [HttpGet()]
    public async Task<Result<MediaListResponse>> GetAsync([FromQuery] int page)
    {
        return await service.GetAsync(page, User.FindFirstValue(ClaimTypes.NameIdentifier));
    }

    [HttpPost]
    public async Task<Result<MediaItemResponse>> CreateAsync([FromBody] MediaItemRequest request)
    {
        return await service.CreateAsync(request, User.FindFirstValue(ClaimTypes.NameIdentifier));
    }
}