# Script to rename remaining locked .API directories using aggressive unlock + two-step approach
# Kills file watchers, uses .NET APIs, and bypasses Windows case-insensitive file system issues

# Add .NET types for low-level file operations
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class FileOps {
    [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    public static extern bool MoveFileEx(string lpExistingFileName, string lpNewFileName, int dwFlags);
    public const int MOVEFILE_REPLACE_EXISTING = 1;
    public const int MOVEFILE_WRITE_THROUGH = 8;
}
"@

$lockedDirs = @(
    "src\ApiGateways\Ocelot.API",
    "src\Services\Accounting\Accounting.API",
    "src\Services\BarberShop\BarberShop.API",
    "src\Services\Billing\Billing.API",
    "src\Services\Common\Common.API",
    "src\Services\Configuration\Configuration.API",
    "src\Services\Identity\Identity.API",
    "src\Services\Inventory\Inventory.API",
    "src\Services\Loyalty\Loyalty.API",
    "src\Services\Mechanical\Mechanical.API",
    "src\Services\Purchases\Purchases.API",
    "src\Services\Restaurant\Restaurant.API",
    "src\Services\Sales\Sales.API",
    "src\Services\TechnicalSupport\TechnicalSupport.API",
    "src\Services\Vet\Vet.API"
)

$rootPath = "C:\Users\ifer7\source\repos\AcontPlus"

# Kill potential file watchers
Write-Host "Stopping potential file watchers..." -ForegroundColor Yellow
Get-Process -Name "ServiceHub*", "vscode*", "Code*" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2


Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Renaming Locked .API Directories" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($dir in $lockedDirs) {
    $fullPath = Join-Path -Path $rootPath -ChildPath $dir
    $parentPath = Split-Path -Path $fullPath -Parent
    $oldName = Split-Path -Path $fullPath -Leaf
    $tempName = $oldName -replace "\.API$", "_TEMP"
    $newName = $oldName -replace "\.API$", ".Api"

    if (Test-Path -Path $fullPath) {
        Write-Host "Processing: $oldName" -ForegroundColor Yellow

        try {
            # Try method 1: Standard PowerShell rename with temp
            $tempPath = Join-Path -Path $parentPath -ChildPath $tempName
            $finalPath = Join-Path -Path $parentPath -ChildPath $newName

            try {
                # Step 1: Rename to temp name
                Rename-Item -Path $fullPath -NewName $tempName -Force -ErrorAction Stop
                Write-Host "  ✓ Step 1: $oldName → $tempName" -ForegroundColor Green

                Start-Sleep -Milliseconds 200

                # Step 2: Rename from temp to final name
                Rename-Item -Path $tempPath -NewName $newName -Force -ErrorAction Stop
                Write-Host "  ✓ Step 2: $tempName → $newName" -ForegroundColor Green
                Write-Host "  ✓ Completed: $oldName → $newName" -ForegroundColor Cyan
                $successCount++
            } catch {
                # Method 2: Try using .NET MoveFileEx API
                Write-Host "  ⚠ Standard method failed, trying .NET API..." -ForegroundColor Yellow

                $result1 = [FileOps]::MoveFileEx($fullPath, $tempPath, 9)
                if ($result1) {
                    Write-Host "  ✓ Step 1 (.NET): $oldName → $tempName" -ForegroundColor Green
                    Start-Sleep -Milliseconds 200

                    $result2 = [FileOps]::MoveFileEx($tempPath, $finalPath, 9)
                    if ($result2) {
                        Write-Host "  ✓ Step 2 (.NET): $tempName → $newName" -ForegroundColor Green
                        Write-Host "  ✓ Completed: $oldName → $newName" -ForegroundColor Cyan
                        $successCount++
                    } else {
                        throw "MoveFileEx failed on step 2"
                    }
                } else {
                    throw "MoveFileEx failed on step 1"
                }
            }
            Write-Host ""
        } catch {
            Write-Host "  ✗ Failed: $_" -ForegroundColor Red
            Write-Host "  ℹ Try closing VS Code and running again" -ForegroundColor Blue
            $failCount++
            Write-Host ""
        }
    } else {
        Write-Host "  ℹ Already renamed or not found: $oldName" -ForegroundColor Blue
        Write-Host ""
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Rename operation completed!" -ForegroundColor Cyan
Write-Host "Success: $successCount | Failed: $failCount" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($failCount -gt 0) {
    Write-Host ""
    Write-Host "⚠ Some directories couldn't be renamed." -ForegroundColor Yellow
    Write-Host "Please close VS Code completely and run this script again." -ForegroundColor Yellow
}
