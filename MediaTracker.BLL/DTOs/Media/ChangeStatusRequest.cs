using MediaTracker.DAL.Enums;

namespace MediaTracker.BLL.DTOs.Media;

public record ChangeStatusRequest(EMediaStatus Status);
