# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution files
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]

# Copy project file and restore
COPY ["src/ApiGateways/Ocelot.Api/Ocelot.Api.csproj", "src/ApiGateways/Ocelot.Api/"]
RUN dotnet restore "src/ApiGateways/Ocelot.Api/Ocelot.Api.csproj"

# Copy source and build
COPY . .
WORKDIR "/src/src/ApiGateways/Ocelot.Api"
RUN dotnet publish "Ocelot.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Run as non-root user
USER $APP_UID

COPY --from=build /app/publish .
COPY --from=build /src/src/ApiGateways/Ocelot.Api/ocelot.Production.json ./ocelot.Production.json
ENTRYPOINT ["dotnet", "Ocelot.Api.dll"]
