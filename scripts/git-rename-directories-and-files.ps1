# Complete rename script for directories and files from .API to .Api in Git

Write-Host "Renaming .API directories and files to .Api in Git..." -ForegroundColor Green
Write-Host "This uses a two-step process to handle Windows case-insensitivity.`n" -ForegroundColor Yellow

$services = @(
    "Accounting",
    "BarberShop",
    "Billing",
    "Common",
    "Configuration",
    "Identity",
    "Inventory",
    "Loyalty",
    "Mechanical",
    "Purchases",
    "Restaurant",
    "Sales",
    "TechnicalSupport",
    "Vet"
)

foreach ($service in $services) {
    Write-Host "Processing: $service" -ForegroundColor Cyan

    # Step 1: Rename directory from .API to .TEMP
    $oldDir = "src/Services/$service/$service.API"
    $tempDir = "src/Services/$service/$service.TEMP"
    $finalDir = "src/Services/$service/$service.Api"

    Write-Host "  Renaming directory: $oldDir -> $tempDir" -ForegroundColor Yellow
    git mv $oldDir $tempDir 2>&1 | Out-Null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✓ Step 1 successful" -ForegroundColor Green

        # Step 2: Rename directory from .TEMP to .Api
        Write-Host "  Renaming directory: $tempDir -> $finalDir" -ForegroundColor Yellow
        git mv $tempDir $finalDir 2>&1 | Out-Null

        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✓ Step 2 successful - Directory renamed!" -ForegroundColor Green
        } else {
            Write-Host "    ✗ Step 2 failed" -ForegroundColor Red
        }
    } else {
        Write-Host "    ⚠ Directory may not exist in Git or already renamed" -ForegroundColor Yellow
    }

    Write-Host ""
}

Write-Host "`n=== Git Status ===" -ForegroundColor Green
git status --short | Select-Object -First 30

Write-Host "`n✓ Rename complete! Review the changes above." -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review changes: git status" -ForegroundColor Cyan
Write-Host "  2. Commit changes: git commit -m 'Rename .API to .Api for consistency'" -ForegroundColor Cyan
Write-Host "  3. Push changes: git push" -ForegroundColor Cyan
