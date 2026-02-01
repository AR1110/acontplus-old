# PowerShell Script: Generate Production appsettings for all services
# Author: DevOps Team
# Description: Creates appsettings.Production.json for all API projects with optimized connection strings
#
# IMPORTANT: This script uses placeholders. Replace with actual values before running:
#   - SqlServerIP: Your RDS or EC2 database endpoint
#   - SqlUser/SqlPassword: From AWS Secrets Manager
#
# AWS Naming Convention: acontplus-{env}-db-main-rds
# See docs/AWS-Naming-Convention.md for full reference

param(
    [string]$SqlServerIP = "{DB_ENDPOINT}",  # e.g., acontplus-prd-db-main-rds.xxxxx.us-east-1.rds.amazonaws.com
    [string]$DatabaseName = "Acontplus",
    [string]$SqlUser = "{DB_USER}",          # Retrieve from Secrets Manager: acontplus/prd/db/main/credentials
    [string]$SqlPassword = "{DB_PASSWORD}",  # Retrieve from Secrets Manager: acontplus/prd/db/main/credentials
    [string]$SolutionRoot = "C:\Users\ifer7\source\repos\AcontPlus"
)

# Service configurations
$services = @(
    # API Gateway
    @{
        Name = "Ocelot"
        Path = "src\ApiGateways\Ocelot.Api"
        MaxPoolSize = 25
        MinPoolSize = 5
        CommandTimeout = 45
    },
    # Business APIs
    @{
        Name = "Accounting"
        Path = "src\Services\Accounting\Accounting.Api"
        MaxPoolSize = 15
        MinPoolSize = 2
        CommandTimeout = 60
    },
    @{
        Name = "Billing"
        Path = "src\Services\Billing\Billing.Api"
        MaxPoolSize = 15
        MinPoolSize = 2
        CommandTimeout = 60
    },
    @{
        Name = "Common"
        Path = "src\Services\Common\Common.Api"
        MaxPoolSize = 15
        MinPoolSize = 2
        CommandTimeout = 60
    },
    @{
        Name = "Configuration"
        Path = "src\Services\Configuration\Configuration.Api"
        MaxPoolSize = 15
        MinPoolSize = 2
        CommandTimeout = 60
    },
    @{
        Name = "Identity"
        Path = "src\Services\Identity\Identity.Api"
        MaxPoolSize = 20
        MinPoolSize = 3
        CommandTimeout = 60
    },
    @{
        Name = "Inventory"
        Path = "src\Services\Inventory\Inventory.Api"
        MaxPoolSize = 15
        MinPoolSize = 2
        CommandTimeout = 60
    },
    @{
        Name = "Purchases"
        Path = "src\Services\Purchases\Purchases.Api"
        MaxPoolSize = 15
        MinPoolSize = 2
        CommandTimeout = 60
    },
    @{
        Name = "Restaurant"
        Path = "src\Services\Restaurant\Restaurant.Api"
        MaxPoolSize = 15
        MinPoolSize = 2
        CommandTimeout = 60
    },
    @{
        Name = "Sales"
        Path = "src\Services\Sales\Sales.Api"
        MaxPoolSize = 15
        MinPoolSize = 2
        CommandTimeout = 60
    },
    @{
        Name = "BarberShop"
        Path = "src\Services\BarberShop\BarberShop.Api"
        MaxPoolSize = 15
        MinPoolSize = 2
        CommandTimeout = 60
    },
    @{
        Name = "Loyalty"
        Path = "src\Services\Loyalty\Loyalty.Api"
        MaxPoolSize = 15
        MinPoolSize = 2
        CommandTimeout = 60
    },
    @{
        Name = "Mechanical"
        Path = "src\Services\Mechanical\Mechanical.Api"
        MaxPoolSize = 15
        MinPoolSize = 2
        CommandTimeout = 60
    },
    @{
        Name = "TechnicalSupport"
        Path = "src\Services\TechnicalSupport\TechnicalSupport.Api"
        MaxPoolSize = 15
        MinPoolSize = 2
        CommandTimeout = 60
    },
    @{
        Name = "Vet"
        Path = "src\Services\Vet\Vet.Api"
        MaxPoolSize = 15
        MinPoolSize = 2
        CommandTimeout = 60
    },
    # Web UI
    @{
        Name = "WebUI"
        Path = "src\WebApps\WebUI"
        MaxPoolSize = 30
        MinPoolSize = 5
        CommandTimeout = 60
    }
)

function New-ConnectionString {
    param(
        [string]$AppName,
        [int]$MaxPoolSize,
        [int]$MinPoolSize,
        [int]$CommandTimeout
    )

    $connectionString = @"
Server=$SqlServerIP;Database=$DatabaseName;user id=$SqlUser;pwd=$SqlPassword;Encrypt=True;TrustServerCertificate=False;Pooling=true;Max Pool Size=$MaxPoolSize;Min Pool Size=$MinPoolSize;Connection Timeout=30;ConnectRetryCount=3;ConnectRetryInterval=10;Connection Lifetime=300;Command Timeout=$CommandTimeout;Application Name=AcontPlus-PRD-$AppName;Packet Size=8192;
"@
    return $connectionString.Trim()
}

function New-AppSettingsProduction {
    param(
        [string]$AppName,
        [string]$ConnectionString
    )

    $appsettings = @{
        "Logging" = @{
            "LogLevel" = @{
                "Default" = "Information"
                "Microsoft.AspNetCore" = "Warning"
                "Microsoft.EntityFrameworkCore.Database.Command" = "Warning"
            }
        }
        "AllowedHosts" = "*"
        "ConnectionStrings" = @{
            "DefaultConnection" = $ConnectionString
        }
        "Environment" = "Production"
        "Kestrel" = @{
            "Limits" = @{
                "MaxConcurrentConnections" = 200
                "MaxConcurrentUpgradedConnections" = 200
                "MaxRequestBodySize" = 10485760
            }
        }
    }

    return $appsettings | ConvertTo-Json -Depth 10
}

# Main execution
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   AcontPlus - Production appsettings Generator                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$totalConnections = 0
$filesCreated = 0
$filesSkipped = 0

foreach ($service in $services) {
    $serviceName = $service.Name
    $servicePath = Join-Path $SolutionRoot $service.Path
    $appsettingsPath = Join-Path $servicePath "appsettings.Production.json"

    Write-Host "Processing: $serviceName" -ForegroundColor Yellow
    Write-Host "  Path: $servicePath"
    Write-Host "  Max Pool Size: $($service.MaxPoolSize)"

    if (-not (Test-Path $servicePath)) {
        Write-Host "  ⚠️  Path not found, skipping..." -ForegroundColor Red
        $filesSkipped++
        continue
    }

    # Generate connection string
    $connectionString = New-ConnectionString `
        -AppName $serviceName `
        -MaxPoolSize $service.MaxPoolSize `
        -MinPoolSize $service.MinPoolSize `
        -CommandTimeout $service.CommandTimeout

    # Generate appsettings.Production.json content
    $appsettingsContent = New-AppSettingsProduction `
        -AppName $serviceName `
        -ConnectionString $connectionString

    # Check if file exists
    if (Test-Path $appsettingsPath) {
        Write-Host "  ℹ️  File exists, creating backup..." -ForegroundColor Cyan
        $backupPath = $appsettingsPath + ".backup." + (Get-Date -Format "yyyyMMdd_HHmmss")
        Copy-Item $appsettingsPath $backupPath
        Write-Host "  ✅ Backup created: $backupPath" -ForegroundColor Green
    }

    # Write file
    Set-Content -Path $appsettingsPath -Value $appsettingsContent -Encoding UTF8
    Write-Host "  ✅ Created: appsettings.Production.json" -ForegroundColor Green

    $totalConnections += $service.MaxPoolSize
    $filesCreated++
    Write-Host ""
}

# Summary
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                          SUMMARY                               ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Files Created: $filesCreated" -ForegroundColor Green
Write-Host "Files Skipped: $filesSkipped" -ForegroundColor Yellow
Write-Host "Total Max Connections: $totalConnections" -ForegroundColor Cyan
Write-Host ""
Write-Host "Connection String Parameters:" -ForegroundColor White
Write-Host "  SQL Server: $SqlServerIP"
Write-Host "  Database: $DatabaseName"
Write-Host "  Encrypt: True"
Write-Host "  Connection Timeout: 30s"
Write-Host "  Command Timeout: 60s (most services)"
Write-Host "  Connection Lifetime: 300s (5 minutes)"
Write-Host "  Packet Size: 8192 (8KB)"
Write-Host ""

if ($totalConnections -gt 400) {
    Write-Host "⚠️  WARNING: Total connections ($totalConnections) exceeds recommended limit (400)" -ForegroundColor Red
    Write-Host "   Consider reducing Max Pool Size per service" -ForegroundColor Yellow
} elseif ($totalConnections -gt 350) {
    Write-Host "⚠️  NOTICE: Total connections ($totalConnections) is high" -ForegroundColor Yellow
    Write-Host "   Monitor SQL Server performance closely" -ForegroundColor Yellow
} else {
    Write-Host "✅ Total connections ($totalConnections) is within optimal range" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Review generated appsettings.Production.json files"
Write-Host "2. Commit changes to Git"
Write-Host "3. Deploy to production"
Write-Host "4. Monitor connection pool usage with provided SQL queries"
Write-Host ""
Write-Host "Done! 🚀" -ForegroundColor Green
