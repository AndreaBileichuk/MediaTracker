using MediaTracker.DAL.Enums;
using Microsoft.Extensions.DependencyInjection;

namespace MediaTracker.BLL.Services.MediaProvider.Helpers;

public class MediaProviderServiceFactory(IServiceProvider provider)
{
    public TmdbBaseProviderService GetProvider(EMediaType type)
    {
        return type switch
        {
            EMediaType.Movie => provider.GetRequiredService<TmdbMovieProviderService>(),
            EMediaType.Series => provider.GetRequiredService<TmdbSeriesProviderService>(),
            _ => throw new ArgumentException("No such media type")
        };
    }
}