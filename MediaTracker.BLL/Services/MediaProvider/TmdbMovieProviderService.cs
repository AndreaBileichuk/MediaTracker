using System.Net.Http.Json;
using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Settings;
using Microsoft.Extensions.Options;

namespace MediaTracker.BLL.Services.MediaProvider;

public class TmdbMovieProviderService(IHttpClientFactory httpClientFactory, IOptions<TmdbOptions> options)
    : TmdbBaseProviderService(httpClientFactory, options)
{
    private readonly IOptions<TmdbOptions> _options = options;
    private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;

    protected override string RoutePrefix => "movie";
    
    public override async Task<Result<MediaProviderDetailsResponse>> GetByIdAsync(string externalId)
    {
        var client = _httpClientFactory.CreateClient("TmdbClient");

        var response = await client.GetAsync($"movie/{externalId}?api_key={_options.Value.ApiKey}");

        if (!response.IsSuccessStatusCode)
        {
            return Result.Failure<MediaProviderDetailsResponse>(MediaErrors.NotFound);
        }

        var tmdbMovie = await response.Content.ReadFromJsonAsync<TmdbProviderMovieDetailsResponse>();

        if (tmdbMovie is null)
        {
            return Result.Failure<MediaProviderDetailsResponse>(MediaErrors.NotFound);
        }

        if (!string.IsNullOrEmpty(tmdbMovie.PosterPath))
        {
            tmdbMovie.PosterPath = $"{_options.Value.ImageBaseUrl}{tmdbMovie.PosterPath}";
        }

        if (!string.IsNullOrEmpty(tmdbMovie.BackdropPath))
        {
            tmdbMovie.BackdropPath = $"{_options.Value.ImageBaseUrl}{tmdbMovie.BackdropPath}";
        }

        return Result.Success(new MediaProviderDetailsResponse()
        {
            Id = tmdbMovie.Id,
            Title = tmdbMovie.Title,
            Overview = tmdbMovie.Overview,
            PosterPath = tmdbMovie.PosterPath,
            BackdropPath = tmdbMovie.BackdropPath,
            Runtime = tmdbMovie.Runtime,
            ReleaseDate = tmdbMovie.ReleaseDate,
            IsAdult = tmdbMovie.IsAdult,
            Status = tmdbMovie.Status,
            Tagline = tmdbMovie.Tagline,
            VoteAverage = tmdbMovie.VoteAverage,
            VoteCount = tmdbMovie.VoteCount,
            Genres = tmdbMovie.Genres
        });
    }
}