using System.Security.Claims;
using MediaTracker.BLL.DTOs.Media;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.Media;
using MediaTracker.DAL.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediaTracker.Presentation.Controllers;

[Authorize]
[Route("[controller]")]
public class MediaController(IMediaService service) : ControllerBase
{
    [HttpGet()]
    public async Task<Result<MediaListResponse>> GetAsync([FromQuery] int page, [FromQuery] EMediaStatus? status)
    {
        return await service.GetAsync(page, User.FindFirstValue(ClaimTypes.NameIdentifier), status);
    }

    [HttpPost]
    public async Task<Result<MediaItemResponse>> CreateAsync([FromBody] MediaItemRequest request)
    {
        return await service.CreateAsync(request, User.FindFirstValue(ClaimTypes.NameIdentifier));
    }

    [HttpGet("{id}")]
    public async Task<Result<MediaItemDetailsResponse>> GetDetailsAsync([FromRoute] int id)
    {
        return await service.GetDetailsAsync(User.FindFirstValue(ClaimTypes.NameIdentifier), id);
    }

    [HttpPatch("drop/{id}")]
    public async Task<Result> DropAsync([FromRoute] int id)
    {
        return await service.DropAsync(User.FindFirstValue(ClaimTypes.NameIdentifier), id);
    }

    [HttpPatch("{id}/status")]
    public async Task<Result> ChangeStatusAsync([FromRoute] int id, [FromBody] ChangeStatusRequest request)
    {
        return await service.ChangeStatusAsync(User.FindFirstValue(ClaimTypes.NameIdentifier), id, request);
    }
}