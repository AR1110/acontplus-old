# Flujo de Docker y Docker Compose en AcontPlus

## Tabla de Contenidos
1. [Arquitectura de Contenedores](#arquitectura-de-contenedores)
2. [Scripts de Perfiles (Desarrollo Rápido)](#scripts-de-perfiles-desarrollo-rápido) 🆕
3. [Ambientes: Desarrollo vs Producción](#ambientes-desarrollo-vs-producción)
4. [Estructura de Dockerfiles](#estructura-de-dockerfiles)
5. [Docker Compose](#docker-compose)
6. [Flujo de Construcción](#flujo-de-construcción)
7. [Flujo de Ejecución](#flujo-de-ejecución)
8. [Comandos Útiles](#comandos-útiles)
9. [Preguntas Frecuentes (FAQ)](#preguntas-frecuentes-faq)
10. [Troubleshooting](#troubleshooting)

---

## Arquitectura de Contenedores

El proyecto AcontPlus utiliza una arquitectura de microservicios basada en contenedores Docker. La estructura completa incluye:

### Servicios de Negocio (13)
- **accounting.api** - Servicio de contabilidad
- **sales.api** - Servicio de ventas
- **billing.api** - Servicio de facturación
- **inventory.api** - Servicio de inventario
- **purchases.api** - Servicio de compras
- **restaurant.api** - Servicio de restaurante
- **vet.api** - Servicio veterinario
- **mechanical.api** - Servicio mecánico
- **barbershop.api** - Servicio de barbería
- **technicalsupport.api** - Servicio de soporte técnico
- **common.api** - Servicio común
- **identity.api** - Servicio de identidad y autenticación
- **configuration.api** - Servicio de configuración

### API Gateway (1)
- **ocelot.api** - Gateway de enrutamiento (puerto 80:8080)

### Total: 14 contenedores

---

## Scripts de Perfiles (Desarrollo Rápido) 🆕

Para facilitar el desarrollo diario, se han creado **scripts automatizados** que permiten trabajar con grupos lógicos de servicios en lugar de todos a la vez.

### 🎯 ¿Por qué usar Scripts de Perfiles?

**Problema:** Build de todos los servicios toma 25-30 minutos y consume ~1.5 GB RAM.

**Solución:** Scripts que permiten trabajar solo con los servicios que necesitas:
- ⚡ **Build en 2-3 minutos** (vs 25-30 min)
- 💾 **~500 MB RAM** (vs 1.5 GB)
- 🎯 **Desarrollo enfocado** por módulo

### 📋 Perfiles Disponibles

| Perfil | Servicios | Uso Típico |
|--------|-----------|------------|
| **Core** | Gateway + Identity + Configuration + Common | Infraestructura básica necesaria siempre |
| **Sales** | Core + Sales + Billing + Inventory | Desarrollo de módulo de ventas |
| **Inventory** | Core + Inventory + Purchases + Accounting | Gestión de inventario |
| **Financial** | Core + Accounting + Billing + Purchases | Contabilidad y finanzas |
| **Restaurant** | Core + Restaurant + Sales + Inventory | Sistema de restaurante |
| **Automotive** | Core + Mechanical + Vet + TechnicalSupport | Talleres y veterinaria |
| **Services** | Core + BarberShop + TechnicalSupport | Servicios personales |
| **Gateway** | Solo Ocelot Gateway | Testing de gateway |
| **All** | Todos los 14 servicios | Setup inicial completo |

### 🚀 Uso Rápido

#### Opción 1: Quick Start (Más simple)

```powershell
# Iniciar perfil Core (recomendado para comenzar)
.\scripts\quick-start.ps1

# Iniciar módulo de ventas
.\scripts\quick-start.ps1 -Profile Sales

# Iniciar módulo de restaurante
.\scripts\quick-start.ps1 -Profile Restaurant
```

**¿Qué hace?**
1. Build paralelo de las imágenes del perfil
2. Inicia los contenedores automáticamente
3. Muestra el estado de los servicios

#### Opción 2: Script de Perfiles (Mayor control)

```powershell
# Build de un perfil (paralelo por defecto)
.\scripts\docker-profiles.ps1 -Profile Sales -Action build -Parallel

# Build + Up en un comando
.\scripts\docker-profiles.ps1 -Profile Sales -Action up

# Up sin rebuild (usa imágenes existentes)
.\scripts\docker-profiles.ps1 -Profile Sales -Action up -NoBuild

# Ver logs en tiempo real
.\scripts\docker-profiles.ps1 -Profile Sales -Action logs -Follow

# Reiniciar servicios del perfil
.\scripts\docker-profiles.ps1 -Profile Sales -Action restart

# Detener servicios del perfil
.\scripts\docker-profiles.ps1 -Profile Sales -Action stop
```

#### Opción 3: Funciones de PowerShell (Más rápido)

Cargar helpers en tu sesión:
```powershell
# Cargar funciones (una vez por sesión)
. .\scripts\dev-helpers.ps1

# Usar aliases cortos
acont-core          # Inicia Core
acont-sales         # Inicia Sales
acont-restaurant    # Inicia Restaurant
acont-status        # Ver estado
acont-stop          # Detener todo

# Funciones útiles
Rebuild-AcontService sales.api
Watch-AcontLogs restaurant.api
Restart-AcontService billing.api
```

### 📊 Ejemplos de Flujos de Trabajo

#### Día 1: Setup Inicial

```powershell
# Solo lo necesario para empezar
.\scripts\quick-start.ps1 -Profile Core

# O módulo completo si trabajas en ventas
.\scripts\quick-start.ps1 -Profile Sales
```

#### Día a Día: Desarrollo de Ventas

```powershell
# 1. Cargar helpers
. .\scripts\dev-helpers.ps1

# 2. Iniciar servicios
acont-sales

# 3. Modificar código en Sales.Api
# (editas SalesController.cs)

# 4. Rebuild y reiniciar solo Sales
Rebuild-AcontService sales.api

# 5. Ver logs
Watch-AcontLogs sales.api
```

#### Cambiar entre Módulos

```powershell
# Trabajabas en Sales, ahora necesitas Restaurant
.\scripts\docker-profiles.ps1 -Profile Sales -Action stop
.\scripts\docker-profiles.ps1 -Profile Restaurant -Action up -NoBuild
```

#### Pull de Git con Cambios

```powershell
git pull origin develop

# Rebuild solo el perfil afectado
.\scripts\docker-profiles.ps1 -Profile Sales -Action up
```

### 🐧 Linux/Mac

Para usuarios de Linux/Mac, se incluye `docker-profiles.sh`:

```bash
# Dar permisos de ejecución
chmod +x scripts/docker-profiles.sh

# Uso
./scripts/docker-profiles.sh core build --parallel
./scripts/docker-profiles.sh sales up
./scripts/docker-profiles.sh restaurant logs -f
```

### 📖 Documentación Completa

Ver [scripts/README.md](../scripts/README.md) para documentación detallada de todos los scripts.

---

## Ambientes: Desarrollo vs Producción

### Resumen de Diferencias

| Aspecto | Desarrollo | Producción |
|---------|------------|------------|
| **Archivo Compose** | `docker-compose.yml` + `docker-compose.override.yml` | `docker-compose.yml` + `docker-compose.prod.yml` |
| **Variables de Entorno** | `.env.development` | `.env.production` |
| **User Secrets** | ✅ Montados desde máquina local | ❌ No disponibles (usar variables de entorno) |
| **Logging Level** | `Information` / `Debug` | `Warning` / `Error` |
| **Puertos Expuestos** | Múltiples servicios (debugging) | Solo Ocelot Gateway |
| **Recursos Limitados** | ❌ Sin límites | ✅ CPU y memoria limitados |
| **Restart Policy** | `no` / `on-failure` | `always` |
| **Log a Archivos** | ✅ Habilitado (`ENABLE_LOCAL_FILE_LOGGING=true`) | ❌ Deshabilitado (usar agregadores externos) |
| **Hot Reload** | ✅ Posible (con volúmenes) | ❌ Requiere rebuild |
| **Orquestación** | Docker Compose | Kubernetes / Docker Swarm |

---

### Configuración por Ambiente

#### 🔧 **DESARROLLO** (Local)

**Propósito:** Facilitar debugging, hot reload y acceso directo a servicios.

**Archivos Usados:**
```
docker-compose.yml          # Configuración base
docker-compose.override.yml # Sobreescrituras de desarrollo (auto-merged)
.env.development            # Variables de entorno
```

**Comando de Inicio:**
```bash
# Docker Compose automáticamente fusiona override.yml
docker-compose up -d

# O especificando archivo .env
docker-compose --env-file .env.development up -d
```

**Características:**
1. **User Secrets Montados:**
   ```yaml
   volumes:
     - ~/.microsoft/usersecrets:/root/.microsoft/usersecrets:ro
   ```
   - Permite usar secretos locales sin hardcodearlos
   - Prioridad sobre `appsettings.json`

2. **Puertos Múltiples Expuestos:**
   ```yaml
   ports:
     - "5000:8080"  # Ocelot Gateway
     - "5001:8080"  # Sales API (debugging directo)
     - "5002:8080"  # Accounting API
   ```
   - Acceso directo a cada servicio sin pasar por Gateway

3. **Logging Verboso:**
   ```bash
   LOG_LEVEL=Information
   ENABLE_LOCAL_FILE_LOGGING=true
   ```

4. **Variables de Conexión Simplificadas:**
   ```bash
   # .env.development
   SERVICE_URL_SALES=http://sales.api:8080
   CONNECTION_STRING=Server=localhost;Database=AcontPlus_Dev;...
   ```

5. **Sin Límites de Recursos:**
   - Contenedores usan CPU/RAM disponible
   - Facilita profiling y debugging

**Flujo de Trabajo:**
```bash
# 1. Copiar configuración
cp .env.example .env

# 2. Editar .env con valores locales
# (ConnectionString, JWT secrets, etc.)

# 3. Iniciar servicios
docker-compose up -d

# 4. Ver logs en tiempo real
docker-compose logs -f sales.api

# 5. Hacer cambios en código
# (editar archivos .cs)

# 6. Rebuild solo el servicio modificado
docker-compose build sales.api
docker-compose up -d sales.api

# 7. Verificar cambios
curl http://localhost:5001/api/sales/...
```

---

#### 🚀 **PRODUCCIÓN**

**Propósito:** Estabilidad, seguridad y eficiencia de recursos.

**Archivos Usados:**
```
docker-compose.yml       # Configuración base
docker-compose.prod.yml  # Sobreescrituras de producción (manual)
.env.production          # Variables de entorno (NO en Git)
```

**Comando de Inicio:**
```bash
# Especificar archivos compose explícitamente
docker-compose \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  --env-file .env.production \
  up -d

# Con registry privado
docker-compose \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  --env-file .env.production \
  pull

docker-compose \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  --env-file .env.production \
  up -d
```

**Características:**

1. **Sin User Secrets:**
   - Variables de entorno desde `.env.production` o secretos de orquestador
   - En Kubernetes: ConfigMaps y Secrets
   - En Docker Swarm: Docker Secrets

2. **Solo Gateway Expuesto:**
   ```yaml
   ocelot.api:
     ports:
       - "80:8080"  # Solo el gateway es accesible externamente

   # Otros servicios NO tienen puertos expuestos
   sales.api:
     # Sin ports: solo accesibles dentro de la red Docker
   ```

3. **Restart Policy:**
   ```yaml
   restart: always  # Reinicia automáticamente si falla
   ```

4. **Límites de Recursos:**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
       reservations:
         cpus: '0.25'
         memory: 128M
   ```

5. **Logging Optimizado:**
   ```yaml
   environment:
     - LOG_LEVEL=Warning
     - ENABLE_LOCAL_FILE_LOGGING=false

   logging:
     driver: json-file
     options:
       max-size: 10m
       max-file: 3
   ```

6. **Variables de Conexión Seguras:**
   ```bash
   # .env.production (NO COMMITEAR en Git)
   CONNECTION_STRING=Server=db.production.com;Database=AcontPlus;User Id=${DB_USER};Password=${DB_PASSWORD};
   JWT_SECRET_KEY=${SECURE_JWT_KEY_FROM_VAULT}
   DOCKER_REGISTRY=myregistry.azurecr.io/
   ```

**Flujo de Trabajo:**

```bash
# 1. En servidor de producción, crear .env.production
nano .env.production
# (configurar con valores seguros)

# 2. Pull imágenes desde registry
docker login myregistry.azurecr.io
docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull

# 3. Iniciar con configuración de producción
docker-compose \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  --env-file .env.production \
  up -d

# 4. Verificar estado
docker ps

# 5. Monitorear logs (limitados)
docker logs ocelot-api --tail 100

# 6. Health check
curl http://localhost/health
```

---

### Comparativa de Archivos de Configuración

#### `docker-compose.override.yml` (Desarrollo)
```yaml
services:
  sales.api:
    container_name: sales-api
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - Serilog__MinimumLevel__Default=Information
      - ConnectionStrings__DefaultConnection=${CONNECTION_STRING}
    volumes:
      - ~/.microsoft/usersecrets:/root/.microsoft/usersecrets:ro
    ports:
      - "5001:8080"  # Debugging directo
```

#### `docker-compose.prod.yml` (Producción)
```yaml
services:
  sales.api:
    restart: always
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - Serilog__MinimumLevel__Default=Warning
      - ConnectionStrings__DefaultConnection=${CONNECTION_STRING}
    # Sin volumes (sin user secrets)
    # Sin ports (solo red interna)
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: 3
```

---

### Variables de Entorno por Ambiente

#### `.env.development`
```bash
COMPOSE_PROJECT_NAME=acontplus-dev
ASPNETCORE_ENVIRONMENT=Development
GATEWAY_PORT=5000

# Logging
LOG_LEVEL=Information
ENABLE_LOCAL_FILE_LOGGING=true

# Service URLs (Docker network)
SERVICE_URL_SALES=http://sales.api:8080
SERVICE_URL_ACCOUNTING=http://accounting.api:8080

# Database (local)
CONNECTION_STRING=Server=localhost;Database=AcontPlus_Dev;User Id=sa;Password=DevPassword123;TrustServerCertificate=True;

# JWT (desarrollo - no seguro)
JWT_SECRET_KEY=dev-secret-key-not-for-production
JWT_ISSUER=https://localhost:5000
```

#### `.env.production`
```bash
COMPOSE_PROJECT_NAME=acontplus-prod
ASPNETCORE_ENVIRONMENT=Production
GATEWAY_PORT=80

# Logging
LOG_LEVEL=Warning
ENABLE_LOCAL_FILE_LOGGING=false
LOG_DRIVER=json-file
LOG_MAX_SIZE=10m
LOG_MAX_FILE=3

# Service URLs (Docker network)
SERVICE_URL_SALES=http://sales.api:8080
SERVICE_URL_ACCOUNTING=http://accounting.api:8080

# Database (producción - desde secrets manager)
CONNECTION_STRING=${DB_CONNECTION_STRING}

# JWT (desde Azure Key Vault / AWS Secrets Manager)
JWT_SECRET_KEY=${JWT_SECRET_FROM_VAULT}
JWT_ISSUER=https://api.acontplus.com

# Docker Registry
DOCKER_REGISTRY=myregistry.azurecr.io/

# Resource Limits
RESTART_POLICY=always
CPU_LIMIT=1
MEMORY_LIMIT=512M
```

---

### Estrategias de Despliegue por Ambiente

#### 🏠 Desarrollo Local
```bash
# Opción 1: Solo backend
docker-compose up -d

# Opción 2: Backend + SQL Server local
docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.db.yml up -d
```

#### ☁️ Staging/QA
```bash
# Similar a producción pero con datos de prueba
docker-compose \
  -f docker-compose.yml \
  -f docker-compose.staging.yml \
  --env-file .env.staging \
  up -d
```

#### 🏢 Producción (Docker Swarm)
```bash
# Deploy como stack
docker stack deploy \
  -c docker-compose.yml \
  -c docker-compose.prod.yml \
  acontplus

# Escalar servicios
docker service scale acontplus_sales.api=3
```

#### ☸️ Producción (Kubernetes)
```bash
# Usar imágenes de Docker Compose, pero orquestar con K8s
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmaps.yaml
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
kubectl apply -f k8s/ingress.yaml
```

---

### Prioridad de Configuración

ASP.NET Core carga configuración en este orden (último gana):

```
1. appsettings.json (en imagen Docker)
   ↓
2. appsettings.{Environment}.json (Development/Production)
   ↓
3. User Secrets (solo en Development, montado como volumen)
   ↓
4. Variables de Entorno (de .env.* o docker-compose)
   ↓
5. Argumentos de línea de comandos (raro en Docker)
```

**Ejemplo:**

```json
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=Default"
  }
}

// appsettings.Development.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=AcontPlus_Dev"
  }
}

// User Secrets (solo desarrollo)
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=AcontPlus_DevSecrets"
  }
}

// docker-compose.override.yml (variable de entorno - gana esta)
environment:
  - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=AcontPlus_Docker
```

**Resultado en Development:**
```
Server=sqlserver;Database=AcontPlus_Docker
```

---

### Recomendaciones por Ambiente

#### ✅ Desarrollo
- ✅ Usar User Secrets para datos sensibles locales
- ✅ Exponer múltiples puertos para debugging
- ✅ Logs verbosos (`Information` o `Debug`)
- ✅ Rebuild frecuente de servicios individuales
- ✅ Usar `.env.development` en Git (sin secretos reales)
- ✅ Hot reload activado si es posible

#### ✅ Producción
- ✅ Variables de entorno desde secretos del orquestador
- ✅ Solo Gateway expuesto externamente
- ✅ Logs mínimos (`Warning` o `Error`)
- ✅ CI/CD para deployments
- ✅ `.env.production` NUNCA en Git
- ✅ Límites de recursos configurados
- ✅ Restart policy `always`
- ✅ Health checks configurados
- ✅ Logging centralizado (ELK, Seq, Application Insights)

---

## Estructura de Dockerfiles

Cada servicio tiene su propio `Dockerfile` ubicado en `src/Services/{ServiceName}/{ServiceName}.Api/Dockerfile`.

### Patrón Multi-Stage Build

Todos los Dockerfiles siguen el patrón **multi-stage build** para optimizar el tamaño de las imágenes:

```dockerfile
# STAGE 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copiar archivos de configuración central
COPY [Directory.Packages.props, .]
COPY [Nuget.config, .]

# Copiar proyecto compartido de Analytics
COPY [src/Shared/Acontplus.Analytics/Acontplus.Analytics.csproj, src/Shared/Acontplus.Analytics/]

# Copiar proyectos de Clean Architecture del servicio
COPY [src/Services/{Service}/{Service}.Api/{Service}.Api.csproj, src/Services/{Service}/{Service}.Api/]
COPY [src/Services/{Service}/{Service}.Application/{Service}.Application.csproj, src/Services/{Service}/{Service}.Application/]
COPY [src/Services/{Service}/{Service}.Domain/{Service}.Domain.csproj, src/Services/{Service}/{Service}.Domain/]
COPY [src/Services/{Service}/{Service}.Infrastructure/{Service}.Infrastructure.csproj, src/Services/{Service}/{Service}.Infrastructure/]

# Restaurar dependencias
RUN dotnet restore "src/Services/{Service}/{Service}.Api/{Service}.Api.csproj"

# Copiar todo el código fuente
COPY . .

# Compilar y publicar
WORKDIR "/src/src/Services/{Service}/{Service}.Api"
RUN dotnet publish "{Service}.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# STAGE 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "{Service}.Api.dll"]
```

### Componentes Clave

#### 1. **Imagen Base**
- **Build**: `mcr.microsoft.com/dotnet/sdk:10.0` (contiene SDK completo para compilar)
- **Runtime**: `mcr.microsoft.com/dotnet/aspnet:10.0` (solo runtime, más ligera)

#### 2. **Configuración Central**
- `Directory.Packages.props`: Gestión centralizada de versiones de NuGet
- `Nuget.config`: Configuración de fuentes de paquetes

#### 3. **Clean Architecture**
Cada servicio incluye 4 proyectos:
- **Api**: Controladores, Endpoints, Program.cs
- **Application**: Lógica de negocio, DTOs, Interfaces
- **Domain**: Entidades, Value Objects
- **Infrastructure**: EF Core, Repositorios, Integraciones

#### 4. **Proyecto Compartido**
- `Acontplus.Analytics`: Biblioteca compartida para análisis

#### 5. **Optimizaciones**
- `--no-restore`: Evita restaurar en la etapa de publish (ya se hizo antes)
- `/p:UseAppHost=false`: No genera ejecutable nativo (reduce tamaño)
- Multi-stage: Solo la imagen final (`aspnet:10.0`) se incluye en el contenedor

---

## Docker Compose

### Archivo Principal: `docker-compose.yml`

Define todos los servicios, sus configuraciones y dependencias.

#### Estructura de un Servicio

```yaml
service-name.api:
  image: ${DOCKER_REGISTRY-}service-name-api
  build:
    context: .
    dockerfile: src/Services/ServiceName/ServiceName.Api/Dockerfile
  environment:
    - ASPNETCORE_ENVIRONMENT=Development
    - ConnectionStrings__DefaultConnection=${DB_CONNECTION_STRING}
  ports:
    - "5001:8080"  # Solo si necesita exposición externa
  depends_on:
    - sqlserver
  networks:
    - acontplus-network
```

#### Componentes Clave

1. **Nombres de Servicio**
   - Formato: `{service}.api` (ej: `accounting.api`, `sales.api`)
   - Los contenedores se comunican entre sí usando estos nombres

2. **Imágenes**
   - Variable `DOCKER_REGISTRY` permite usar registro privado
   - Si está vacía, usa DockerHub local

3. **Context y Dockerfile**
   - `context: .` - La raíz del proyecto
   - `dockerfile: src/Services/...` - Ruta al Dockerfile específico

4. **Variables de Entorno**
   - `ASPNETCORE_ENVIRONMENT`: Define el ambiente (Development, Staging, Production)
   - Variables de conexión a BD, secretos, etc.

5. **Puertos**
   - **Internos**: Todos los servicios escuchan en `8080`
   - **Externos**: Solo Ocelot expone puerto `80:8080` para acceso externo

6. **Redes**
   - Red `acontplus-network` permite comunicación entre contenedores

### Archivo Override: `docker-compose.override.yml`

Contiene configuraciones específicas para desarrollo local:

```yaml
service-name.api:
  environment:
    - ASPNETCORE_URLS=http://+:8080
    - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=AcontPlus;...
  volumes:
    - ~/.microsoft/usersecrets:/root/.microsoft/usersecrets:ro
  ports:
    - "5001:8080"
```

#### Propósito
- **User Secrets**: Monta secretos locales en contenedores
- **Variables de Desarrollo**: Configuraciones que NO van a producción
- **Port Mapping**: Exposición de puertos para debugging

---

## Flujo de Construcción

### 1. **Preparación**
```bash
# Verificar que estás en la raíz del proyecto
cd c:\Users\ifer7\source\repos\AcontPlus
```

### 2. **Construcción de Imágenes**

#### Opción A: Construir Todos los Servicios
```bash
docker-compose build
```

#### Opción B: Construcción Paralela (Más Rápido)
```bash
docker-compose build --parallel
```
- Construye múltiples imágenes simultáneamente
- Aprox. 25-30 minutos para 14 servicios

#### Opción C: Construir Servicios Específicos
```bash
docker-compose build sales.api accounting.api billing.api
```

### 3. **Proceso Interno de Build**

Para cada servicio:

```
1. Cargar Dockerfile
   ↓
2. Pull imagen base (mcr.microsoft.com/dotnet/sdk:10.0)
   ↓
3. Copiar Directory.Packages.props y Nuget.config
   ↓
4. Copiar archivos .csproj de todos los proyectos
   ↓
5. dotnet restore (descargar NuGet packages)
   ↓
6. Copiar todo el código fuente
   ↓
7. dotnet publish (compilar en Release mode)
   ↓
8. Crear imagen final con aspnet:10.0
   ↓
9. Copiar binarios publicados (/app/publish)
   ↓
10. Etiquetar imagen (ej: sales-api)
```

### 4. **Caché de Docker**

Docker cachea capas para acelerar builds posteriores:
- ✅ **Si no cambian**: `.csproj`, `Directory.Packages.props` → usa caché
- ❌ **Si cambian**: Código fuente → reconstruye desde `COPY . .`

---

## Flujo de Ejecución

### 1. **Iniciar Todos los Servicios**

```bash
docker-compose up -d
```

#### ⚠️ **Aclaraciones Importantes sobre `-d`:**

**`-d` NO significa "development"**, significa **"detached mode"** (modo en segundo plano):

- ✅ **Con `-d`**: Los contenedores corren en background y puedes seguir usando la terminal
  ```bash
  docker-compose up -d
  # Terminal queda libre, puedes ejecutar otros comandos
  ```

- ❌ **Sin `-d`**: Los contenedores corren en foreground y ves todos los logs en tiempo real
  ```bash
  docker-compose up
  # Terminal bloqueada mostrando logs
  # Ctrl+C detiene todos los contenedores
  ```

#### 🔄 **¿Los servicios se levantan automáticamente?**

**NO. Debes ejecutar `docker-compose up -d` cada vez que:**

1. ✋ **Reinicies tu computadora** (Windows, Mac, Linux)
   ```bash
   # Después de reiniciar
   cd c:\Users\ifer7\source\repos\AcontPlus
   docker-compose up -d
   ```

2. ✋ **Detengas los contenedores manualmente:**
   ```bash
   docker-compose down        # Detiene y elimina contenedores
   docker-compose stop        # Solo detiene (conserva contenedores)
   docker-compose up -d       # Necesitas volver a iniciar
   ```

3. ✋ **Docker Desktop/Engine se detenga o reinicie**

4. ✋ **El sistema operativo entre en suspensión prolongada** (a veces)

#### ✅ **Los contenedores SÍ persisten cuando:**

- ✅ Cierras la terminal (si iniciaste con `-d`)
- ✅ Apagas VS Code u otro editor
- ✅ Docker Desktop sigue corriendo y no reinicias la PC

#### 🚀 **Opciones para Auto-Inicio**

**Opción 1: Restart Policy (Desarrollo)**

En `docker-compose.override.yml`:
```yaml
services:
  sales.api:
    restart: unless-stopped  # Se reinicia automáticamente si Docker está corriendo
```

**Comportamiento:**
- ✅ Si el contenedor falla → Docker lo reinicia automáticamente
- ✅ Si detienes manualmente (`docker-compose stop`) → NO se reinicia
- ✅ Si reinicias Docker Desktop → Se levantan automáticamente
- ❌ **NO inicia Docker Desktop automáticamente al reiniciar Windows**

**Opción 2: Docker Desktop Auto-Start**

1. **Windows:**
   - Docker Desktop → Settings → General
   - ✅ Activar "Start Docker Desktop when you log in"
   - Ahora al reiniciar Windows, Docker Desktop arranca automáticamente
   - Con `restart: unless-stopped`, tus contenedores se levantan solos

2. **Linux (systemd):**
   ```bash
   sudo systemctl enable docker  # Docker inicia automáticamente
   ```

**Con esta configuración:**
```
Reinicias Windows
    ↓
Docker Desktop arranca automáticamente
    ↓
Contenedores con "restart: unless-stopped" se levantan solos
    ↓
¡Servicios disponibles sin ejecutar comandos!
```

**Opción 3: Script de Inicio (Más control)**

Crear `start-services.ps1`:
```powershell
# c:\Users\ifer7\source\repos\AcontPlus\start-services.ps1
Set-Location "c:\Users\ifer7\source\repos\AcontPlus"

Write-Host "Iniciando servicios AcontPlus..." -ForegroundColor Green

docker-compose up -d

Write-Host "Servicios iniciados. Verificando estado..." -ForegroundColor Green

docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host "`nAccede a Ocelot Gateway en: http://localhost:5000" -ForegroundColor Cyan
```

Ejecutar al abrir la computadora:
```powershell
powershell -ExecutionPolicy Bypass -File "c:\Users\ifer7\source\repos\AcontPlus\start-services.ps1"
```

#### 📋 **Resumen: ¿Cuándo ejecutar `docker-compose up -d`?**

| Situación | ¿Necesitas ejecutar? | Razón |
|-----------|---------------------|-------|
| Primera vez después de clonar repo | ✅ SÍ | Los contenedores no existen |
| Reiniciaste Windows/Mac | ✅ SÍ (sin auto-start) | Docker Desktop no está corriendo |
| Ejecutaste `docker-compose down` | ✅ SÍ | Eliminaste los contenedores |
| Ejecutaste `docker-compose stop` | ✅ SÍ | Contenedores detenidos |
| Cerraste la terminal | ❌ NO | Contenedores siguen corriendo en background |
| Apagaste VS Code | ❌ NO | Contenedores son independientes |
| Modificaste código | ❌ NO | Solo rebuild: `docker-compose build service.api` |
| Docker Desktop sigue corriendo | ❌ NO | Contenedores persisten |
| Configuraste `restart: unless-stopped` + Docker auto-start | ❌ NO | Se levantan automáticamente |

---

### 2. **Proceso de Startup**

```
1. Docker Compose lee docker-compose.yml + docker-compose.override.yml (si existe)
   ↓
2. Crea red 'acontplus-network' (si no existe)
   ↓
3. Para cada servicio:
   ├─ Verificar si contenedor existe
   │  ├─ Si NO existe → Crear desde imagen
   │  └─ Si existe → Reusar contenedor existente
   ├─ Montar volúmenes (user secrets)
   ├─ Configurar variables de entorno
   ├─ Conectar a red
   └─ Ejecutar ENTRYPOINT (dotnet {Service}.Api.dll)
   ↓
4. Aplicaciones .NET inician:
   ├─ Cargar appsettings.json
   ├─ Cargar User Secrets
   ├─ Configurar Serilog
   ├─ Registrar servicios DI
   ├─ Configurar middleware
   ├─ Mapear endpoints/controllers
   └─ Escuchar en puerto 8080
   ↓
5. Health checks activos (si configurados)
```

### 3. **Estados de Contenedores**

```bash
docker ps
```

Posibles estados:
- **Up**: Contenedor corriendo normalmente
- **Restarting**: Fallo continuo, Docker intenta reiniciar
- **Exited**: Contenedor detenido (error o terminado)

### 4. **Comunicación Entre Servicios**

```
Cliente HTTP/Browser
    ↓
Ocelot Gateway (localhost:80)
    ↓
Enruta a: http://sales.api:8080/api/...
    ↓
Red Docker (acontplus-network)
    ↓
Contenedor sales.api responde
```

---

## Comandos Útiles

### Construcción

```bash
# Construir todos los servicios
docker-compose build

# Construir en paralelo (más rápido)
docker-compose build --parallel

# Construir sin usar caché (forzar rebuild completo)
docker-compose build --no-cache

# Construir un servicio específico
docker-compose build sales.api
```

### Ejecución

```bash
# Iniciar todos los servicios en background
docker-compose up -d

# Iniciar con logs en consola
docker-compose up

# Iniciar servicios específicos
docker-compose up -d sales.api accounting.api ocelot.api

# Reconstruir y reiniciar servicios
docker-compose up -d --build
```

### Monitoreo

```bash
# Ver estado de todos los contenedores
docker ps

# Ver logs de un servicio
docker logs sales-api

# Ver logs en tiempo real (follow)
docker logs -f sales-api

# Ver últimas 50 líneas de logs
docker logs sales-api --tail 50

# Ver logs de todos los servicios
docker-compose logs

# Logs de servicios específicos
docker-compose logs sales.api accounting.api
```

### Gestión

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart sales.api

# Detener un servicio sin eliminarlo
docker-compose stop sales.api

# Iniciar un servicio detenido
docker-compose start sales.api

# Ver uso de recursos
docker stats
```

### Limpieza

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes sin usar
docker image prune

# Eliminar todo (contenedores, redes, imágenes, caché)
docker system prune -a

# Eliminar imágenes específicas
docker rmi sales-api accounting-api
```

### Debugging

```bash
# Ejecutar bash en un contenedor
docker exec -it sales-api /bin/bash

# Ejecutar comando en contenedor
docker exec sales-api dotnet --version

# Inspeccionar configuración del contenedor
docker inspect sales-api

# Ver procesos en un contenedor
docker top sales-api
```

---

## Troubleshooting

### Problema 1: Contenedor en Estado "Restarting"

**Síntoma:**
```bash
docker ps
# sales-api     Restarting (1) 5 seconds ago
```

**Diagnóstico:**
```bash
docker logs sales-api --tail 100
```

**Causas Comunes:**
1. **Error en Program.cs**: Exception durante startup
2. **Configuración faltante**: User Secrets no montados
3. **Conexión a BD**: ConnectionString incorrecto
4. **.NET 10 Parameter Binding**: Falta `[FromServices]` en endpoints

**Solución:**
- Revisar logs completos
- Verificar variables de entorno
- Validar que User Secrets estén en `~/.microsoft/usersecrets`

---

### Problema 2: Error "Body was inferred but the method does not allow inferred body parameters"

**Causa:**
.NET 10 requiere atributos explícitos en parámetros de minimal APIs.

**Solución:**
```csharp
// ❌ INCORRECTO
group.MapGet("/", async (
    FilterQuery filterQuery,
    ILookupService lookupService,
    IUserContext userContext) => { ... });

// ✅ CORRECTO
group.MapGet("/", async (
    FilterQuery filterQuery,  // AsParameters o binding automático
    [FromServices] ILookupService lookupService,
    [FromServices] IUserContext userContext) => { ... });
```

---

### Problema 3: "No such service: service-name"

**Causa:**
Nombre de servicio incorrecto en comando.

**Solución:**
```bash
# ❌ INCORRECTO (nombre de imagen)
docker-compose build sales-api

# ✅ CORRECTO (nombre de servicio en docker-compose.yml)
docker-compose build sales.api
```

Verificar nombres en `docker-compose.yml`:
```yaml
sales.api:        # <-- Usar este nombre
  image: sales-api
```

---

### Problema 4: Build Lento

**Causa:**
No se usa caché de Docker o se construye secuencialmente.

**Solución:**
```bash
# Usar build paralelo
docker-compose build --parallel

# Verificar caché
docker builder prune  # Limpia caché corrupto si es necesario
```

---

### Problema 5: Puerto Ya en Uso

**Síntoma:**
```
Error: bind: address already in use
```

**Diagnóstico:**
```bash
# Windows
netstat -ano | findstr :80

# Linux/Mac
lsof -i :80
```

**Solución:**
- Cambiar puerto en `docker-compose.override.yml`
- Detener proceso que usa el puerto
- Usar puerto diferente: `"8080:8080"` en lugar de `"80:8080"`

---

### Problema 6: Cambios en Código No Reflejados

**Causa:**
Contenedor usa imagen antigua.

**Solución:**
```bash
# Reconstruir y reiniciar
docker-compose up -d --build sales.api

# O forzar rebuild completo
docker-compose build --no-cache sales.api
docker-compose up -d sales.api
```

---

### Problema 7: NullReferenceException en Startup

**Causa Común:**
Configuración leída antes de cargar `ApplicationConfigurationBuilder`.

**Ejemplo en Restaurant.Api:**
```csharp
// ❌ INCORRECTO
var safeOrigins = builder.Configuration.GetSection("AllowedCorsOrigins").Get<string>().Split(",");
var configuration = ApplicationConfigurationBuilder.Load();

// ✅ CORRECTO
var configuration = ApplicationConfigurationBuilder.Load();
builder.Configuration.AddConfiguration(configuration);
var safeOrigins = builder.Configuration.GetSection("AllowedCorsOrigins").Get<string>()?.Split(",") ?? ["*"];
```

---

## Mejores Prácticas

### 1. **Desarrollo Local**
- Usar `docker-compose build --parallel` para builds iniciales
- Usar `docker-compose up -d` para iniciar servicios
- Monitorear logs: `docker-compose logs -f`

### 2. **Debugging**
- Mantener un servicio en logs activos: `docker-compose logs -f sales.api`
- Usar `docker exec` para inspeccionar contenedores en vivo
- Revisar health checks: `docker inspect --format='{{.State.Health}}' sales-api`

### 3. **Productividad**
- Crear aliases en PowerShell/Bash:
  ```bash
  # PowerShell Profile
  function dcup { docker-compose up -d }
  function dcdown { docker-compose down }
  function dclogs { docker-compose logs -f $args }
  ```

### 4. **Limpieza Regular**
```bash
# Cada semana
docker system prune

# Cada mes
docker system prune -a --volumes
```

---

## Flujo Completo: Desde Cambio de Código hasta Producción

### DESARROLLO LOCAL

```
1. CONFIGURACIÓN INICIAL (una vez)
   ├─ Clonar repositorio
   ├─ Copiar .env.example a .env
   ├─ Configurar User Secrets locales
   ├─ Ejecutar: docker-compose build --parallel
   └─ Ejecutar: docker-compose up -d

2. DESARROLLO DIARIO
   ├─ Modificar código en Visual Studio/VS Code
   ├─ Guardar cambios
   ├─ Rebuild servicio específico:
   │  └─ docker-compose build sales.api
   ├─ Reiniciar servicio:
   │  └─ docker-compose up -d sales.api
   └─ Verificar logs:
      └─ docker logs -f sales-api

3. TESTING LOCAL
   ├─ Probar endpoint:
   │  └─ curl http://localhost:5001/api/sales/...
   ├─ Ver en Swagger:
   │  └─ http://localhost:5001/swagger
   ├─ Ejecutar tests unitarios:
   │  └─ dotnet test
   └─ Validar integración con otros servicios

4. COMMIT
   ├─ git add .
   ├─ git commit -m "feat(sales): add new endpoint"
   └─ git push origin feature/new-endpoint
```

---

### STAGING/QA

```
5. PULL REQUEST & MERGE
   ├─ Crear PR en GitHub/Azure DevOps
   ├─ Code review
   ├─ Merge a develop
   └─ Trigger automático de CI/CD

6. CI/CD - BUILD (GitHub Actions / Azure Pipelines)
   ├─ Checkout código
   ├─ Ejecutar tests
   ├─ Build imagen Docker:
   │  └─ docker build -t myregistry.azurecr.io/sales-api:develop-${BUILD_ID} .
   ├─ Push a Container Registry:
   │  └─ docker push myregistry.azurecr.io/sales-api:develop-${BUILD_ID}
   └─ Tag como :latest-dev

7. DEPLOY A STAGING
   ├─ SSH a servidor de staging
   ├─ Pull nueva imagen:
   │  └─ docker-compose -f docker-compose.yml -f docker-compose.staging.yml pull sales.api
   ├─ Recrear servicio:
   │  └─ docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d sales.api
   ├─ Verificar health check:
   │  └─ curl http://staging.acontplus.com/health
   └─ Smoke tests automatizados

8. QA TESTING
   ├─ Tests de regresión
   ├─ Tests de integración
   ├─ Tests de performance
   └─ Aprobación de QA
```

---

### PRODUCCIÓN

```
9. RELEASE
   ├─ Crear PR de develop → main
   ├─ Aprobación de stakeholders
   ├─ Merge a main
   └─ Tag de release: v1.2.3

10. CI/CD - PRODUCTION BUILD
    ├─ Checkout main
    ├─ Build imagen con tag de versión:
    │  └─ docker build -t myregistry.azurecr.io/sales-api:v1.2.3 .
    ├─ Tag también como :latest:
    │  └─ docker tag myregistry.azurecr.io/sales-api:v1.2.3 myregistry.azurecr.io/sales-api:latest
    ├─ Push ambas tags
    └─ Escaneo de seguridad (Trivy, Snyk)

11. DEPLOY A PRODUCCIÓN

    Opción A: Docker Compose (servidores simples)
    ├─ SSH a servidor de producción
    ├─ Pull imagen:
    │  └─ docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull sales.api
    ├─ Rolling restart:
    │  └─ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps sales.api
    └─ Verificar:
       └─ docker logs sales-api --tail 100

    Opción B: Kubernetes (recomendado)
    ├─ Update deployment YAML con nueva imagen:
    │  └─ image: myregistry.azurecr.io/sales-api:v1.2.3
    ├─ Apply deployment:
    │  └─ kubectl apply -f k8s/sales-api-deployment.yaml
    ├─ Monitor rollout:
    │  └─ kubectl rollout status deployment/sales-api
    └─ Verify pods:
       └─ kubectl get pods -l app=sales-api

    Opción C: Docker Swarm
    ├─ Update service:
    │  └─ docker service update --image myregistry.azurecr.io/sales-api:v1.2.3 acontplus_sales.api
    ├─ Monitor:
    │  └─ docker service ps acontplus_sales.api
    └─ Verificar:
       └─ docker service logs acontplus_sales.api

12. MONITOREO POST-DEPLOY
    ├─ Verificar métricas (CPU, RAM, requests)
    ├─ Revisar logs centralizados (ELK, Seq)
    ├─ Validar health endpoints
    ├─ Smoke tests en producción
    └─ Alertas configuradas (PagerDuty, Slack)

13. ROLLBACK (si es necesario)

    Docker Compose:
    └─ docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull sales.api:v1.2.2
    └─ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d sales.api

    Kubernetes:
    └─ kubectl rollout undo deployment/sales-api
    └─ kubectl rollout status deployment/sales-api

    Docker Swarm:
    └─ docker service update --rollback acontplus_sales.api
```

---

### Diagrama de Ambientes

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEVELOPER MACHINE                          │
├─────────────────────────────────────────────────────────────────┤
│  • docker-compose.override.yml (auto)                           │
│  • .env.development                                             │
│  • User Secrets montados                                        │
│  • Puertos: 5000-5014                                           │
│  • LOG_LEVEL=Information                                        │
│  • Restart: on-failure                                          │
│  • Hot reload posible                                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓ git push
┌─────────────────────────────────────────────────────────────────┐
│                      CI/CD PIPELINE                             │
├─────────────────────────────────────────────────────────────────┤
│  • Build Docker images                                          │
│  • Run tests                                                    │
│  • Security scan                                                │
│  • Push to Container Registry                                  │
│    - myregistry.azurecr.io/service-api:develop-123             │
└─────────────────────────────────────────────────────────────────┘
                            ↓ auto deploy
┌─────────────────────────────────────────────────────────────────┐
│                      STAGING SERVER                             │
├─────────────────────────────────────────────────────────────────┤
│  • docker-compose.staging.yml                                   │
│  • .env.staging                                                 │
│  • Variables desde Azure Key Vault                             │
│  • Puerto: 80 (solo Gateway)                                   │
│  • LOG_LEVEL=Information                                        │
│  • Restart: always                                              │
│  • Resource limits: medium                                      │
└─────────────────────────────────────────────────────────────────┘
                     ↓ QA approval + merge to main
┌─────────────────────────────────────────────────────────────────┐
│                      CI/CD PIPELINE (PROD)                      │
├─────────────────────────────────────────────────────────────────┤
│  • Build with version tag: v1.2.3                               │
│  • Tag as :latest                                               │
│  • Security scan (required)                                     │
│  • Push to Registry                                             │
│    - myregistry.azurecr.io/service-api:v1.2.3                  │
│    - myregistry.azurecr.io/service-api:latest                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓ manual approval
┌─────────────────────────────────────────────────────────────────┐
│                   PRODUCTION CLUSTER                            │
├─────────────────────────────────────────────────────────────────┤
│  Kubernetes / Docker Swarm:                                     │
│  • docker-compose.prod.yml (si compose)                         │
│  • .env.production (secrets externos)                           │
│  • Variables desde Secrets Manager                             │
│  • Puerto: 443 (HTTPS - solo Gateway)                          │
│  • LOG_LEVEL=Warning                                            │
│  • Restart: always                                              │
│  • Resource limits: strict                                      │
│  • Replicas: 3+ (alta disponibilidad)                          │
│  • Health checks activos                                        │
│  • Logging centralizado                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Comandos por Ambiente

### Desarrollo
```bash
# Setup inicial
cp .env.example .env
docker-compose build --parallel
docker-compose up -d

# Desarrollo diario
docker-compose build sales.api
docker-compose up -d sales.api
docker logs -f sales-api

# Detener
docker-compose down
```

### Staging
```bash
# Deploy
docker-compose \
  -f docker-compose.yml \
  -f docker-compose.staging.yml \
  --env-file .env.staging \
  pull

docker-compose \
  -f docker-compose.yml \
  -f docker-compose.staging.yml \
  --env-file .env.staging \
  up -d

# Monitoreo
docker-compose -f docker-compose.yml -f docker-compose.staging.yml logs -f
```

### Producción (Docker Compose)
```bash
# Deploy
docker-compose \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  --env-file .env.production \
  pull

docker-compose \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  --env-file .env.production \
  up -d --no-deps sales.api  # Solo sales.api

# Verificar
docker ps
docker logs sales-api --tail 100
```

### Producción (Kubernetes)
```bash
# Deploy
kubectl set image deployment/sales-api sales-api=myregistry.azurecr.io/sales-api:v1.2.3
kubectl rollout status deployment/sales-api

# Monitoreo
kubectl get pods -l app=sales-api
kubectl logs -f deployment/sales-api
kubectl top pods -l app=sales-api

# Rollback
kubectl rollout undo deployment/sales-api
---

## Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [.NET Docker Images](https://hub.docker.com/_/microsoft-dotnet)
- [Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

## Resumen Rápido

### Desarrollo
```bash
# Setup inicial
cp .env.example .env
docker-compose build --parallel
docker-compose up -d

# Ver logs
docker logs -f sales-api

# Rebuild un servicio
docker-compose build sales.api
docker-compose up -d sales.api

# Detener todo
docker-compose down
```

### Staging
```bash
# Deploy
docker-compose -f docker-compose.yml -f docker-compose.staging.yml --env-file .env.staging up -d

# Logs
docker-compose -f docker-compose.yml -f docker-compose.staging.yml logs -f
```

### Producción
```bash
# Docker Compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production pull
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d

# Kubernetes
kubectl set image deployment/sales-api sales-api=myregistry.azurecr.io/sales-api:v1.2.3
kubectl rollout status deployment/sales-api
```

---

## Preguntas Frecuentes (FAQ)

### ❓ **¿Qué significa `-d` en `docker-compose up -d`?**

**Respuesta:** `-d` significa **"detached mode"** (modo desacoplado/background), **NO** significa "development".

- **Con `-d`**: Los contenedores corren en segundo plano. Puedes cerrar la terminal y siguen funcionando.
- **Sin `-d`**: Los logs se muestran en la terminal. Si cierras la terminal o presionas Ctrl+C, los contenedores se detienen.

---

### ❓ **¿Tengo que ejecutar `docker-compose up -d` cada vez que reinicio mi PC?**

**Respuesta:** **SÍ**, a menos que configures auto-inicio.

**Por defecto:**
- Al reiniciar Windows/Mac → Docker Desktop NO arranca automáticamente
- Aunque Docker Desktop arranque → Los contenedores NO se inician solos (por defecto)

**Solución 1: Auto-inicio de Docker Desktop**
1. Docker Desktop → Settings → General
2. ✅ Activar "Start Docker Desktop when you log in"

**Solución 2: Restart Policy**
En `docker-compose.override.yml`:
```yaml
services:
  sales.api:
    restart: unless-stopped
```

Con **ambas configuraciones**, después de reiniciar tu PC:
```
Windows arranca
  → Docker Desktop arranca automáticamente
    → Contenedores con restart: unless-stopped se levantan solos
```

---

### ❓ **Si cierro la terminal, ¿se detienen los contenedores?**

**Respuesta:** **NO**, si los iniciaste con `-d`.

```bash
# Inicias con -d
docker-compose up -d

# Cierras la terminal
# ✅ Contenedores SIGUEN corriendo

# Verificar en otra terminal
docker ps  # Los verás corriendo
```

**Sin `-d`:**
```bash
# Inicias sin -d
docker-compose up

# Cierras la terminal o presionas Ctrl+C
# ❌ Contenedores SE DETIENEN
```

---

### ❓ **¿Los contenedores se levantan automáticamente al abrir Docker Desktop?**

**Respuesta:** **Solo si configuraste `restart: unless-stopped` o `restart: always`.**

**Sin restart policy:**
```yaml
# docker-compose.override.yml (sin restart)
services:
  sales.api:
    # Sin restart policy
```
- Cierras Docker Desktop → Contenedores se detienen
- Abres Docker Desktop → Contenedores NO arrancan solos
- Necesitas: `docker-compose up -d`

**Con restart policy:**
```yaml
services:
  sales.api:
    restart: unless-stopped
```
- Cierras Docker Desktop → Contenedores se detienen
- Abres Docker Desktop → Contenedores arrancan automáticamente ✅

---

### ❓ **¿Cuál es la diferencia entre `docker-compose build` y `docker-compose up -d`?**

**Respuesta:** Son **dos pasos diferentes** del proceso:

```
docker-compose build    →    Crea/Actualiza IMÁGENES (plantillas)
docker-compose up -d    →    Crea/Inicia CONTENEDORES (instancias corriendo)
```

#### 🏗️ **`docker-compose build` - Construir Imágenes**

**¿Qué hace?**
- Lee el `Dockerfile` de cada servicio
- Ejecuta `dotnet restore` y `dotnet publish`
- Crea una **imagen Docker** (plantilla) con tu código compilado
- La imagen se guarda localmente en Docker

**¿Cuándo usarlo?**
- ✅ **Primera vez** después de clonar el repositorio
- ✅ **Después de cambiar código** (.cs, .csproj, etc.)
- ✅ **Después de cambiar Dockerfile**
- ✅ **Después de actualizar dependencias NuGet**

**Ejemplo:**
```bash
# Construir todas las imágenes
docker-compose build

# Construir solo sales-api
docker-compose build sales.api

# Construir sin usar caché (rebuild completo)
docker-compose build --no-cache sales.api

# Construir en paralelo (más rápido)
docker-compose build --parallel
```

**Resultado:**
- ✅ Nueva imagen creada/actualizada
- ❌ NO inicia contenedores
- Las imágenes están listas para ser ejecutadas

#### 🚀 **`docker-compose up -d` - Ejecutar Contenedores**

**¿Qué hace?**
- Toma las **imágenes** existentes
- Crea **contenedores** (instancias en ejecución)
- Configura redes, volúmenes, variables de entorno
- Inicia los servicios

**¿Cuándo usarlo?**
- ✅ **Después de `build`** (para iniciar)
- ✅ **Después de reiniciar PC**
- ✅ **Después de `docker-compose down`**
- ✅ **Para iniciar servicios detenidos**

**Ejemplo:**
```bash
# Iniciar todos los servicios
docker-compose up -d

# Iniciar servicios específicos
docker-compose up -d sales.api accounting.api

# Iniciar Y rebuild si hay cambios
docker-compose up -d --build sales.api
```

**Resultado:**
- ✅ Contenedores corriendo
- ✅ Servicios accesibles (puertos expuestos)
- ✅ Logs generándose

---

#### 📊 **Comparación Visual:**

```
┌──────────────────────────────────────────────────────────┐
│                   CÓDIGO FUENTE                          │
│  src/Services/Sales/Sales.Api/Controllers/...            │
└──────────────────────────────────────────────────────────┘
                         ↓
              docker-compose build sales.api
                         ↓
┌──────────────────────────────────────────────────────────┐
│                   IMAGEN DOCKER                          │
│  sales-api:latest (plantilla inmutable)                  │
│  - Contiene código compilado                             │
│  - Contiene dependencias                                 │
│  - NO está ejecutándose                                  │
└──────────────────────────────────────────────────────────┘
                         ↓
              docker-compose up -d sales.api
                         ↓
┌──────────────────────────────────────────────────────────┐
│              CONTENEDOR EN EJECUCIÓN                     │
│  sales-api (instancia corriendo)                         │
│  - Proceso dotnet ejecutándose                           │
│  - Puerto 8080 escuchando                                │
│  - Variables de entorno aplicadas                        │
│  - Generando logs                                        │
└──────────────────────────────────────────────────────────┘
```

---

#### 🔄 **Flujo Completo: Cambiar Código → Ver Cambios**

```bash
# 1. Modificas código
# (editas SalesController.cs)

# 2. Rebuild la imagen con el código nuevo
docker-compose build sales.api
# Tiempo: 30-60 segundos
# Resultado: Nueva imagen sales-api:latest

# 3. Recrear el contenedor con la nueva imagen
docker-compose up -d sales.api
# Tiempo: 2-5 segundos
# Resultado: Contenedor reiniciado con código nuevo

# 4. Verificar
docker logs sales-api --tail 50
curl http://localhost:5001/api/sales/test
```

**Atajo (ambos pasos en uno):**
```bash
# Build + Up en un solo comando
docker-compose up -d --build sales.api
```

---

#### ⚠️ **Error Común: Solo hacer UP sin BUILD**

```bash
# ❌ INCORRECTO (después de cambiar código)
# Modificaste SalesController.cs
docker-compose up -d sales.api
# Problema: Usa la imagen VIEJA (sin tus cambios)

# ✅ CORRECTO
docker-compose build sales.api    # Rebuild primero
docker-compose up -d sales.api    # Luego ejecutar
```

---

#### 📋 **Tabla Comparativa Completa**

| Aspecto | `docker-compose build` | `docker-compose up -d` |
|---------|----------------------|----------------------|
| **Propósito** | Crear/actualizar imágenes | Ejecutar contenedores |
| **Entrada** | Código fuente + Dockerfile | Imágenes Docker |
| **Salida** | Imagen Docker (plantilla) | Contenedor corriendo |
| **Tiempo** | 30-60 seg por servicio | 2-5 seg por servicio |
| **¿Compila código?** | ✅ SÍ (`dotnet publish`) | ❌ NO |
| **¿Inicia servicios?** | ❌ NO | ✅ SÍ |
| **Cuándo ejecutar** | Después de cambiar código | Para iniciar/reiniciar |
| **Puede correr solo** | ✅ SÍ (solo construye) | ✅ SÍ (usa imagen existente) |
| **Consume CPU/RAM** | ✅ Alto (compilación) | ⚡ Bajo (solo inicio) |

---

#### 🎯 **Casos de Uso Prácticos**

**Caso 1: Primer Setup**
```bash
# 1. Construir TODAS las imágenes (una sola vez)
docker-compose build --parallel
# Tiempo: 25-30 minutos (14 servicios)

# 2. Iniciar todos los servicios
docker-compose up -d
# Tiempo: 10-15 segundos
```

**Caso 2: Desarrollo Diario (modificando Sales API)**
```bash
# Opción A: Dos comandos
docker-compose build sales.api
docker-compose up -d sales.api

# Opción B: Un comando
docker-compose up -d --build sales.api
```

**Caso 3: Reinicio de PC**
```bash
# NO necesitas build (imágenes ya existen)
docker-compose up -d
# Usa las imágenes existentes
```

**Caso 4: Pull de Git con cambios en varios servicios**
```bash
git pull origin develop

# Rebuild solo los servicios modificados
docker-compose build sales.api accounting.api billing.api

# Reiniciar esos servicios
docker-compose up -d sales.api accounting.api billing.api
```

**Caso 5: Cambio en Dockerfile o Dependencies**
```bash
# Rebuild sin caché (forzar rebuild completo)
docker-compose build --no-cache sales.api

# Reiniciar
docker-compose up -d sales.api
```

---

#### 🔍 **Verificar Imágenes y Contenedores**

```bash
# Ver imágenes creadas
docker images | grep acontplus
# Salida:
# sales-api          latest    abc123...   2 minutes ago   200MB
# accounting-api     latest    def456...   5 minutes ago   195MB

# Ver contenedores corriendo
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
# Salida:
# sales-api         sales-api:latest         Up 3 minutes
# accounting-api    accounting-api:latest    Up 5 minutes

# Ver cuándo fue creada la imagen vs cuándo arrancó el contenedor
docker inspect sales-api | grep -A 5 "Created"
```

---

### ❓ **¿Cuál es la diferencia entre `docker-compose up -d` y `docker-compose start`?**

| Comando | ¿Qué hace? | ¿Cuándo usar? |
|---------|-----------|---------------|
| `docker-compose up -d` | Crea contenedores (si no existen) y los inicia | Primera vez o después de `down` |
| `docker-compose start` | Solo inicia contenedores existentes | Después de `stop` |
| `docker-compose stop` | Detiene contenedores (no los elimina) | Pausa temporal |
| `docker-compose down` | Detiene y ELIMINA contenedores | Limpiar completamente |

**Ejemplo:**
```bash
# Primera vez
docker-compose up -d          # ✅ Crea + Inicia

# Pausa temporal
docker-compose stop           # Detiene
docker-compose start          # ✅ Reinicia (usa este)

# Limpiar y empezar de nuevo
docker-compose down           # Elimina contenedores
docker-compose up -d          # ✅ Recrea + Inicia
```

---

### ❓ **¿Cómo sé si mis contenedores están corriendo?**

**Respuesta:**
```bash
# Ver todos los contenedores corriendo
docker ps

# Ver también los detenidos
docker ps -a

# Formato más legible
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

**Verificar un servicio específico:**
```bash
# Por nombre
docker ps --filter "name=sales-api"

# Ver logs
docker logs sales-api --tail 50

# Logs en tiempo real
docker logs -f sales-api
```

---

### ❓ **¿Cómo gestiona Ocelot Gateway el enrutamiento a los servicios en Docker?**

**Respuesta:** Ocelot usa **DNS de Docker** para comunicarse con los servicios.

#### Configuración de Ocelot para Docker

**Archivo:** `ocelot.Docker.json` o `ocelot.Development.json`

**Diferencias clave entre desarrollo local y Docker:**

| Aspecto | Desarrollo Local | Docker |
|---------|-----------------|--------|
| **Host** | `localhost` | Nombre del servicio (ej: `sales.api`) |
| **Puerto** | Variable (5001, 7001, etc.) | Siempre `8080` (puerto interno) |
| **Esquema** | `https` | `http` (HTTPS en edge) |

**Ejemplo de configuración para Docker:**

```json
{
  "Routes": [
    {
      "UpstreamPathTemplate": "/api/sales/{everything}",
      "UpstreamHttpMethod": [ "Get", "Post", "Put", "Delete" ],
      "DownstreamPathTemplate": "/api/{everything}",
      "DownstreamScheme": "http",
      "DownstreamHostAndPorts": [
        {
          "Host": "sales.api",
          "Port": 8080
        }
      ],
      "AuthenticationOptions": {
        "AuthenticationProviderKey": "Bearer"
      }
    }
  ]
}
```

**Cómo funciona:**

```
Cliente → http://localhost:5000/api/sales/products
    ↓
Ocelot Gateway (ocelot.api)
    ↓ Lee ocelot.Development.json
    ↓ Encuentra ruta: /api/sales/{everything}
    ↓ Resuelve DNS: sales.api → IP del contenedor
    ↓
http://sales.api:8080/api/products
    ↓
Contenedor sales-api responde
```

#### Archivos de Configuración Disponibles

1. **`ocelot.Development.json`** - Desarrollo local (localhost, puertos variables)
2. **`ocelot.Docker.json`** - Docker Compose (nombres de servicios, puerto 8080)
3. **`ocelot.Production.json`** - Producción (IPs/dominios reales)

**El Dockerfile copia todos los archivos:**

```dockerfile
COPY --from=build /src/src/ApiGateways/Ocelot.Api/ocelot.Development.json ./
COPY --from=build /src/src/ApiGateways/Ocelot.Api/ocelot.Docker.json ./
COPY --from=build /src/src/ApiGateways/Ocelot.Api/ocelot.Production.json ./
```

**Program.cs carga el archivo según ASPNETCORE_ENVIRONMENT:**

```csharp
builder.Configuration.AddJsonFile(
    $"ocelot.{builder.Environment.EnvironmentName}.json",
    optional: false,
    reloadOnChange: true
);
```

#### Verificar Configuración de Ocelot

```bash
# Ver qué archivo está usando
docker exec ocelot-api ls -la /app/*.json

# Ver contenido del archivo activo
docker exec ocelot-api cat /app/ocelot.Development.json

# Ver logs de Ocelot
docker logs ocelot-api | grep -i "ocelot"
```

#### Agregar un Nuevo Servicio a Ocelot

**1. Actualizar `ocelot.Docker.json` o `ocelot.Development.json`:**

```json
{
  "UpstreamPathTemplate": "/api/nuevo-servicio/{everything}",
  "UpstreamHttpMethod": [ "Get", "Post", "Put", "Delete" ],
  "DownstreamPathTemplate": "/api/{everything}",
  "DownstreamScheme": "http",
  "DownstreamHostAndPorts": [
    {
      "Host": "nuevo-servicio.api",
      "Port": 8080
    }
  ]
}
```

**2. Rebuild Ocelot:**

```bash
docker-compose build ocelot.api
docker-compose up -d ocelot.api
```

**3. Verificar:**

```bash
curl http://localhost:5000/api/nuevo-servicio/health
```

#### Troubleshooting Enrutamiento

**Problema: "503 Service Unavailable"**

```bash
# Verificar que el servicio downstream está corriendo
docker ps | grep sales-api

# Verificar logs de Ocelot
docker logs ocelot-api --tail 50

# Verificar conectividad desde Ocelot
docker exec ocelot-api ping sales.api
docker exec ocelot-api curl http://sales.api:8080/health
```

**Problema: Cambios en ocelot.json no se aplican**

```bash
# Rebuild Ocelot (los archivos .json se copian en build)
docker-compose build ocelot.api
docker-compose up -d ocelot.api

# Verificar que el archivo se actualizó
docker exec ocelot-api cat /app/ocelot.Development.json
```

---

### ❓ **Modifiqué el código. ¿Debo hacer `docker-compose up -d` de nuevo?**

**Respuesta:** **NO directamente**. Primero debes **rebuild**:

```bash
# 1. Rebuild la imagen con el código nuevo
docker-compose build sales.api

# 2. Reiniciar el contenedor con la nueva imagen
docker-compose up -d sales.api

# O ambos en un comando
docker-compose up -d --build sales.api
```

**Solo `docker-compose up -d` sin build:**
- ✅ Si la imagen ya existe → Usa la imagen vieja (sin tus cambios)
- ❌ No detecta cambios en el código automáticamente

---

### ❓ **¿Qué archivo de compose se usa cuando ejecuto `docker-compose up`?**

**Respuesta:** Depende del ambiente:

**Desarrollo (automático):**
```bash
docker-compose up -d
# Lee:
# 1. docker-compose.yml (base)
# 2. docker-compose.override.yml (auto-merge)
```

**Producción (explícito):**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
# Lee:
# 1. docker-compose.yml (base)
# 2. docker-compose.prod.yml (producción)
# NO lee docker-compose.override.yml
```

---

### ❓ **¿Puedo levantar solo algunos servicios en lugar de todos?**

**Respuesta:** **SÍ:**

```bash
# Solo Ocelot y Sales
docker-compose up -d ocelot.api sales.api

# Solo servicios de un módulo
docker-compose up -d sales.api inventory.api billing.api

# Detener servicios específicos
docker-compose stop restaurant.api vet.api
```

---

### ❓ **¿Cómo detengo todo sin perder la configuración?**

**Respuesta:**

```bash
# Detener (conserva contenedores, volúmenes, redes)
docker-compose stop

# Reiniciar después
docker-compose start

# Detener Y eliminar contenedores (conserva volúmenes)
docker-compose down

# Reiniciar después (recrea contenedores)
docker-compose up -d
```

---

### ❓ **¿Los cambios en `.env` se aplican automáticamente?**

**Respuesta:** **NO**. Debes recrear los contenedores:

```bash
# Modificaste .env
nano .env

# Recrear contenedores con nuevas variables
docker-compose up -d --force-recreate

# O más específico
docker-compose up -d --force-recreate sales.api
```

---

### ❓ **¿Cómo libero espacio en disco de Docker?**

**Respuesta:**

```bash
# Ver uso de disco
docker system df

# Limpiar contenedores detenidos, redes sin usar, imágenes dangling
docker system prune

# Limpiar TODO (⚠️ cuidado: elimina TODAS las imágenes no usadas)
docker system prune -a

# Limpiar solo imágenes viejas
docker image prune -a

# Limpiar volúmenes sin usar
docker volume prune
```

---

### ❓ **¿Cómo accedo a un contenedor para debugging?**

**Respuesta:**

```bash
# Abrir bash en el contenedor
docker exec -it sales-api /bin/bash

# O sh si bash no está disponible
docker exec -it sales-api /bin/sh

# Ejecutar un comando específico
docker exec sales-api ls -la /app

# Ver archivos de configuración
docker exec sales-api cat /app/appsettings.json
```

---

### ❓ **¿Puedo usar desarrollo con `docker-compose.prod.yml`?**

**Respuesta:** **Técnicamente SÍ, pero NO recomendado:**

```bash
# Forzar producción en local (no recomendado)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d
```

**Problemas:**
- ❌ No tienes User Secrets montados
- ❌ Logs mínimos (dificulta debugging)
- ❌ Sin puertos expuestos (solo Gateway)
- ❌ Variables de producción pueden no existir localmente

**Usa staging si quieres simular producción:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
```

---

### ❓ **¿Qué hago si un contenedor está en "Restarting" infinito?**

**Respuesta:**

```bash
# 1. Ver logs completos
docker logs sales-api --tail 100

# 2. Detener el contenedor problemático
docker-compose stop sales.api

# 3. Revisar configuración
# - Variables de entorno
# - User Secrets
# - ConnectionString

# 4. Rebuild si cambiaste código
docker-compose build sales.api

# 5. Reiniciar
docker-compose up -d sales.api

# 6. Monitorear logs
docker logs -f sales-api
```

---

**Última actualización:** Diciembre 2025
**Versión .NET:** 10.0
**Microservicios:** 14 (13 APIs + 1 Gateway)
**Ambientes:** Development (local) → Staging (QA) → Production (K8s/Swarm)
