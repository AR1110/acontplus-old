# Script to properly rename files in Git (case-sensitive rename)
# Git on Windows doesn't detect case-only changes automatically

Write-Host "Renaming .API.csproj to .Api.csproj in Git..." -ForegroundColor Green

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
    $oldPath = "src/Services/$service/$service.Api/$service.API.csproj"
    $newPath = "src/Services/$service/$service.Api/$service.Api.csproj"
    $oldUserPath = "src/Services/$service/$service.Api/$service.API.csproj.user"
    $newUserPath = "src/Services/$service/$service.Api/$service.Api.csproj.user"

    # Rename main .csproj file
    if (Test-Path $oldPath.Replace('/', '\')) {
        Write-Host "  Renaming: $oldPath -> $newPath" -ForegroundColor Cyan
        git mv -f $oldPath $newPath
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✓ Success" -ForegroundColor Green
        } else {
            Write-Host "    ✗ Failed (may already be renamed)" -ForegroundColor Yellow
        }
    }

    # Rename .user file if it exists
    if (Test-Path $oldUserPath.Replace('/', '\')) {
        Write-Host "  Renaming: $oldUserPath -> $newUserPath" -ForegroundColor Cyan
        git mv -f $oldUserPath $newUserPath
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✓ Success" -ForegroundColor Green
        } else {
            Write-Host "    ✗ Failed (may already be renamed)" -ForegroundColor Yellow
        }
    }
}

Write-Host "`nChecking git status..." -ForegroundColor Yellow
git status --short

Write-Host "`nDone! Use 'git status' to see the changes." -ForegroundColor Green
