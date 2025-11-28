using System.Net.Http.Json;
using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Settings;
using MediaTracker.DAL.Entities;
using Microsoft.Extensions.Options;

namespace MediaTracker.BLL.Services.MediaProvider;

public class TmdbService(IHttpClientFactory httpClientFactory, IOptions<TmdbOptions> options) : IMediaProvider
{
    public async Task<List<IMediaProviderDto>> Search(string query)
    {
        var client = httpClientFactory.CreateClient("TmdbClient");
        var response = await client.GetAsync($"search/movie?query={Uri.EscapeDataString(query)}&api_key={options.Value.ApiKey}");
        
        if (!response.IsSuccessStatusCode)
        {
            return [];
        }

        var tmdbResponse = await response.Content.ReadFromJsonAsync<TmdbProviderSearchResponseList>();
        
        return tmdbResponse?.Results == null
            ? new List<IMediaProviderDto>()
            : tmdbResponse.Results
                .Select(r =>
                {
                    r.PosterPath = $"{options.Value.ImageBaseUrl}{r.PosterPath}";
                    return (IMediaProviderDto)r;
                })
                .ToList();
    }

    public async Task<MediaItem> GetByIdAsync(string externalId)
    {
        throw new NotImplementedException();
    }
}