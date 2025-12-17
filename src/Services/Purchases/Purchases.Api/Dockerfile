# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution files
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]

# Copy project files and restore
COPY ["src/Shared/Acontplus.Analytics/Acontplus.Analytics.csproj", "src/Shared/Acontplus.Analytics/"]
COPY ["src/Services/Purchases/Purchases.Api/Purchases.Api.csproj", "src/Services/Purchases/Purchases.Api/"]
COPY ["src/Services/Purchases/Purchases.Application/Purchases.Application.csproj", "src/Services/Purchases/Purchases.Application/"]
COPY ["src/Services/Purchases/Purchases.Domain/Purchases.Domain.csproj", "src/Services/Purchases/Purchases.Domain/"]
COPY ["src/Services/Purchases/Purchases.Infrastructure/Purchases.Infrastructure.csproj", "src/Services/Purchases/Purchases.Infrastructure/"]
RUN dotnet restore "src/Services/Purchases/Purchases.Api/Purchases.Api.csproj"

# Copy source and build
COPY . .
WORKDIR "/src/src/Services/Purchases/Purchases.Api"
RUN dotnet publish "Purchases.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Run as non-root user
USER $APP_UID

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Purchases.Api.dll"]

