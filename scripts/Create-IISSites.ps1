<#
.SYNOPSIS
    Creates IIS Websites for AcontPlus backend services.

.DESCRIPTION
    This script creates IIS websites for all AcontPlus backend services with sequential ports.
    Sites are ordered alphabetically with ports starting from 5000 (excluding OcelotApi).
    It validates if each site exists before attempting to create it.

.NOTES
    Author: AcontPlus Team
    Date: 2025-11-27
    Requires: Windows Server with IIS installed and PowerShell running as Administrator
#>

# Requires Administrator privileges
#Requires -RunAsAdministrator

# Import IIS modules
Import-Module WebAdministration -ErrorAction Stop

# Ensure IIS drive is available
if (-not (Get-PSDrive -Name IIS -ErrorAction SilentlyContinue)) {
    New-PSDrive -Name IIS -PSProvider WebAdministration -Root "\ " -ErrorAction SilentlyContinue | Out-Null
}

# Define the list of backend services (excluding OcelotApi)
$services = @(
    "AccountingApi",
    "BarberShopApi",
    "BillingApi",
    "CommonApi",
    "ConfigurationApi",
    "IdentityApi",
    "InventoryApi",
    "LoyaltyApi",
    "MechanicalApi",
    "PurchasesApi",
    "ReportsApi",
    "RestaurantApi",
    "SalesApi",
    "TechnicalSupportApi",
    "VetApi"
)

# Base configuration
$basePort = 5000
$basePath = "C:\Acontplus\Services"
$ipAddress = "*"  # Listen on all IP addresses

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AcontPlus IIS Website Creator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verify IIS is installed
try {
    $iisVersion = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\InetStp" -ErrorAction Stop
    Write-Host "✓ IIS Version $($iisVersion.MajorVersion).$($iisVersion.MinorVersion) detected" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ IIS is not installed on this server" -ForegroundColor Red
    exit 1
}

# Counter for tracking
$created = 0
$skipped = 0
$failed = 0
$currentPort = $basePort

# Process each service
foreach ($serviceName in $services) {
    $sitePath = Join-Path $basePath $serviceName
    $port = $currentPort
    $binding = "${ipAddress}:${port}:"

    Write-Host "Processing: $serviceName (Port: $port)" -ForegroundColor Yellow

    try {
        # Check if website already exists
        $site = Get-Website -Name $serviceName -ErrorAction SilentlyContinue

        if ($site) {
            Write-Host "  ⚠ Website already exists - skipping" -ForegroundColor DarkYellow
            Write-Host "    - Existing binding: $($site.bindings.Collection.bindingInformation)" -ForegroundColor Gray
            $skipped++
        } else {
            # Create directory if it doesn't exist
            if (-not (Test-Path $sitePath)) {
                New-Item -Path $sitePath -ItemType Directory -Force | Out-Null
                Write-Host "  ✓ Created directory: $sitePath" -ForegroundColor Green
            }

            # Check if application pool exists
            $existingPool = Get-ChildItem "IIS:\AppPools" -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq $serviceName }
            if (-not $existingPool) {
                Write-Host "  ⚠ Application pool '$serviceName' does not exist. Creating it first..." -ForegroundColor Yellow

                # Create the application pool
                New-WebAppPool -Name $serviceName | Out-Null
                & "$env:windir\system32\inetsrv\appcmd.exe" set apppool "$serviceName" /managedRuntimeVersion:"" | Out-Null
                & "$env:windir\system32\inetsrv\appcmd.exe" set apppool "$serviceName" /managedPipelineMode:Integrated | Out-Null
                & "$env:windir\system32\inetsrv\appcmd.exe" set apppool "$serviceName" /startMode:AlwaysRunning | Out-Null

                Write-Host "  ✓ Application pool created" -ForegroundColor Green
            }

            # Create the website
            New-Website -Name $serviceName `
                        -PhysicalPath $sitePath `
                        -ApplicationPool $serviceName `
                        -Port $port `
                        -IPAddress $ipAddress `
                        -Force | Out-Null

            # Set additional website properties
            Set-ItemProperty "IIS:\Sites\$serviceName" -Name "serverAutoStart" -Value $true

            Write-Host "  ✓ Website created successfully" -ForegroundColor Green
            Write-Host "    - Physical Path: $sitePath" -ForegroundColor Gray
            Write-Host "    - Port: $port" -ForegroundColor Gray
            Write-Host "    - Binding: http://$binding" -ForegroundColor Gray
            Write-Host "    - Application Pool: $serviceName" -ForegroundColor Gray
            $created++
        }
    } catch {
        Write-Host "  ✗ Failed to create website: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }

    Write-Host ""
    $currentPort++
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Services: $($services.Count)" -ForegroundColor White
Write-Host "Created: $created" -ForegroundColor Green
Write-Host "Skipped (already exists): $skipped" -ForegroundColor Yellow
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Port Range: $basePort - $($currentPort - 1)" -ForegroundColor White
Write-Host ""

# Display port mapping
Write-Host "Port Mapping:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$port = $basePort
foreach ($serviceName in $services) {
    $site = Get-Website -Name $serviceName -ErrorAction SilentlyContinue
    if ($site) {
        $status = if ($site.state -eq "Started") { "●" } else { "○" }
        Write-Host "$status Port $port - $serviceName" -ForegroundColor $(if ($site.state -eq "Started") { "Green" } else { "Yellow" })
    } else {
        Write-Host "  Port $port - $serviceName (not created)" -ForegroundColor Gray
    }
    $port++
}
Write-Host ""

# Verify firewall note
Write-Host "⚠ Important Notes:" -ForegroundColor Yellow
Write-Host "  1. Ensure ports $basePort-$($currentPort - 1) are allowed in Windows Firewall" -ForegroundColor White
Write-Host "  2. Deploy your application files to C:\Acontplus\Services\[ServiceName]" -ForegroundColor White
Write-Host "  3. OcelotApi was excluded as requested (configure separately)" -ForegroundColor White
Write-Host ""

if ($created -gt 0) {
    Write-Host "✓ Websites created successfully!" -ForegroundColor Green
} elseif ($skipped -eq $services.Count) {
    Write-Host "✓ All websites already exist!" -ForegroundColor Green
} else {
    Write-Host "⚠ Script completed with warnings or errors" -ForegroundColor Yellow
}
