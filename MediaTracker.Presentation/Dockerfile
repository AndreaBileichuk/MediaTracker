FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["MediaTracker.Presentation/MediaTracker.Presentation.csproj", "MediaTracker.Presentation/"]
COPY ["MediaTracker.BLL/MediaTracker.BLL.csproj", "MediaTracker.BLL/"]
COPY ["MediaTracker.DAL/MediaTracker.DAL.csproj", "MediaTracker.DAL/"]

RUN dotnet restore "MediaTracker.Presentation/MediaTracker.Presentation.csproj"

COPY . .
WORKDIR "/src/MediaTracker.Presentation"
RUN dotnet build "MediaTracker.Presentation.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "MediaTracker.Presentation.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MediaTracker.Presentation.dll"]
