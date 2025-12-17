# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution files
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]

# Copy project files and restore
COPY ["src/Shared/Acontplus.Analytics/Acontplus.Analytics.csproj", "src/Shared/Acontplus.Analytics/"]
COPY ["src/Services/Common/Common.Api/Common.Api.csproj", "src/Services/Common/Common.Api/"]
COPY ["src/Services/Common/Common.Application/Common.Application.csproj", "src/Services/Common/Common.Application/"]
COPY ["src/Services/Common/Common.Domain/Common.Domain.csproj", "src/Services/Common/Common.Domain/"]
COPY ["src/Services/Common/Common.Infrastructure/Common.Infrastructure.csproj", "src/Services/Common/Common.Infrastructure/"]
RUN dotnet restore "src/Services/Common/Common.Api/Common.Api.csproj"

# Copy source and build
COPY . .
WORKDIR "/src/src/Services/Common/Common.Api"
RUN dotnet publish "Common.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Run as non-root user
USER $APP_UID

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Common.Api.dll"]

