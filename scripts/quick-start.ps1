# Quick Start Scripts - Atajos para perfiles comunes
# Uso rápido sin parámetros

param(
    [Parameter(Mandatory=$false)]
    [string]$Profile = "Core"
)

$RootPath = Split-Path -Parent $PSScriptRoot
$ProfileScript = Join-Path $RootPath "scripts\docker-profiles.ps1"

Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  AcontPlus Quick Start - Perfil: $Profile" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Build paralelo + Up
Write-Host "[1/2] Construyendo imágenes en paralelo..." -ForegroundColor Green
& $ProfileScript -Profile $Profile -Action build -Parallel

Write-Host ""
Write-Host "[2/2] Iniciando servicios..." -ForegroundColor Green
& $ProfileScript -Profile $Profile -Action up -NoBuild

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✓ Servicios iniciados" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Accede al Gateway en: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comandos útiles:" -ForegroundColor Yellow
Write-Host "  Ver logs: .\scripts\docker-profiles.ps1 -Profile $Profile -Action logs -Follow" -ForegroundColor White
Write-Host "  Detener:  .\scripts\docker-profiles.ps1 -Profile $Profile -Action stop" -ForegroundColor White
Write-Host "  Restart:  .\scripts\docker-profiles.ps1 -Profile $Profile -Action restart" -ForegroundColor White
Write-Host ""
