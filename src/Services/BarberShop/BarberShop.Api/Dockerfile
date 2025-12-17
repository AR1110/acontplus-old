# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution files
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]

# Copy project files and restore
COPY ["src/Services/BarberShop/BarberShop.Api/BarberShop.Api.csproj", "src/Services/BarberShop/BarberShop.Api/"]
COPY ["src/Services/BarberShop/BarberShop.Application/BarberShop.Application.csproj", "src/Services/BarberShop/BarberShop.Application/"]
COPY ["src/Services/BarberShop/BarberShop.Infrastructure/BarberShop.Infrastructure.csproj", "src/Services/BarberShop/BarberShop.Infrastructure/"]
COPY ["src/Services/BarberShop/BarberShop.Domain/BarberShop.Domain.csproj", "src/Services/BarberShop/BarberShop.Domain/"]
RUN dotnet restore "src/Services/BarberShop/BarberShop.Api/BarberShop.Api.csproj"

# Copy source and build
COPY . .
WORKDIR "/src/src/Services/BarberShop/BarberShop.Api"
RUN dotnet publish "BarberShop.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Run as non-root user
USER $APP_UID

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BarberShop.Api.dll"]
