# Configuración de Ocelot Gateway en AcontPlus

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Archivos de Configuración](#archivos-de-configuración)
3. [Configuración para Docker](#configuración-para-docker)
4. [Agregar Nuevas Rutas](#agregar-nuevas-rutas)
5. [Troubleshooting](#troubleshooting)
6. [Ejemplos de Configuración](#ejemplos-de-configuración)

---

## Visión General

Ocelot es el **API Gateway** que enruta todas las peticiones HTTP a los microservicios correspondientes en AcontPlus.

### Flujo de Peticiones

```
Cliente (Browser/App)
    ↓
http://localhost:5000/api/sales/products
    ↓
Ocelot Gateway (ocelot.api)
    ↓ Lee configuración de enrutamiento
    ↓ Aplica autenticación/autorización
    ↓ Aplica rate limiting
    ↓ Reescribe la ruta
    ↓
http://sales.api:8080/api/products
    ↓
Microservicio Sales responde
    ↓
Ocelot devuelve respuesta al cliente
```

### Ventajas de Usar Ocelot

- ✅ **Punto único de entrada** - Clientes solo conocen 1 URL
- ✅ **Autenticación centralizada** - JWT validado en Gateway
- ✅ **Rate limiting** - Protección contra abuso
- ✅ **Balanceo de carga** - Distribución entre instancias
- ✅ **Agregación de respuestas** - Combinar múltiples servicios
- ✅ **Logging centralizado** - Todos los requests pasan por un punto

---

## Archivos de Configuración

AcontPlus usa **3 archivos de configuración** de Ocelot:

| Archivo | Ambiente | Host Downstream | Puerto | Esquema |
|---------|----------|-----------------|--------|---------|
| `ocelot.Development.json` | Desarrollo local | `localhost` | Variable (5001, 7001...) | `https` |
| `ocelot.Docker.json` | Docker Compose | Nombre servicio (`sales.api`) | `8080` | `http` |
| `ocelot.Production.json` | Producción | IP/Dominio real | Variable | `http/https` |

### Carga Automática

El archivo se selecciona según `ASPNETCORE_ENVIRONMENT`:

```csharp
// Program.cs
builder.Configuration.AddJsonFile(
    $"ocelot.{builder.Environment.EnvironmentName}.json",
    optional: false,
    reloadOnChange: true
);
```

**Mapeo:**
- `ASPNETCORE_ENVIRONMENT=Development` → `ocelot.Development.json`
- `ASPNETCORE_ENVIRONMENT=Docker` → `ocelot.Docker.json`
- `ASPNETCORE_ENVIRONMENT=Production` → `ocelot.Production.json`

---

## Configuración para Docker

### Estructura del Archivo `ocelot.Docker.json`

```json
{
  "GlobalConfiguration": {
    "BaseUrl": "http://localhost:5000/",
    "RateLimitOptions": {
      "ClientIdHeader": "Client-Id",
      "EnableRateLimiting": true,
      "HttpStatusCode": 429,
      "Limit": 1000,
      "Period": "1s"
    }
  },
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
        "AuthenticationProviderKey": "Bearer",
        "AllowedScopes": []
      }
    }
  ]
}
```

### Explicación de Parámetros

#### GlobalConfiguration

```json
{
  "BaseUrl": "http://localhost:5000/",
  "RateLimitOptions": {
    "ClientIdHeader": "Client-Id",        // Header para identificar cliente
    "EnableRateLimiting": true,           // Activar rate limiting
    "HttpStatusCode": 429,                // Status cuando se excede límite
    "Limit": 1000,                        // Máx requests por período
    "Period": "1s",                       // Período de medición
    "QuotaExceededMessage": "Rate limit exceeded"
  },
  "RequestIdKey": "OcRequestId"           // Header para tracking de requests
}
```

#### Routes (Rutas)

```json
{
  "UpstreamPathTemplate": "/api/sales/{everything}",
  // ↑ Ruta que el cliente usa (lo que ve externamente)
  // {everything} = comodín que captura el resto de la ruta

  "UpstreamHttpMethod": [ "Get", "Post", "Put", "Delete" ],
  // ↑ Métodos HTTP permitidos en esta ruta

  "DownstreamPathTemplate": "/api/{everything}",
  // ↑ Ruta que se envía al microservicio (puede ser diferente)

  "DownstreamScheme": "http",
  // ↑ Protocolo interno (http en Docker, https en prod)

  "DownstreamHostAndPorts": [
    {
      "Host": "sales.api",
      // ↑ Nombre DNS del servicio en Docker (nombre en docker-compose.yml)

      "Port": 8080
      // ↑ Puerto interno del contenedor (todos usan 8080)
    }
  ],

  "AuthenticationOptions": {
    "AuthenticationProviderKey": "Bearer",
    // ↑ Requiere JWT Bearer token

    "AllowedScopes": []
    // ↑ Scopes requeridos (vacío = cualquier token válido)
  }
}
```

### Nombres de Host en Docker

**IMPORTANTE:** En Docker Compose, los servicios se comunican usando los **nombres definidos en `docker-compose.yml`:**

```yaml
# docker-compose.yml
services:
  sales.api:          # ← Este es el nombre DNS
    image: sales-api

  accounting.api:     # ← Este es el nombre DNS
    image: accounting-api
```

**En `ocelot.Docker.json`, usa estos nombres exactos:**

```json
{
  "Host": "sales.api",      // ✅ CORRECTO
  "Port": 8080
}

// ❌ INCORRECTO:
{
  "Host": "localhost",      // No funciona en Docker
  "Port": 5001
}
```

---

## Agregar Nuevas Rutas

### Paso 1: Definir la Ruta en ocelot.Docker.json

```json
{
  "UpstreamPathTemplate": "/api/nuevo-servicio/{everything}",
  "UpstreamHttpMethod": [ "Get", "Post", "Put", "Delete", "Options" ],
  "DownstreamPathTemplate": "/api/{everything}",
  "DownstreamScheme": "http",
  "DownstreamHostAndPorts": [
    {
      "Host": "nuevo-servicio.api",
      "Port": 8080
    }
  ],
  "AuthenticationOptions": {
    "AuthenticationProviderKey": "Bearer",
    "AllowedScopes": []
  },
  "SwaggerKey": "nuevo-servicio"
}
```

### Paso 2: Asegurar que el Servicio Existe en docker-compose.yml

```yaml
services:
  nuevo-servicio.api:
    image: nuevo-servicio-api
    build:
      context: .
      dockerfile: src/Services/NuevoServicio/NuevoServicio.Api/Dockerfile
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
```

### Paso 3: Rebuild Ocelot

```bash
# Rebuild para copiar nuevo ocelot.Docker.json
docker-compose build ocelot.api

# Reiniciar Ocelot
docker-compose up -d ocelot.api
```

### Paso 4: Verificar

```bash
# Verificar que el archivo se actualizó
docker exec ocelot-api cat /app/ocelot.Docker.json | grep nuevo-servicio

# Probar la ruta
curl http://localhost:5000/api/nuevo-servicio/health
```

---

## Ejemplos de Configuración

### Ruta Simple (Sin Autenticación)

```json
{
  "UpstreamPathTemplate": "/api/public/status",
  "UpstreamHttpMethod": [ "Get" ],
  "DownstreamPathTemplate": "/api/status",
  "DownstreamScheme": "http",
  "DownstreamHostAndPorts": [
    {
      "Host": "common.api",
      "Port": 8080
    }
  ]
}
```

**Uso:**
```bash
curl http://localhost:5000/api/public/status
# → Redirige a: http://common.api:8080/api/status
```

---

### Ruta con Autenticación JWT

```json
{
  "UpstreamPathTemplate": "/api/sales/orders/{everything}",
  "UpstreamHttpMethod": [ "Get", "Post", "Put", "Delete" ],
  "DownstreamPathTemplate": "/api/orders/{everything}",
  "DownstreamScheme": "http",
  "DownstreamHostAndPorts": [
    {
      "Host": "sales.api",
      "Port": 8080
    }
  ],
  "AuthenticationOptions": {
    "AuthenticationProviderKey": "Bearer",
    "AllowedScopes": [ "sales.read", "sales.write" ]
  }
}
```

**Uso:**
```bash
# Sin token → 401 Unauthorized
curl http://localhost:5000/api/sales/orders

# Con token válido → 200 OK
curl -H "Authorization: Bearer eyJhbGc..." http://localhost:5000/api/sales/orders
```

---

### Ruta con Rate Limiting Personalizado

```json
{
  "UpstreamPathTemplate": "/api/reports/{everything}",
  "UpstreamHttpMethod": [ "Get", "Post" ],
  "DownstreamPathTemplate": "/api/{everything}",
  "DownstreamScheme": "http",
  "DownstreamHostAndPorts": [
    {
      "Host": "reports.api",
      "Port": 8080
    }
  ],
  "RateLimitOptions": {
    "ClientWhitelist": [],
    "EnableRateLimiting": true,
    "Period": "1m",
    "Limit": 10,
    "PeriodTimespan": 60
  }
}
```

**Comportamiento:**
- Máximo 10 requests por minuto por cliente
- Cliente identificado por IP o `Client-Id` header
- Exceder límite → `429 Too Many Requests`

---

### Ruta con Balanceo de Carga

```json
{
  "UpstreamPathTemplate": "/api/sales/{everything}",
  "UpstreamHttpMethod": [ "Get", "Post" ],
  "DownstreamPathTemplate": "/api/{everything}",
  "DownstreamScheme": "http",
  "DownstreamHostAndPorts": [
    {
      "Host": "sales-api-1",
      "Port": 8080
    },
    {
      "Host": "sales-api-2",
      "Port": 8080
    },
    {
      "Host": "sales-api-3",
      "Port": 8080
    }
  ],
  "LoadBalancerOptions": {
    "Type": "RoundRobin"
  }
}
```

**Estrategias:**
- `RoundRobin` - Rotación circular
- `LeastConnection` - Menos conexiones activas
- `NoLoadBalancer` - Siempre el primero

---

### Reescritura de Ruta

```json
{
  "UpstreamPathTemplate": "/legacy/ventas/{everything}",
  "UpstreamHttpMethod": [ "Get" ],
  "DownstreamPathTemplate": "/api/sales/{everything}",
  "DownstreamScheme": "http",
  "DownstreamHostAndPorts": [
    {
      "Host": "sales.api",
      "Port": 8080
    }
  ]
}
```

**Uso:**
```bash
curl http://localhost:5000/legacy/ventas/orders
# → Redirige a: http://sales.api:8080/api/sales/orders
```

---

## Troubleshooting

### 1. Error 503 Service Unavailable

**Causa:** Ocelot no puede alcanzar el servicio downstream.

**Diagnóstico:**
```bash
# Verificar que el servicio está corriendo
docker ps | grep sales-api

# Verificar conectividad desde Ocelot
docker exec ocelot-api ping sales.api

# Intentar curl desde Ocelot
docker exec ocelot-api curl http://sales.api:8080/health
```

**Soluciones:**
- Verificar que el servicio downstream está en `docker-compose.yml`
- Verificar que el nombre en `Host` coincide con el nombre del servicio
- Verificar que el puerto es `8080` (puerto interno del contenedor)
- Iniciar el servicio: `docker-compose up -d sales.api`

---

### 2. Cambios en ocelot.json No Se Aplican

**Causa:** El archivo `.json` se copia durante el build, no en runtime.

**Solución:**
```bash
# Rebuild Ocelot para copiar el archivo actualizado
docker-compose build ocelot.api

# Reiniciar con la nueva imagen
docker-compose up -d ocelot.api

# Verificar que el archivo se actualizó
docker exec ocelot-api cat /app/ocelot.Docker.json
```

---

### 3. Error 401 Unauthorized (Token Válido)

**Causa:** JWT no está configurado correctamente en Ocelot.

**Verificar:**
```bash
# Ver logs de autenticación
docker logs ocelot-api | grep -i "authentication"

# Verificar configuración JWT en appsettings.json o variables de entorno
docker exec ocelot-api cat /app/appsettings.Development.json
```

**Solución:**
- Verificar que `JwtSettings` está configurado en `appsettings.json`
- Verificar que `AddJwtAuthentication()` se llama en `Program.cs`
- Verificar que la `SecurityKey` es la misma en Identity y Ocelot

---

### 4. Error: Cannot Find Configuration File

**Causa:** El archivo `ocelot.{Environment}.json` no existe.

**Diagnóstico:**
```bash
# Ver qué ambiente está usando
docker exec ocelot-api printenv ASPNETCORE_ENVIRONMENT

# Ver qué archivos existen
docker exec ocelot-api ls -la /app/ocelot*.json
```

**Solución:**
- Crear `ocelot.Docker.json` si falta
- O cambiar `ASPNETCORE_ENVIRONMENT` a un ambiente que tenga archivo
- O crear el archivo faltante y rebuild

---

### 5. Logs de Ocelot para Debugging

```bash
# Logs completos
docker logs ocelot-api

# Logs en tiempo real
docker logs -f ocelot-api

# Filtrar por errores
docker logs ocelot-api 2>&1 | grep -i error

# Filtrar por ruta específica
docker logs ocelot-api 2>&1 | grep -i "/api/sales"
```

---

## Configuración Recomendada por Ambiente

### Desarrollo Local (sin Docker)

**Archivo:** `ocelot.Development.json`

```json
{
  "DownstreamScheme": "https",
  "DownstreamHostAndPorts": [
    {
      "Host": "localhost",
      "Port": 7001  // Puerto específico del servicio
    }
  ]
}
```

### Docker Compose

**Archivo:** `ocelot.Docker.json`

```json
{
  "DownstreamScheme": "http",
  "DownstreamHostAndPorts": [
    {
      "Host": "sales.api",  // Nombre del servicio en docker-compose.yml
      "Port": 8080          // Siempre 8080 (puerto interno)
    }
  ]
}
```

### Producción (Kubernetes)

**Archivo:** `ocelot.Production.json`

```json
{
  "DownstreamScheme": "http",
  "DownstreamHostAndPorts": [
    {
      "Host": "sales-api-service.acontplus.svc.cluster.local",
      "Port": 80
    }
  ]
}
```

---

## Resumen de Comandos Útiles

```bash
# Ver configuración activa
docker exec ocelot-api cat /app/ocelot.Docker.json

# Ver ambiente actual
docker exec ocelot-api printenv ASPNETCORE_ENVIRONMENT

# Rebuild después de cambiar configuración
docker-compose build ocelot.api
docker-compose up -d ocelot.api

# Probar ruta
curl http://localhost:5000/api/sales/products

# Probar con autenticación
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/sales/products

# Ver logs de enrutamiento
docker logs -f ocelot-api | grep -i "downstream"
```

---

**Última actualización:** Diciembre 2025
**Versión Ocelot:** Compatible con .NET 10
**Servicios:** 13 APIs + 1 Gateway
