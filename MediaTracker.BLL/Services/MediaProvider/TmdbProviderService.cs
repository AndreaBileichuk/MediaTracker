using System.Net.Http.Json;
using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Settings;
using MediaTracker.DAL.Entities;
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

    public async Task<Result<MediaItem>> GetByIdAsync(string externalId)
    {
        throw new NotImplementedException();
    }
}