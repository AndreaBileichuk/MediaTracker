using System.Net.Http.Json;
using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Settings;
using Microsoft.Extensions.Options;

namespace MediaTracker.BLL.Services.MediaProvider;

public class TmdbProviderService(IHttpClientFactory httpClientFactory, IOptions<TmdbOptions> options) : IMediaProviderService
{
    public async Task<Result<List<IMediaProviderDto>>> Search(string query)
    {
        var client = httpClientFactory.CreateClient("TmdbClient");
        var response = await client.GetAsync($"search/movie?query={Uri.EscapeDataString(query)}&api_key={options.Value.ApiKey}");
        
        if (!response.IsSuccessStatusCode)
        {
            return Result.Failure<List<IMediaProviderDto>>(MediaErrors.ProviderRequestFailed);
        }

        var tmdbResponse = await response.Content.ReadFromJsonAsync<TmdbProviderSearchResponseList>();
        
        var resultList = tmdbResponse?.Results
            .Select(r =>
            {
                if (!string.IsNullOrEmpty(r.PosterPath))
                {
                    r.PosterPath = $"{options.Value.ImageBaseUrl}{r.PosterPath}";
                }
                return (IMediaProviderDto)r;
            })
            .ToList() ?? [];

        return Result.Success(resultList);
    }

    public async Task<Result<IMediaProviderDetailsDto>> GetByIdAsync(string externalId)
    {
        var client = httpClientFactory.CreateClient("TmdbClient");

        var response = await client.GetAsync($"movie/{externalId}?api_key={options.Value.ApiKey}");

        if (!response.IsSuccessStatusCode)
        {
            return Result.Failure<IMediaProviderDetailsDto>(MediaErrors.NotFound);
        }

        var tmdbMovie = await response.Content.ReadFromJsonAsync<TmdbProviderSearchDetailedResponse>();
        
        if (tmdbMovie is null)
        {
            return Result.Failure<IMediaProviderDetailsDto>(MediaErrors.NotFound);
        }

        if (!string.IsNullOrEmpty(tmdbMovie.PosterPath))
        {
            tmdbMovie.PosterPath = $"{options.Value.ImageBaseUrl}{tmdbMovie.PosterPath}";
        }

        if (!string.IsNullOrEmpty(tmdbMovie.BackdropPath))
        {
            tmdbMovie.BackdropPath = $"{options.Value.ImageBaseUrl}{tmdbMovie.BackdropPath}";
        }
        
        return Result.Success((IMediaProviderDetailsDto)tmdbMovie);
    }

    public async Task<Result<List<IMediaProviderDto>>> GetTopRated()
    {
        throw new NotImplementedException();
    }
}