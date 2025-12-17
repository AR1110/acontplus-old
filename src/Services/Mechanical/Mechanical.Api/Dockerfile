# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution files
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]

# Copy project files and restore
COPY ["src/Shared/Acontplus.Analytics/Acontplus.Analytics.csproj", "src/Shared/Acontplus.Analytics/"]
COPY ["src/Services/Mechanical/Mechanical.Api/Mechanical.Api.csproj", "src/Services/Mechanical/Mechanical.Api/"]
COPY ["src/Services/Mechanical/Mechanical.Application/Mechanical.Application.csproj", "src/Services/Mechanical/Mechanical.Application/"]
COPY ["src/Services/Mechanical/Mechanical.Domain/Mechanical.Domain.csproj", "src/Services/Mechanical/Mechanical.Domain/"]
COPY ["src/Services/Mechanical/Mechanical.Infrastructure/Mechanical.Infrastructure.csproj", "src/Services/Mechanical/Mechanical.Infrastructure/"]
RUN dotnet restore "src/Services/Mechanical/Mechanical.Api/Mechanical.Api.csproj"

# Copy source and build
COPY . .
WORKDIR "/src/src/Services/Mechanical/Mechanical.Api"
RUN dotnet publish "Mechanical.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Run as non-root user
USER $APP_UID

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Mechanical.Api.dll"]

