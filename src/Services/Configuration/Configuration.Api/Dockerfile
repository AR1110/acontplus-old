# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution files
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]

# Copy project files and restore
COPY ["src/Shared/Acontplus.Analytics/Acontplus.Analytics.csproj", "src/Shared/Acontplus.Analytics/"]
COPY ["src/Services/Configuration/Configuration.Api/Configuration.Api.csproj", "src/Services/Configuration/Configuration.Api/"]
COPY ["src/Services/Configuration/Configuration.Application/Configuration.Application.csproj", "src/Services/Configuration/Configuration.Application/"]
COPY ["src/Services/Configuration/Configuration.Infrastructure/Configuration.Infrastructure.csproj", "src/Services/Configuration/Configuration.Infrastructure/"]
COPY ["src/Services/Configuration/Configuration.Domain/Configuration.Domain.csproj", "src/Services/Configuration/Configuration.Domain/"]
RUN dotnet restore "src/Services/Configuration/Configuration.Api/Configuration.Api.csproj"

# Copy source and build
COPY . .
WORKDIR "/src/src/Services/Configuration/Configuration.Api"
RUN dotnet publish "Configuration.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Run as non-root user
USER $APP_UID

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Configuration.Api.dll"]

