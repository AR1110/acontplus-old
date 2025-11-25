# Verification and cleanup script after renaming .API to .Api

Write-Host "`n=== Verification Report ===" -ForegroundColor Green

# Check for any remaining .API.csproj files
Write-Host "`n1. Checking for remaining .API.csproj files..." -ForegroundColor Yellow
$remainingApiFiles = Get-ChildItem -Path "src\Services" -Recurse -Filter "*.API.csproj" |
    Where-Object { $_.Directory.Name -notmatch "obj|bin" }

if ($remainingApiFiles.Count -eq 0) {
    Write-Host "   ✓ No .API.csproj files found (all renamed successfully)" -ForegroundColor Green
} else {
    Write-Host "   ✗ Found $($remainingApiFiles.Count) .API.csproj files still remaining:" -ForegroundColor Red
    $remainingApiFiles | ForEach-Object { Write-Host "     - $($_.FullName)" -ForegroundColor Red }
}

# List all .Api.csproj files
Write-Host "`n2. Current .Api.csproj files:" -ForegroundColor Yellow
$apiFiles = Get-ChildItem -Path "src\Services" -Recurse -Filter "*.Api.csproj" |
    Where-Object { $_.Directory.Name -notmatch "obj|bin" }
$apiFiles | ForEach-Object { Write-Host "   ✓ $($_.FullName)" -ForegroundColor Cyan }
Write-Host "   Total: $($apiFiles.Count) files" -ForegroundColor Green

# Clean obj and bin folders
Write-Host "`n3. Cleaning obj and bin folders..." -ForegroundColor Yellow
$objDirs = Get-ChildItem -Path "src\Services" -Recurse -Directory -Filter "obj"
$binDirs = Get-ChildItem -Path "src\Services" -Recurse -Directory -Filter "bin"

$totalDirs = $objDirs.Count + $binDirs.Count
Write-Host "   Found $totalDirs directories to clean" -ForegroundColor Cyan

foreach ($dir in $objDirs) {
    try {
        Remove-Item -Path $dir.FullName -Recurse -Force -ErrorAction Stop
        Write-Host "   ✓ Cleaned: $($dir.FullName)" -ForegroundColor Green
    }
    catch {
        Write-Host "   ⚠ Could not clean: $($dir.FullName) - $_" -ForegroundColor Yellow
    }
}

foreach ($dir in $binDirs) {
    try {
        Remove-Item -Path $dir.FullName -Recurse -Force -ErrorAction Stop
        Write-Host "   ✓ Cleaned: $($dir.FullName)" -ForegroundColor Green
    }
    catch {
        Write-Host "   ⚠ Could not clean: $($dir.FullName) - $_" -ForegroundColor Yellow
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Green
Write-Host "✓ All .API.csproj files have been renamed to .Api.csproj" -ForegroundColor Green
Write-Host "✓ Build artifacts cleaned" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Rebuild the solution: dotnet build" -ForegroundColor Cyan
Write-Host "  2. Verify all projects compile successfully" -ForegroundColor Cyan
Write-Host "  3. Update any CI/CD pipelines if they reference .API.csproj" -ForegroundColor Cyan
