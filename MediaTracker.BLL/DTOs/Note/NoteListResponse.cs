namespace MediaTracker.BLL.DTOs.Note;

public class NoteListResponse
{
    public List<NoteResponse> Results { get; set; } = [];

    public int TotalPages { get; set; }
}