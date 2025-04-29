# Etapa base (runtime)
FROM mcr.microsoft.com/dotnet/aspnet:9.0-windowsservercore-ltsc2022 AS base
WORKDIR /app
EXPOSE 5010
ENV ASPNETCORE_URLS=http://+:5010

# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:9.0-windowsservercore-ltsc2022 AS build
ARG BUILD_CONFIGURATION=Release
ARG DOTNET_SKIP_POLICY_LOADING=true
WORKDIR /src
# COPY ["Directory.Packages.props", "."]
COPY ["Reports.API.csproj", "./"]
RUN dotnet restore "Reports.API.csproj"

COPY . .
RUN dotnet build "Reports.API.csproj" -c Release -o /app/build

# Etapa de publish
FROM build AS publish
RUN dotnet publish "Reports.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Reports.API.dll"]
