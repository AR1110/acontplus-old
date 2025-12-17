# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution files
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]

# Copy project files and restore
COPY ["src/Shared/Acontplus.Analytics/Acontplus.Analytics.csproj", "src/Shared/Acontplus.Analytics/"]
COPY ["src/Services/Billing/Billing.Api/Billing.Api.csproj", "src/Services/Billing/Billing.Api/"]
COPY ["src/Services/Billing/Billing.Application/Billing.Application.csproj", "src/Services/Billing/Billing.Application/"]
COPY ["src/Services/Billing/Billing.Infrastructure/Billing.Infrastructure.csproj", "src/Services/Billing/Billing.Infrastructure/"]
COPY ["src/Services/Billing/Billing.Domain/Billing.Domain.csproj", "src/Services/Billing/Billing.Domain/"]
RUN dotnet restore "src/Services/Billing/Billing.Api/Billing.Api.csproj"

# Copy source and build
COPY . .
WORKDIR "/src/src/Services/Billing/Billing.Api"
RUN dotnet publish "Billing.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Run as non-root user
USER $APP_UID

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Billing.Api.dll"]

