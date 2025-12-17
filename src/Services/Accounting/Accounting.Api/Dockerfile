# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution files
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]

# Copy project files and restore
COPY ["src/Shared/Acontplus.Analytics/Acontplus.Analytics.csproj", "src/Shared/Acontplus.Analytics/"]
COPY ["src/Services/Accounting/Accounting.Api/Accounting.Api.csproj", "src/Services/Accounting/Accounting.Api/"]
COPY ["src/Services/Accounting/Accounting.Application/Accounting.Application.csproj", "src/Services/Accounting/Accounting.Application/"]
COPY ["src/Services/Accounting/Accounting.Domain/Accounting.Domain.csproj", "src/Services/Accounting/Accounting.Domain/"]
COPY ["src/Services/Accounting/Accounting.Infrastructure/Accounting.Infrastructure.csproj", "src/Services/Accounting/Accounting.Infrastructure/"]
RUN dotnet restore "src/Services/Accounting/Accounting.Api/Accounting.Api.csproj"

# Copy source and build
COPY . .
WORKDIR "/src/src/Services/Accounting/Accounting.Api"
RUN dotnet publish "Accounting.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Run as non-root user
USER $APP_UID

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Accounting.Api.dll"]

