# Base runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-windowsservercore-ltsc2022 AS base
WORKDIR /app
EXPOSE 5010
ENV ASPNETCORE_URLS=http://+:5010

# Build and publish
FROM mcr.microsoft.com/dotnet/sdk:9.0-windowsservercore-ltsc2022 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution file - adjust path based on your actual directory structure
COPY ["AcontPlus.sln", "./"]
# Copy project file - note the "src" prefix
COPY ["src/Services/Reports/Reports.API/Reports.API.csproj", "./src/Services/Reports/Reports.API/"]

# Restore dependencies
RUN dotnet restore

# Copy the rest of the project
COPY ["src/Services/Reports/Reports.API/", "./src/Services/Reports/Reports.API/"]

# Publish directly
WORKDIR /src/src/Services/Reports/Reports.API
RUN dotnet publish "Reports.API.csproj" -c %BUILD_CONFIGURATION% -o /app/publish /p:UseAppHost=false

# Final image
FROM base AS final
WORKDIR /app

# Copy only the published files
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Reports.API.dll"]