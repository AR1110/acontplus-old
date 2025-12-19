# Docker Compose Profile Scripts for AcontPlus
# Usage: .\scripts\docker-profiles.ps1 -Profile <ProfileName> -Action <build|up|restart|down|logs>
#
# Examples:
#   .\scripts\docker-profiles.ps1 -Profile Core -Action build
#   .\scripts\docker-profiles.ps1 -Profile Sales -Action up
#   .\scripts\docker-profiles.ps1 -Profile All -Action restart

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('Core', 'Sales', 'Inventory', 'Restaurant', 'Automotive', 'Services', 'Financial', 'All', 'Gateway')]
    [string]$Profile,

    [Parameter(Mandatory=$true)]
    [ValidateSet('build', 'up', 'restart', 'down', 'logs', 'stop', 'start')]
    [string]$Action,

    [Parameter(Mandatory=$false)]
    [switch]$Parallel,

    [Parameter(Mandatory=$false)]
    [switch]$NoBuild,

    [Parameter(Mandatory=$false)]
    [switch]$Follow
)

# Definición de perfiles con servicios agrupados por dominio/funcionalidad
$Profiles = @{
    # Gateway + Servicios de infraestructura
    'Core' = @(
        'ocelot.api',
        'identity.api',
        'configuration.api',
        'common.api'
    )

    # Módulo de ventas y facturación
    'Sales' = @(
        'ocelot.api',
        'sales.api',
        'billing.api',
        'inventory.api'
    )

    # Módulo de inventario y compras
    'Inventory' = @(
        'ocelot.api',
        'inventory.api',
        'purchases.api',
        'accounting.api'
    )

    # Módulo financiero/contable
    'Financial' = @(
        'ocelot.api',
        'accounting.api',
        'billing.api',
        'purchases.api'
    )

    # Módulo de restaurante
    'Restaurant' = @(
        'ocelot.api',
        'restaurant.api',
        'sales.api',
        'inventory.api'
    )

    # Módulo automotriz (mecánico + veterinario)
    'Automotive' = @(
        'ocelot.api',
        'mechanical.api',
        'vet.api',
        'technicalsupport.api'
    )

    # Módulo de servicios (barbería + soporte técnico)
    'Services' = @(
        'ocelot.api',
        'barbershop.api',
        'technicalsupport.api'
    )

    # Solo Gateway
    'Gateway' = @(
        'ocelot.api'
    )

    # Todos los servicios
    'All' = @(
        'ocelot.api',
        'accounting.api',
        'sales.api',
        'billing.api',
        'inventory.api',
        'purchases.api',
        'restaurant.api',
        'vet.api',
        'mechanical.api',
        'barbershop.api',
        'technicalsupport.api',
        'common.api',
        'identity.api',
        'configuration.api'
    )
}

# Obtener servicios del perfil seleccionado
$Services = $Profiles[$Profile]

if (-not $Services) {
    Write-Error "Perfil '$Profile' no encontrado."
    exit 1
}

# Cambiar al directorio raíz del proyecto
$RootPath = Split-Path -Parent $PSScriptRoot
Set-Location $RootPath

# Construir comando
$ServicesString = $Services -join ' '

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " AcontPlus Docker Profile: $Profile" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Servicios:" -ForegroundColor Green
$Services | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }
Write-Host ""
Write-Host "Acción: $Action" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

switch ($Action) {
    'build' {
        $Command = "docker-compose build"
        if ($Parallel) {
            $Command += " --parallel"
        }
        $Command += " $ServicesString"
        
        Write-Host "Ejecutando: $Command" -ForegroundColor Yellow
        Invoke-Expression $Command
    }

    'up' {
        $Command = "docker-compose up -d"
        if (-not $NoBuild) {
            $Command += " --build"
        }
        $Command += " $ServicesString"
        
        Write-Host "Ejecutando: $Command" -ForegroundColor Yellow
        Invoke-Expression $Command
        
        Write-Host ""
        Write-Host "Verificando estado..." -ForegroundColor Cyan
        Start-Sleep -Seconds 2
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=ocelot|accounting|sales|billing|inventory|purchases|restaurant|vet|mechanical|barbershop|technicalsupport|common|identity|configuration"
    }

    'restart' {
        Write-Host "Deteniendo servicios..." -ForegroundColor Yellow
        Invoke-Expression "docker-compose stop $ServicesString"
        
        Write-Host "Iniciando servicios..." -ForegroundColor Yellow
        Invoke-Expression "docker-compose start $ServicesString"
        
        Write-Host ""
        Write-Host "Verificando estado..." -ForegroundColor Cyan
        Start-Sleep -Seconds 2
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=ocelot|accounting|sales|billing|inventory|purchases|restaurant|vet|mechanical|barbershop|technicalsupport|common|identity|configuration"
    }

    'down' {
        $Command = "docker-compose stop $ServicesString"
        Write-Host "Ejecutando: $Command" -ForegroundColor Yellow
        Invoke-Expression $Command
        
        Write-Host ""
        Write-Host "Servicios detenidos." -ForegroundColor Green
    }

    'stop' {
        $Command = "docker-compose stop $ServicesString"
        Write-Host "Ejecutando: $Command" -ForegroundColor Yellow
        Invoke-Expression $Command
    }

    'start' {
        $Command = "docker-compose start $ServicesString"
        Write-Host "Ejecutando: $Command" -ForegroundColor Yellow
        Invoke-Expression $Command
        
        Write-Host ""
        Start-Sleep -Seconds 2
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=ocelot|accounting|sales|billing|inventory|purchases|restaurant|vet|mechanical|barbershop|technicalsupport|common|identity|configuration"
    }

    'logs' {
        if ($Follow) {
            $Command = "docker-compose logs -f $ServicesString"
        } else {
            $Command = "docker-compose logs --tail=100 $ServicesString"
        }
        
        Write-Host "Ejecutando: $Command" -ForegroundColor Yellow
        Write-Host ""
        Invoke-Expression $Command
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " Operación completada" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
