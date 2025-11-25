# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080



RUN groupadd -g 2000 dotnet \
    && useradd -m -u 2000 -g 2000 dotnet
USER dotnet

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
ARG DOTNET_SKIP_POLICY_LOADING=true

WORKDIR /src
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]
COPY ["src/Services/Restaurant/Restaurant.Api/Restaurant.API.csproj", "src/Services/Restaurant/Restaurant.Api/"]
RUN dotnet restore "./src/Services/Restaurant/Restaurant.Api/Restaurant.API.csproj"
COPY . .
WORKDIR "/src/src/Services/Restaurant/Restaurant.Api"
RUN dotnet build "./Restaurant.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

RUN ls /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Restaurant.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Restaurant.API.dll"]