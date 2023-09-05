#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Directory.Packages.props", "."]
COPY ["Nuget.config", "."]
COPY ["Services/Restaurant/Restaurant.API/Restaurant.API.csproj", "Services/Restaurant/Restaurant.API/"]
COPY ["Services/Common/Lib.Common/Lib.Common.csproj", "Services/Common/Lib.Common/"]
COPY ["Services/Common/Services.Common/Services.Common.csproj", "Services/Common/Services.Common/"]
COPY ["Services/Restaurant/Restaurant.Application/Restaurant.Application.csproj", "Services/Restaurant/Restaurant.Application/"]
COPY ["Services/Common/Common.Infrastructure/Common.Infrastructure.csproj", "Services/Common/Common.Infrastructure/"]
COPY ["Services/Common/Common.Reports/Common.Reports.csproj", "Services/Common/Common.Reports/"]
COPY ["Services/Common/Domain/Domain.csproj", "Services/Common/Domain/"]
COPY ["Services/Restaurant/Restaurant.Infrastructure/Restaurant.Infrastructure.csproj", "Services/Restaurant/Restaurant.Infrastructure/"]
COPY ["Services/Restaurant/Restaurant.Core/Restaurant.Core.csproj", "Services/Restaurant/Restaurant.Core/"]
RUN dotnet restore "Services/Restaurant/Restaurant.API/Restaurant.API.csproj"
COPY . .
WORKDIR "/src/Services/Restaurant/Restaurant.API"
RUN dotnet build "Restaurant.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Restaurant.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Restaurant.API.dll"]