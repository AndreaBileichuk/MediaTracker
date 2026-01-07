using System.Net.Http.Json;
using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.MediaProvider.Helpers;
using MediaTracker.BLL.Settings;
using Microsoft.Extensions.Options;

namespace MediaTracker.BLL.Services.MediaProvider;

public class TmdbSeriesProviderService(IHttpClientFactory clientFactory, IOptions<TmdbOptions> options) : IMediaProviderService
{
    public async Task<Result<MediaSearchResponse>> SearchAsync(string query, int page)
    {
        var client = clientFactory.CreateClient("TmdbClient");
        var response = await client.GetAsync($"search/tv?query={Uri.EscapeDataString(query)}&page={page}&api_key={options.Value.ApiKey}");

        if (!response.IsSuccessStatusCode)
        {
            return Result.Failure<MediaSearchResponse>(MediaErrors.ProviderRequestFailed);
        }
        
        return await TmdbHelpers.GetResultingList(response.Content, options);
    }

    public async Task<Result<MediaProviderDetailsResponse>> GetByIdAsync(string externalId)
    {
        var client = clientFactory.CreateClient("TmdbClient");

        var response = await client.GetAsync($"tv/{externalId}?api_key={options.Value.ApiKey}");

        if (!response.IsSuccessStatusCode)
        {
            return Result.Failure<MediaProviderDetailsResponse>(MediaErrors.NotFound);
        }

        var tmdbMovie = await response.Content.ReadFromJsonAsync<TmdbProviderSeriesDetailsResponse>();

        if (tmdbMovie is null)
        {
            return Result.Failure<MediaProviderDetailsResponse>(MediaErrors.NotFound);
        }

        if (!string.IsNullOrEmpty(tmdbMovie.PosterPath))
        {
            tmdbMovie.PosterPath = $"{options.Value.ImageBaseUrl}{tmdbMovie.PosterPath}";
        }

        if (!string.IsNullOrEmpty(tmdbMovie.BackdropPath))
        {
            tmdbMovie.BackdropPath = $"{options.Value.ImageBaseUrl}{tmdbMovie.BackdropPath}";
        }

        return Result.Success(new MediaProviderDetailsResponse()
        {
            Id = tmdbMovie.Id,
            Title = tmdbMovie.Title,
            Overview = tmdbMovie.Overview,
            PosterPath = tmdbMovie.PosterPath,
            BackdropPath = tmdbMovie.BackdropPath,
            ReleaseDate = tmdbMovie.ReleaseDate,
            IsAdult = tmdbMovie.IsAdult,
            Status = tmdbMovie.Status,
            Tagline = tmdbMovie.Tagline,
            VoteAverage = tmdbMovie.VoteAverage,
            VoteCount = tmdbMovie.VoteCount,
            Genres = tmdbMovie.Genres
        });
    }

    public async Task<Result<MediaSearchResponse>> GetTopRatedAsync(int page = 1)
    {
        throw new NotImplementedException();
    }
}