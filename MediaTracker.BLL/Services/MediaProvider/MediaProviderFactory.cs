using MediaTracker.DAL.Enums;
using Microsoft.Extensions.DependencyInjection;

namespace MediaTracker.BLL.Services.MediaProvider;

public class MediaProviderFactory(IServiceProvider provider)
{
    public IMediaProvider GetProvider(EMediaType type)
    {
        return type switch
        {
            EMediaType.Movie => provider.GetRequiredService<TmdbService>(),
            _ => throw new ArgumentException("No such media type")
        };
    }
}