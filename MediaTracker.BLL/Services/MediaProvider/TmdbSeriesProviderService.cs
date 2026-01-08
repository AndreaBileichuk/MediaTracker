using System.Net.Http.Json;
using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.MediaProvider.Helpers;
using MediaTracker.BLL.Settings;
using Microsoft.Extensions.Options;

namespace MediaTracker.BLL.Services.MediaProvider;

public class TmdbSeriesProviderService(IHttpClientFactory clientFactory, IOptions<TmdbOptions> options) 
    : TmdbBaseProviderService(clientFactory, options)
{
    private readonly IHttpClientFactory _clientFactory = clientFactory;
    private readonly IOptions<TmdbOptions> _options = options;
    protected override string RoutePrefix => "tv";
    
    public override async Task<Result<MediaProviderDetailsResponse>> GetByIdAsync(string externalId)
    {
        var client = _clientFactory.CreateClient("TmdbClient");

        var response = await client.GetAsync($"tv/{externalId}?api_key={_options.Value.ApiKey}");

        if (!response.IsSuccessStatusCode)
        {
            return Result.Failure<MediaProviderDetailsResponse>(MediaErrors.NotFound);
        }

        var tmdbSeries = await response.Content.ReadFromJsonAsync<TmdbProviderSeriesDetailsResponse>();

        if (tmdbSeries is null)
        {
            return Result.Failure<MediaProviderDetailsResponse>(MediaErrors.NotFound);
        }

        if (!string.IsNullOrEmpty(tmdbSeries.PosterPath))
        {
            tmdbSeries.PosterPath = $"{_options.Value.ImageBaseUrl}{tmdbSeries.PosterPath}";
        }

        if (!string.IsNullOrEmpty(tmdbSeries.BackdropPath))
        {
            tmdbSeries.BackdropPath = $"{_options.Value.ImageBaseUrl}{tmdbSeries.BackdropPath}";
        }

        return Result.Success(new MediaProviderDetailsResponse()
        {
            Id = tmdbSeries.Id,
            Title = tmdbSeries.Title,
            Overview = tmdbSeries.Overview,
            PosterPath = tmdbSeries.PosterPath,
            BackdropPath = tmdbSeries.BackdropPath,
            ReleaseDate = tmdbSeries.ReleaseDate,
            IsAdult = tmdbSeries.IsAdult,
            Status = tmdbSeries.Status,
            Tagline = tmdbSeries.Tagline,
            VoteAverage = tmdbSeries.VoteAverage,
            VoteCount = tmdbSeries.VoteCount,
            Genres = tmdbSeries.Genres,
            Seasons = tmdbSeries.Seasons?.Select(s => new SeasonsResponse()
            {
                Id = s.Id,
                Name = s.Name,
                SeasonNumber = s.SeasonNumber,
                EpisodeCount = s.EpisodeCount,
                PosterPath = GetFullImagePath(s.PosterPath),
                AirDate = s.AirDate,
                Overview = s.Overview
            }).ToList()
        });
    }
}