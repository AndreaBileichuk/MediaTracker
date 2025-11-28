using MediaTracker.DAL.Enums;
using Microsoft.Extensions.DependencyInjection;

namespace MediaTracker.BLL.Services.MediaProvider;

public class MediaProviderServiceFactory(IServiceProvider provider)
{
    public IMediaProviderService GetProvider(EMediaType type)
    {
        return type switch
        {
            EMediaType.Movie => provider.GetRequiredService<TmdbProviderService>(),
            _ => throw new ArgumentException("No such media type")
        };
    }
}