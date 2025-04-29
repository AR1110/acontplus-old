# Etapa base (runtime)
FROM mcr.microsoft.com/dotnet/aspnet:9.0-windowsservercore-ltsc2022 AS base
WORKDIR /app
EXPOSE 5010
ENV ASPNETCORE_URLS=http://+:5010

# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:9.0-windowsservercore-ltsc2022 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copiar solución y proyecto
COPY AcontPlus.sln .
COPY Services/Reports/Reports.API/Reports.API.csproj Services/Reports/Reports.API/

# Restaurar dependencias
RUN dotnet restore

# Copiar el resto del código de la API
COPY Services/Reports/Reports.API/ Services/Reports/Reports.API/

# Compilar el proyecto
WORKDIR /src/Services/Reports/Reports.API
RUN dotnet build "Reports.API.csproj" -c %BUILD_CONFIGURATION% -o /app/build

# Etapa de publicación
FROM build AS publish
RUN dotnet publish "Reports.API.csproj" -c %BUILD_CONFIGURATION% -o /app/publish /p:UseAppHost=false

# Etapa final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Reports.API.dll"]