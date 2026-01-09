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
    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    
    [HttpGet]
    public async Task<Result<NoteListResponse>> GetAsync([FromRoute] int mediaItemId, [FromQuery] int page)
    {
        return await service.GetAsync(UserId, mediaItemId, page);
    }

    [HttpPost]
    public async Task<Result<NoteResponse>> CreateAsync([FromRoute] int mediaItemId, [FromBody] CreateNoteRequest request)
    {
        return await service.CreateAsync(UserId, mediaItemId, request);
    }

    [HttpPut("{noteId}")]
    public async Task<Result<NoteResponse>> UpdateAsync([FromBody] CreateNoteRequest request, [FromRoute] int mediaItemId, [FromRoute] int noteId)
    {
        return await service.UpdateAsync(UserId, mediaItemId, noteId, request);
    }

    [HttpDelete("{noteId}")]
    public async Task<Result> DeleteAsync([FromRoute] int mediaItemId, [FromRoute] int noteId)
    {
        return await service.DeleteAsync(UserId, mediaItemId, noteId);
    }
    
}