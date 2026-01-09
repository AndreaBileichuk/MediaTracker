using System.Security.Claims;
using MediaTracker.BLL.DTOs.Note;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.Note;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediaTracker.Presentation.Controllers;

[Authorize]
[Route("media/{mediaItemId}/notes")]
public class NoteController(INoteService service) : ControllerBase
{
    [HttpGet]
    public async Task<Result<NoteListResponse>> GetAsync([FromRoute] int mediaItemId, [FromQuery] int page)
    {
        return await service.GetAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!, mediaItemId, page);
    }

    [HttpPost]
    public async Task<Result<NoteResponse>> CreateAsync([FromRoute] int mediaItemId, [FromBody] CreateNoteRequest request)
    {
        return await service.CreateAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!, mediaItemId, request);
    }
}