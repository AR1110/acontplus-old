# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8002

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
ARG DOTNET_SKIP_POLICY_LOADING=true

WORKDIR /src
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]
COPY ["src/Services/Vet/Vet.API/Vet.API.csproj", "src/Services/Vet/Vet.API/"]
RUN dotnet restore "./src/Services/Vet/Vet.API/Vet.API.csproj"
COPY . .
WORKDIR "/src/src/Services/Vet/Vet.API"
RUN dotnet build "./Vet.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

RUN ls /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Vet.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Vet.API.dll"]