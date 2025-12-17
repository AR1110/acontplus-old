# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution files
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]

# Copy project files and restore
COPY ["src/Shared/Acontplus.Analytics/Acontplus.Analytics.csproj", "src/Shared/Acontplus.Analytics/"]
COPY ["src/Services/Inventory/Inventory.Api/Inventory.Api.csproj", "src/Services/Inventory/Inventory.Api/"]
COPY ["src/Services/Inventory/Inventory.Application/Inventory.Application.csproj", "src/Services/Inventory/Inventory.Application/"]
COPY ["src/Services/Inventory/Inventory.Domain/Inventory.Domain.csproj", "src/Services/Inventory/Inventory.Domain/"]
COPY ["src/Services/Inventory/Inventory.Infrastructure/Inventory.Infrastructure.csproj", "src/Services/Inventory/Inventory.Infrastructure/"]
RUN dotnet restore "src/Services/Inventory/Inventory.Api/Inventory.Api.csproj"

# Copy source and build
COPY . .
WORKDIR "/src/src/Services/Inventory/Inventory.Api"
RUN dotnet publish "Inventory.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Run as non-root user
USER $APP_UID

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Inventory.Api.dll"]

