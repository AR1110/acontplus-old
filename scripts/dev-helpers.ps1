# AcontPlus Development Helper - Atajos diarios
# Alias y funciones para desarrollo rápido con Docker

# ═══════════════════════════════════════════════════════════
# Funciones de Perfiles
# ═══════════════════════════════════════════════════════════

function Start-AcontCore {
    <#
    .SYNOPSIS
    Inicia servicios Core (infraestructura básica)
    #>
    Write-Host "Iniciando servicios Core..." -ForegroundColor Green
    & "$PSScriptRoot\quick-start.ps1" -Profile Core
}

function Start-AcontSales {
    <#
    .SYNOPSIS
    Inicia módulo de Ventas
    #>
    Write-Host "Iniciando módulo Sales..." -ForegroundColor Green
    & "$PSScriptRoot\quick-start.ps1" -Profile Sales
}

function Start-AcontRestaurant {
    <#
    .SYNOPSIS
    Inicia módulo de Restaurante
    #>
    Write-Host "Iniciando módulo Restaurant..." -ForegroundColor Green
    & "$PSScriptRoot\quick-start.ps1" -Profile Restaurant
}

function Start-AcontInventory {
    <#
    .SYNOPSIS
    Inicia módulo de Inventario
    #>
    Write-Host "Iniciando módulo Inventory..." -ForegroundColor Green
    & "$PSScriptRoot\quick-start.ps1" -Profile Inventory
}

# ═══════════════════════════════════════════════════════════
# Funciones de Gestión Rápida
# ═══════════════════════════════════════════════════════════

function Get-AcontStatus {
    <#
    .SYNOPSIS
    Muestra el estado de todos los contenedores
    #>
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=ocelot|accounting|sales|billing|inventory|purchases|restaurant|vet|mechanical|barbershop|technicalsupport|common|identity|configuration"
}

function Stop-AcontAll {
    <#
    .SYNOPSIS
    Detiene todos los servicios
    #>
    Write-Host "Deteniendo todos los servicios AcontPlus..." -ForegroundColor Yellow
    docker-compose stop
}

function Restart-AcontService {
    <#
    .SYNOPSIS
    Reinicia un servicio específico

    .PARAMETER ServiceName
    Nombre del servicio (ej: sales.api, restaurant.api)

    .EXAMPLE
    Restart-AcontService -ServiceName sales.api
    #>
    param(
        [Parameter(Mandatory=$true)]
        [string]$ServiceName
    )

    Write-Host "Reiniciando $ServiceName..." -ForegroundColor Yellow
    docker-compose restart $ServiceName

    Start-Sleep -Seconds 2
    docker logs $ServiceName --tail 50
}

function Watch-AcontLogs {
    <#
    .SYNOPSIS
    Ver logs en tiempo real de un servicio

    .PARAMETER ServiceName
    Nombre del servicio

    .EXAMPLE
    Watch-AcontLogs -ServiceName sales.api
    #>
    param(
        [Parameter(Mandatory=$true)]
        [string]$ServiceName
    )

    docker logs -f $ServiceName
}

function Rebuild-AcontService {
    <#
    .SYNOPSIS
    Rebuild y reinicia un servicio (después de cambiar código)

    .PARAMETER ServiceName
    Nombre del servicio

    .EXAMPLE
    Rebuild-AcontService -ServiceName sales.api
    #>
    param(
        [Parameter(Mandatory=$true)]
        [string]$ServiceName
    )

    Write-Host "Rebuilding $ServiceName..." -ForegroundColor Green
    docker-compose build $ServiceName

    Write-Host "Reiniciando $ServiceName..." -ForegroundColor Green
    docker-compose up -d $ServiceName

    Start-Sleep -Seconds 3
    docker logs $ServiceName --tail 50
}

# ═══════════════════════════════════════════════════════════
# Aliases Cortos
# ═══════════════════════════════════════════════════════════

Set-Alias -Name acont-status -Value Get-AcontStatus
Set-Alias -Name acont-stop -Value Stop-AcontAll
Set-Alias -Name acont-core -Value Start-AcontCore
Set-Alias -Name acont-sales -Value Start-AcontSales
Set-Alias -Name acont-restaurant -Value Start-AcontRestaurant

# ═══════════════════════════════════════════════════════════
# Mensaje de Ayuda
# ═══════════════════════════════════════════════════════════

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " AcontPlus Development Helpers Loaded" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Funciones Disponibles:" -ForegroundColor Yellow
Write-Host "  Start-AcontCore           # Iniciar infraestructura básica" -ForegroundColor White
Write-Host "  Start-AcontSales          # Iniciar módulo de ventas" -ForegroundColor White
Write-Host "  Start-AcontRestaurant     # Iniciar módulo de restaurante" -ForegroundColor White
Write-Host "  Start-AcontInventory      # Iniciar módulo de inventario" -ForegroundColor White
Write-Host ""
Write-Host "  Get-AcontStatus           # Ver estado de servicios" -ForegroundColor White
Write-Host "  Stop-AcontAll             # Detener todos los servicios" -ForegroundColor White
Write-Host "  Restart-AcontService      # Reiniciar un servicio" -ForegroundColor White
Write-Host "  Watch-AcontLogs           # Ver logs en tiempo real" -ForegroundColor White
Write-Host "  Rebuild-AcontService      # Rebuild + Restart un servicio" -ForegroundColor White
Write-Host ""
Write-Host "Aliases Cortos:" -ForegroundColor Yellow
Write-Host "  acont-status              # Ver estado" -ForegroundColor White
Write-Host "  acont-stop                # Detener todo" -ForegroundColor White
Write-Host "  acont-core                # Iniciar Core" -ForegroundColor White
Write-Host "  acont-sales               # Iniciar Sales" -ForegroundColor White
Write-Host "  acont-restaurant          # Iniciar Restaurant" -ForegroundColor White
Write-Host ""
Write-Host "Ejemplos de Uso:" -ForegroundColor Yellow
Write-Host "  acont-core" -ForegroundColor Cyan
Write-Host "  acont-status" -ForegroundColor Cyan
Write-Host "  Rebuild-AcontService sales.api" -ForegroundColor Cyan
Write-Host "  Watch-AcontLogs restaurant.api" -ForegroundColor Cyan
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
