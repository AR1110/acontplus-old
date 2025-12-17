# Configuraciones de Connection String por Ambiente

## 📋 Resumen de Configuraciones

Este documento explica las configuraciones optimizadas para cada ambiente de AcontPlus.

---

## 🏠 **Local Development** (Localhost SQL Server)

### Escenario
- SQL Server instalado localmente en la máquina del desarrollador
- 1 desarrollador trabajando en 1-3 servicios simultáneamente
- Sin restricciones de red

### Connection String
```
Server=.;
Database=Acontplus;
user id=sa;
pwd=1844;
Trusted_Connection=False;
TrustServerCertificate=True;
Pooling=true;
Max Pool Size=50;
Min Pool Size=5;
Connection Timeout=30;
ConnectRetryCount=2;
ConnectRetryInterval=5;
Connection Lifetime=0;
Command Timeout=60;
Application Name=AcontPlus-LocalDev-{AppName};
Packet Size=8192;
```

### Parámetros Explicados

| Parámetro | Valor | Razón |
|-----------|-------|-------|
| **Server** | `.` | Localhost (SQL Server local) |
| **Encrypt** | No configurado | No necesario (localhost sin red) |
| **TrustServerCertificate** | True | Desarrollo local sin certificados |
| **Max Pool Size** | 50 | Suficiente para 1-3 servicios en debug |
| **Min Pool Size** | 5 | Pool pequeño (poco tráfico) |
| **ConnectRetryCount** | 2 | Menos reintentos (fallo rápido en dev) |
| **ConnectRetryInterval** | 5 | Intervalo corto (5s) |
| **Connection Lifetime** | 0 | No reciclar (conexión estable local) |
| **Command Timeout** | 60 | Timeout estándar |
| **Application Name** | LocalDev-{AppName} | Identificar en SQL Profiler |

### Uso de Recursos Esperado
```
Conexiones activas:  5-15
Memoria pool:        ~1 MB
CPU overhead:        <1%
```

---

## ☁️ **AWS Development** (SQL Server Remoto: 18.222.175.220)

### Escenario
- SQL Server en AWS (ambiente compartido de desarrollo)
- Múltiples desarrolladores (hasta 10) trabajando simultáneamente
- Red pública (requiere encriptación)
- Latencia de red: 10-50ms

### Connection String
```
Server=18.222.175.220;
Database=Acontplus;
user id=sa;
pwd=Acontplus.c0m;
Encrypt=True;
TrustServerCertificate=False;
Pooling=true;
Max Pool Size=20;
Min Pool Size=3;
Connection Timeout=30;
ConnectRetryCount=3;
ConnectRetryInterval=10;
Connection Lifetime=300;
Command Timeout=60;
Application Name=AcontPlus-Dev-{AppName};
Packet Size=8192;
```

### Parámetros Explicados

| Parámetro | Valor | Razón |
|-----------|-------|-------|
| **Server** | 18.222.175.220 | IP pública SQL Server AWS Dev |
| **Encrypt** | **True** | ⚠️ OBLIGATORIO (red pública AWS) |
| **TrustServerCertificate** | **False** | Validar certificado SSL en AWS |
| **Max Pool Size** | 20 | 10 devs × 2 servicios promedio |
| **Min Pool Size** | 3 | Pool mínimo para respuesta rápida |
| **ConnectRetryCount** | 3 | Reintentos por latencia de red |
| **ConnectRetryInterval** | 10 | Espera 10s entre reintentos |
| **Connection Lifetime** | 300s | Reciclar cada 5 min (AWS load balancing) |
| **Command Timeout** | 60 | Timeout estándar |
| **Application Name** | Dev-{AppName} | Identificar desarrolladores en SQL |

### Uso de Recursos Esperado
```
Conexiones activas:  10-40 (10 devs)
Memoria pool:        ~3-8 MB
CPU overhead:        ~2-5% (por encriptación)
Network bandwidth:   ~2-5 Mbps
```

### Cálculo de Conexiones
```
10 desarrolladores × 2 servicios promedio × 2 conexiones = 40 conexiones máximo
Max Pool Size=20 por servicio × 2 servicios = 40 conexiones total ✅
```

---

## 🧪 **Staging** (SQL Server Remoto: ngrok tunnel)

### Escenario
- SQL Server accesible via túnel ngrok (0.tcp.sa.ngrok.io:12455)
- Testing de integración y QA
- Ambiente pre-producción
- Latencia variable (túnel ngrok)

### Connection String
```
Server=0.tcp.sa.ngrok.io,12455;
Database=Acontplus;
user id=sa;
pwd=1844;
Encrypt=True;
TrustServerCertificate=True;
Pooling=true;
Max Pool Size=20;
Min Pool Size=3;
Connection Timeout=35;
ConnectRetryCount=3;
ConnectRetryInterval=10;
Connection Lifetime=300;
Command Timeout=75;
Application Name=AcontPlus-Staging-{AppName};
Packet Size=8192;
```

### Parámetros Explicados

| Parámetro | Valor | Razón |
|-----------|-------|-------|
| **Server** | 0.tcp.sa.ngrok.io,12455 | Túnel ngrok con puerto |
| **Encrypt** | True | Encriptación sobre túnel |
| **TrustServerCertificate** | **True** | Aceptar cert ngrok (no oficial) |
| **Max Pool Size** | 20 | Similar a Dev (testing/QA) |
| **Min Pool Size** | 3 | Pool mínimo |
| **Connection Timeout** | **35** | +5s por latencia ngrok |
| **ConnectRetryCount** | 3 | Reintentos por inestabilidad túnel |
| **ConnectRetryInterval** | 10 | Espera 10s |
| **Connection Lifetime** | 300s | Reciclar (túnel puede cambiar IP) |
| **Command Timeout** | **75** | +15s para queries lentas en testing |
| **Application Name** | Staging-{AppName} | Identificar ambiente staging |

### Uso de Recursos Esperado
```
Conexiones activas:  5-30 (QA team + automated tests)
Memoria pool:        ~2-6 MB
CPU overhead:        ~3-6% (encriptación + túnel)
Network bandwidth:   Variable (ngrok throttling)
```

### Consideraciones Especiales
⚠️ **ngrok Limitations:**
- Bandwidth limitado en plan free (~1 GB/mes)
- Latencia variable (50-200ms)
- Conexiones pueden caerse si túnel se reinicia

---

## 🚀 **Production** (SQL Server AWS: 54.211.156.95)

### Escenario
- SQL Server dedicado en AWS (r7i.xlarge o similar)
- **20 aplicaciones .NET 10** en servidor r7i.xlarge (4 vCPU, 32GB RAM)
- Alto tráfico (cientos de usuarios concurrentes)
- Red privada AWS (VPC peering o misma VPC)
- Latencia ultra-baja: 1-5ms

### Connection String
```
Server=54.211.156.95;
Database=Acontplus;
user id=sa;
pwd=Acontplus.c0m;
Encrypt=True;
TrustServerCertificate=False;
Pooling=true;
Max Pool Size=15;
Min Pool Size=2;
Connection Timeout=30;
ConnectRetryCount=3;
ConnectRetryInterval=10;
Connection Lifetime=300;
Command Timeout=60;
Application Name=AcontPlus-PRD-{AppName};
Packet Size=8192;
```

### Parámetros Explicados

| Parámetro | Valor | Razón |
|-----------|-------|-------|
| **Server** | 54.211.156.95 | IP privada/pública SQL Server PRD |
| **Encrypt** | **True** | Seguridad en red AWS |
| **TrustServerCertificate** | **False** | Validar certificado oficial |
| **Max Pool Size** | **15** | 20 apps × 15 = 300 total (óptimo) |
| **Min Pool Size** | **2** | Pool mínimo (eficiencia memoria) |
| **Connection Timeout** | 30 | Timeout estándar (red rápida) |
| **ConnectRetryCount** | 3 | Reintentos por fallos transitorios |
| **ConnectRetryInterval** | 10 | Espera 10s (tolerancia picos) |
| **Connection Lifetime** | **300s** | Reciclar cada 5 min (AWS best practice) |
| **Command Timeout** | 60 | Timeout producción |
| **Application Name** | **PRD-{AppName}** | ⚠️ CRÍTICO para monitoreo |

### Uso de Recursos Esperado

#### **Por Aplicación (1 de 20):**
```
Max Connections:     15
Min Connections:     2
Avg Active Conns:    5-8
Memoria pool:        ~1.2 MB
CPU overhead:        ~1-2%
```

#### **Total (20 Aplicaciones):**
```
Total Max Connections:  300 (20 × 15)
Total Avg Active:       100-160
Total Memoria pools:    ~24 MB
Total CPU overhead:     ~3-5%
Network bandwidth:      ~10-20 Mbps
```

### Distribución por Tipo de Aplicación

#### **API Gateway (Ocelot.Api)** - 1 instancia
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=54.211.156.95;...;Max Pool Size=25;Min Pool Size=5;...;Application Name=AcontPlus-PRD-Ocelot;"
}
```
**Razón:** Ocelot recibe TODAS las requests, necesita más conexiones.

---

#### **APIs de Negocio** - 13 instancias
```
- Accounting.Api
- Billing.Api
- Common.Api
- Configuration.Api
- Identity.Api
- Inventory.Api
- Purchases.Api
- Restaurant.Api
- Sales.Api
- BarberShop.Api
- Loyalty.Api
- Mechanical.Api
- TechnicalSupport.Api
- Vet.Api (total: 14, pero Ocelot cuenta aparte)
```

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=54.211.156.95;...;Max Pool Size=15;Min Pool Size=2;...;Application Name=AcontPlus-PRD-Sales;"
}
```

**Distribución de Conexiones:**
```
13 APIs × 15 conexiones = 195 conexiones
Uso promedio: 13 × 6 = 78 conexiones activas
```

---

#### **WebUI (Razor Pages)** - 1 instancia
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=54.211.156.95;...;Max Pool Size=30;Min Pool Size=5;...;Application Name=AcontPlus-PRD-WebUI;"
}
```
**Razón:** WebUI atiende usuarios directamente, alto tráfico.

---

### Cálculo Total de Conexiones

```
┌─────────────────────────┬──────────┬─────────┬──────────┐
│ Aplicación              │ Max Pool │ Avg Use │ Instancia│
├─────────────────────────┼──────────┼─────────┼──────────┤
│ Ocelot (Gateway)        │    25    │   12    │    1     │
│ 13 APIs                 │    15    │    6    │   13     │
│ WebUI (Razor Pages)     │    30    │   15    │    1     │
│ 5 Background Workers*   │    20    │    8    │    5     │
├─────────────────────────┼──────────┼─────────┼──────────┤
│ TOTAL                   │   355**  │  ~160   │   20     │
└─────────────────────────┴──────────┴─────────┴──────────┘

* Workers no listados en proyectos visibles
** 25 + (13×15) + 30 + (5×20) = 355 máximo
```

### SQL Server - Configuración Recomendada

```sql
-- Configurar SQL Server para manejar 355 conexiones máximo
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;

-- Max User Connections (0 = ilimitado, pero controlar con pool)
EXEC sp_configure 'user connections', 500;  -- Buffer de seguridad
RECONFIGURE;

-- Max Worker Threads
EXEC sp_configure 'max worker threads', 512;  -- Suficiente para 355 conexiones
RECONFIGURE;
```

---

## 🔍 **Monitoreo por Ambiente**

### Query SQL para ver conexiones activas

```sql
-- Ver conexiones por ambiente
SELECT 
    CASE 
        WHEN program_name LIKE '%LocalDev%' THEN 'Local Development'
        WHEN program_name LIKE '%Dev-%' THEN 'AWS Development'
        WHEN program_name LIKE '%Staging%' THEN 'Staging'
        WHEN program_name LIKE '%PRD-%' THEN 'Production'
        ELSE 'Unknown'
    END AS Environment,
    REPLACE(REPLACE(program_name, 'AcontPlus-PRD-', ''), 'AcontPlus-Dev-', '') AS AppName,
    COUNT(*) AS ActiveConnections,
    AVG(cpu_time) AS AvgCPU_ms,
    AVG(memory_usage * 8) AS AvgMemory_KB,
    MAX(last_request_start_time) AS LastActivity
FROM sys.dm_exec_sessions
WHERE program_name LIKE 'AcontPlus-%'
    AND is_user_process = 1
GROUP BY 
    CASE 
        WHEN program_name LIKE '%LocalDev%' THEN 'Local Development'
        WHEN program_name LIKE '%Dev-%' THEN 'AWS Development'
        WHEN program_name LIKE '%Staging%' THEN 'Staging'
        WHEN program_name LIKE '%PRD-%' THEN 'Production'
        ELSE 'Unknown'
    END,
    REPLACE(REPLACE(program_name, 'AcontPlus-PRD-', ''), 'AcontPlus-Dev-', '')
ORDER BY Environment, ActiveConnections DESC;
```

### Alertas Recomendadas por Ambiente

#### **Production**
```sql
-- Alerta: Conexiones > 280 (80% del máximo 355)
IF (SELECT COUNT(*) FROM sys.dm_exec_sessions 
    WHERE program_name LIKE 'AcontPlus-PRD-%') > 280
BEGIN
    -- Enviar alerta crítica
    RAISERROR('Production connection pool near exhaustion', 16, 1);
END
```

#### **Staging**
```sql
-- Alerta: Conexiones > 150
IF (SELECT COUNT(*) FROM sys.dm_exec_sessions 
    WHERE program_name LIKE 'AcontPlus-Staging-%') > 150
BEGIN
    -- Enviar alerta warning
    PRINT 'Staging connection pool high usage';
END
```

---

## 📊 **Comparativa de Ambientes**

| Métrica | Local Dev | AWS Dev | Staging | Production |
|---------|-----------|---------|---------|------------|
| **Max Pool/App** | 50 | 20 | 20 | 15-30 |
| **Total Apps** | 1-3 | ~20 | ~10 | 20 |
| **Total Conexiones** | 50-150 | ~400 | ~200 | ~355 |
| **Encrypt** | No | **Sí** | **Sí** | **Sí** |
| **Latencia Esperada** | <1ms | 10-50ms | 50-200ms | 1-5ms |
| **Memoria Pool** | ~1 MB | ~8 MB | ~4 MB | ~25 MB |
| **CPU Overhead** | <1% | 2-5% | 3-6% | 3-5% |
| **Recicla Conexiones** | No | Sí (5 min) | Sí (5 min) | Sí (5 min) |

---

## 🎯 **Próximos Pasos**

### 1. **Actualizar appsettings.{Environment}.json**

Crear archivos específicos para cada servicio:

```
src/Services/Sales/Sales.Api/appsettings.Production.json
src/Services/Inventory/Inventory.Api/appsettings.Production.json
... (y así para cada servicio)
```

### 2. **Reemplazar {AppName} con nombre real**

Ejemplo para Sales.Api:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=54.211.156.95;...;Application Name=AcontPlus-PRD-Sales;..."
  }
}
```

### 3. **Configurar Health Checks**

Agregar en cada `Program.cs`:

```csharp
builder.Services.AddHealthChecks()
    .AddSqlServer(
        connectionString: builder.Configuration.GetConnectionString("DefaultConnection")!,
        healthQuery: "SELECT 1",
        name: "sql-server",
        timeout: TimeSpan.FromSeconds(10)
    );
```

### 4. **Monitoreo CloudWatch (Production)**

```sh
# Instalar CloudWatch Agent en r7i.xlarge
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

---

## ✅ **Checklist de Migración**

- [ ] Actualizar `sharedsettings.Development.json` (✅ HECHO)
- [ ] Crear `appsettings.Production.json` para cada servicio
- [ ] Reemplazar `{AppName}` con nombres reales
- [ ] Configurar SQL Server (user connections, worker threads)
- [ ] Implementar health checks
- [ ] Configurar alertas CloudWatch
- [ ] Testing de carga (300+ conexiones concurrentes)
- [ ] Documentar Application Names en wiki del equipo

---

**Última Actualización:** Diciembre 2025  
**Versión:** 2.0  
**Mantenido por:** Equipo DevOps AcontPlus
