# Two-step rename for case-sensitive changes in Git on Windows
# Step 1: Rename to temp name
# Step 2: Rename to final name

Write-Host "Performing case-sensitive rename in Git (two-step process)..." -ForegroundColor Green

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
    $originalPath = "src/Services/$service/$service.Api/$service.API.csproj"
    $tempPath = "src/Services/$service/$service.Api/$service.TEMP.csproj"
    $finalPath = "src/Services/$service/$service.Api/$service.Api.csproj"

    Write-Host "`nProcessing: $service" -ForegroundColor Cyan

    # Step 1: Rename to temp
    Write-Host "  Step 1: $originalPath -> $tempPath" -ForegroundColor Yellow
    git mv $originalPath $tempPath 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✓ Temp rename successful" -ForegroundColor Green

        # Step 2: Rename to final
        Write-Host "  Step 2: $tempPath -> $finalPath" -ForegroundColor Yellow
        git mv $tempPath $finalPath 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✓ Final rename successful" -ForegroundColor Green
        } else {
            Write-Host "    ✗ Final rename failed" -ForegroundColor Red
        }
    } else {
        Write-Host "    ⚠ File may not be in Git or already renamed" -ForegroundColor Yellow
    }

    # Handle .user files
    $originalUserPath = "src/Services/$service/$service.Api/$service.API.csproj.user"
    $tempUserPath = "src/Services/$service/$service.Api/$service.TEMP.csproj.user"
    $finalUserPath = "src/Services/$service/$service.Api/$service.Api.csproj.user"

    if (Test-Path $originalUserPath.Replace('/', '\')) {
        Write-Host "  Step 1: $originalUserPath -> $tempUserPath" -ForegroundColor Yellow
        git mv $originalUserPath $tempUserPath 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✓ Temp rename successful" -ForegroundColor Green

            Write-Host "  Step 2: $tempUserPath -> $finalUserPath" -ForegroundColor Yellow
            git mv $tempUserPath $finalUserPath 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "    ✓ Final rename successful" -ForegroundColor Green
            }
        }
    }
}

Write-Host "`n=== Git Status ===" -ForegroundColor Green
git status --short

Write-Host "`nDone! The renames should now be visible in Git." -ForegroundColor Green
