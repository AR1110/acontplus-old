FROM mcr.microsoft.com/dotnet/aspnet:6.0-focal AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS build
WORKDIR /src

# It's important to keep lines from here down to "COPY . ." identical in all Dockerfiles
# to take advantage of Docker's build cache, to speed up local container builds
COPY "AcontPlus.sln" "AcontPlus.sln"

COPY "Services/Identity/Identity.API/Identity.API.csproj" "Services/Identity/Identity.API/Identity.API.csproj"

COPY "docker-compose.dcproj" "docker-compose.dcproj"

COPY "Directory.Packages.props" "Directory.Packages.props"
COPY "NuGet.config" "NuGet.config"

RUN dotnet restore "AcontPlus.sln"

COPY . .
WORKDIR /src/Services/Identity/Identity.API
RUN dotnet publish --no-restore -c Release -o /app

FROM build AS publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Identity.API.dll"]
