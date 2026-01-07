using System.Net.Http.Json;
using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Settings;
using Microsoft.Extensions.Options;

namespace MediaTracker.BLL.Services.MediaProvider.Helpers;

public static class TmdbHelpers
{
    public static async Task<Result<MediaSearchResponse>> GetResultingList(HttpContent content, IOptions<TmdbOptions> options)
    {
        try
        {
            var tmdbResponse = await content.ReadFromJsonAsync<TmdbProviderSearchResponseList>();

            if (tmdbResponse is null)
            {
                return Result.Failure<MediaSearchResponse>(MediaErrors.ProviderInvalidResponse);
            }

            return Result.Success(new MediaSearchResponse
            {
                Results = tmdbResponse.Results.Select(r =>
                {
                    if (!string.IsNullOrWhiteSpace(r.PosterPath))
                    {
                        r.PosterPath = $"{options.Value.ImageBaseUrl}{r.PosterPath}";
                    }

                    return new MediaProviderResponse()
                    {
                        Id = r.Id,         
                        Title = r.Title ?? r.Name ?? "Unknown name",
                        Overview = r.Overview,
                        PosterPath = r.PosterPath,
                        ReleaseDate = r.ReleaseDate ?? r.FirstAirDate ?? "Unknown date",
                        IsAdult = r.IsAdult
                    };
                }).ToList(),
                TotalPages = tmdbResponse.TotalPages
            });
        }
        catch
        {
            return Result.Failure<MediaSearchResponse>(MediaErrors.ProviderInvalidResponse);
        }
    }
}