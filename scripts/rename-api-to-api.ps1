# Script to rename all .API.csproj files to .Api.csproj
# This includes both the main .csproj files and their .user counterparts

Write-Host "Starting rename process..." -ForegroundColor Green

# Get all .API.csproj files (excluding obj and bin directories)
$files = Get-ChildItem -Path "src\Services" -Recurse -Filter "*.API.csproj*" |
    Where-Object { $_.FullName -notmatch "\\obj\\|\\bin\\" }

Write-Host "Found $($files.Count) files to rename" -ForegroundColor Yellow

foreach ($file in $files) {
    $newName = $file.Name -replace "\.API\.csproj", ".Api.csproj"
    $newPath = Join-Path $file.Directory.FullName $newName

    Write-Host "Renaming: $($file.FullName)" -ForegroundColor Cyan
    Write-Host "      To: $newPath" -ForegroundColor Cyan

    try {
        Rename-Item -Path $file.FullName -NewName $newName -Force
        Write-Host "  ✓ Success" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ Failed: $_" -ForegroundColor Red
    }
}

Write-Host "`nRename process completed!" -ForegroundColor Green
Write-Host "`nNote: You may need to update solution file references and clean obj/bin folders." -ForegroundColor Yellow
