# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution files
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]

# Copy project files and restore
COPY ["src/Shared/Acontplus.Analytics/Acontplus.Analytics.csproj", "src/Shared/Acontplus.Analytics/"]
COPY ["src/Services/Restaurant/Restaurant.Api/Restaurant.Api.csproj", "src/Services/Restaurant/Restaurant.Api/"]
COPY ["src/Services/Restaurant/Restaurant.Application/Restaurant.Application.csproj", "src/Services/Restaurant/Restaurant.Application/"]
COPY ["src/Services/Restaurant/Restaurant.Domain/Restaurant.Domain.csproj", "src/Services/Restaurant/Restaurant.Domain/"]
COPY ["src/Services/Restaurant/Restaurant.Infrastructure/Restaurant.Infrastructure.csproj", "src/Services/Restaurant/Restaurant.Infrastructure/"]
RUN dotnet restore "src/Services/Restaurant/Restaurant.Api/Restaurant.Api.csproj"

# Copy source and build
COPY . .
WORKDIR "/src/src/Services/Restaurant/Restaurant.Api"
RUN dotnet publish "Restaurant.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Run as non-root user
USER $APP_UID

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Restaurant.Api.dll"]

