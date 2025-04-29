# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]
COPY ["src/Services/Facturacion/FactElect.API/FactElect.API.csproj", "src/Services/Facturacion/FactElect.API/"]
COPY ["src/Services/Facturacion/FactElect.Application/FactElect.Application.csproj", "src/Services/Facturacion/FactElect.Application/"]
COPY ["src/Services/Facturacion/FactElect.Infrastructure/FactElect.Infrastructure.csproj", "src/Services/Facturacion/FactElect.Infrastructure/"]
COPY ["src/Services/Facturacion/FactElect.Domain/FactElect.Domain.csproj", "src/Services/Facturacion/FactElect.Domain/"]
RUN dotnet restore "./src/Services/Facturacion/FactElect.API/FactElect.API.csproj"
COPY . .
WORKDIR "/src/src/Services/Facturacion/FactElect.API"
RUN dotnet build "./FactElect.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./FactElect.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FactElect.API.dll"]