using System.Net.Http.Json;
using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Settings;
using Microsoft.Extensions.Options;

namespace MediaTracker.BLL.Services.MediaProvider;

public class TmdbProviderService(IHttpClientFactory httpClientFactory, IOptions<TmdbOptions> options)
    : IMediaProviderService
{
    public async Task<Result<MediaSearchResponse>> SearchAsync(string query, int page)
    {
        var client = httpClientFactory.CreateClient("TmdbClient");
        var response =
            await client.GetAsync(
                $"search/movie?query={Uri.EscapeDataString(query)}&page={page}&api_key={options.Value.ApiKey}");

        if (!response.IsSuccessStatusCode)
        {
            return Result.Failure<MediaSearchResponse>(MediaErrors.ProviderRequestFailed);
        }

        Console.WriteLine(response.Content);

        return await GetResultingList(response.Content);
    }

    public async Task<Result<MediaProviderDetailsResponse>> GetByIdAsync(string externalId)
    {
        var client = httpClientFactory.CreateClient("TmdbClient");

        var response = await client.GetAsync($"movie/{externalId}?api_key={options.Value.ApiKey}");

        if (!response.IsSuccessStatusCode)
        {
            return Result.Failure<MediaProviderDetailsResponse>(MediaErrors.NotFound);
        }

        var tmdbMovie = await response.Content.ReadFromJsonAsync<TmdbProviderSearchDetailedResponse>();

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

    public async Task<Result<MediaSearchResponse>> GetTopRatedAsync(int page)
    {
        var client = httpClientFactory.CreateClient("TmdbClient");

        var response = await client.GetAsync($"movie/top_rated?page={page}&api_key={options.Value.ApiKey}");

        if (!response.IsSuccessStatusCode)
        {
            return Result.Failure<MediaSearchResponse>(MediaErrors.ProviderRequestFailed);
        }

        return await GetResultingList(response.Content);
    }

    private async Task<Result<MediaSearchResponse>> GetResultingList(HttpContent content)
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
                        Title = r.Title,
                        Overview = r.Overview,
                        PosterPath = r.PosterPath,
                        ReleaseDate = r.ReleaseDate,
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