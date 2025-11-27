<#
.SYNOPSIS
    Creates IIS Application Pools for AcontPlus backend services.

.DESCRIPTION
    This script creates unmanaged (No Managed Code) application pools in IIS for all AcontPlus backend services.
    It validates if each pool exists before attempting to create it.

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

# Define the list of backend services
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
    "OcelotApi",
    "PurchasesApi",
    "RestaurantApi",
    "SalesApi",
    "TechnicalSupportApi",
    "VetApi"
)

# Configuration for application pools
$poolConfig = @{
    ManagedRuntimeVersion = ""  # Empty string = "No Managed Code"
    ManagedPipelineMode   = "Integrated"
    StartMode             = "AlwaysRunning"
    ProcessModelIdentityType = "ApplicationPoolIdentity"
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AcontPlus IIS Application Pool Creator" -ForegroundColor Cyan
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

# Process each service
foreach ($serviceName in $services) {
    Write-Host "Processing: $serviceName" -ForegroundColor Yellow

    try {
        # Check if application pool already exists
        $existingPool = Get-ChildItem "IIS:\AppPools" | Where-Object { $_.Name -eq $serviceName }

        if ($existingPool) {
            Write-Host "  ⚠ Application pool already exists - skipping" -ForegroundColor DarkYellow
            $skipped++
        } else {
            # Create the application pool
            $pool = New-WebAppPool -Name $serviceName

            # Configure using appcmd for reliable property setting
            & "$env:windir\system32\inetsrv\appcmd.exe" set apppool "$serviceName" /managedRuntimeVersion:"" | Out-Null
            & "$env:windir\system32\inetsrv\appcmd.exe" set apppool "$serviceName" /managedPipelineMode:Integrated | Out-Null
            & "$env:windir\system32\inetsrv\appcmd.exe" set apppool "$serviceName" /startMode:AlwaysRunning | Out-Null
            & "$env:windir\system32\inetsrv\appcmd.exe" set apppool "$serviceName" /processModel.identityType:ApplicationPoolIdentity | Out-Null
            & "$env:windir\system32\inetsrv\appcmd.exe" set apppool "$serviceName" /processModel.idleTimeout:00:00:00 | Out-Null
            & "$env:windir\system32\inetsrv\appcmd.exe" set apppool "$serviceName" /recycling.periodicRestart.time:1.05:00:00 | Out-Null

            Write-Host "  ✓ Application pool created successfully" -ForegroundColor Green
            Write-Host "    - Runtime: No Managed Code" -ForegroundColor Gray
            Write-Host "    - Pipeline: Integrated" -ForegroundColor Gray
            Write-Host "    - Start Mode: AlwaysRunning" -ForegroundColor Gray
            Write-Host "    - Identity: ApplicationPoolIdentity" -ForegroundColor Gray
            $created++
        }
    } catch {
        Write-Host "  ✗ Failed to create application pool: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }

    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Services: $($services.Count)" -ForegroundColor White
Write-Host "Created: $created" -ForegroundColor Green
Write-Host "Skipped (already exists): $skipped" -ForegroundColor Yellow
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host ""

# Verify all pools
Write-Host "Verifying application pools..." -ForegroundColor Cyan
$allPools = Get-ChildItem "IIS:\AppPools" | Where-Object { $services -contains $_.Name }
Write-Host "Total AcontPlus pools found: $($allPools.Count)" -ForegroundColor White
Write-Host ""

if ($created -gt 0) {
    Write-Host "✓ Application pools created successfully!" -ForegroundColor Green
} elseif ($skipped -eq $services.Count) {
    Write-Host "✓ All application pools already exist!" -ForegroundColor Green
} else {
    Write-Host "⚠ Script completed with warnings or errors" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Note: Remember to configure your IIS websites to use these application pools." -ForegroundColor Cyan
