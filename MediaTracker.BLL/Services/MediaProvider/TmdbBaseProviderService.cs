using MediaTracker.BLL.DTOs.MediaProvider;
using MediaTracker.BLL.Errors;
using MediaTracker.BLL.Infrastructure;
using MediaTracker.BLL.Services.MediaProvider.Helpers;
using MediaTracker.BLL.Settings;
using Microsoft.Extensions.Options;

namespace MediaTracker.BLL.Services.MediaProvider;

public abstract class TmdbBaseProviderService(IHttpClientFactory httpClientFactory, IOptions<TmdbOptions> options)
{
    protected abstract string RoutePrefix { get; }
    
    public async Task<Result<MediaSearchResponse>> SearchAsync(string query, int page)
    {
        var client = httpClientFactory.CreateClient("TmdbClient");

        var response = await client.GetAsync(
            $"search/{RoutePrefix}?query={Uri.EscapeDataString(query)}&page={page}&api_key={options.Value.ApiKey}");

        if (!response.IsSuccessStatusCode)
        {
            return Result.Failure<MediaSearchResponse>(MediaErrors.ProviderRequestFailed);
        }

        return await TmdbHelpers.GetResultingList(response.Content, options);
    }

    public virtual async Task<Result<MediaSearchResponse>> GetTopRatedAsync(int page = 1)
    {
        var client = httpClientFactory.CreateClient("TmdbClient");

        var response = await client.GetAsync($"{RoutePrefix}/top_rated?page={page}&api_key={options.Value.ApiKey}");

        if (!response.IsSuccessStatusCode)
        {
            return Result.Failure<MediaSearchResponse>(MediaErrors.ProviderRequestFailed);
        }

        return await TmdbHelpers.GetResultingList(response.Content, options);
    }
    
    public abstract Task<Result<MediaProviderDetailsResponse>> GetByIdAsync(string externalId);
    
    protected string? GetFullImagePath(string? path)
    {
        return string.IsNullOrEmpty(path) ? null : $"{options.Value.ImageBaseUrl}{path}";
    }
}