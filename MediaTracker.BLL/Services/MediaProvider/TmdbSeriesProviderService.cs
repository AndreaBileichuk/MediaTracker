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
        throw new NotImplementedException();
    }

    public async Task<Result<MediaSearchResponse>> GetTopRatedAsync(int page = 1)
    {
        throw new NotImplementedException();
    }
}