# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution files
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]

# Copy project file and restore
COPY ["src/Services/Vet/Vet.Api/Vet.Api.csproj", "src/Services/Vet/Vet.Api/"]
RUN dotnet restore "src/Services/Vet/Vet.Api/Vet.Api.csproj"

# Copy source and build
COPY . .
WORKDIR "/src/src/Services/Vet/Vet.Api"
RUN dotnet publish "Vet.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080

# Run as non-root user
USER $APP_UID

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Vet.Api.dll"]
