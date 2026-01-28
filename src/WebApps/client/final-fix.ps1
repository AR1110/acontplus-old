# Final comprehensive path fix
$rootPath = "src\app"

$replacements = @{
    "user-customer-permission.model" = "user-permission.model"
    "user-customer-role.model" = "user-role.model"
    "user-customer.model" = "user.model"
    "user-customer-permission" = "user-permission"
    "user-customer-role" = "user-role"
    "user-customer" = "user"
    "./setting-user-customer.html" = "./setting-user.html"
    "./user-customer-page.html" = "./user-page.html"
    "./user-customer-add-edit-modal.html" = "./user-add-edit-modal.html"
    "./user-customer-permission.component.html" = "./user-permission.component.html"
    "./user-customer-access.component.html" = "./user-access.component.html"
    "./user-customer-role-access.component.html" = "./user-role-access.component.html"
    "./user-customer-role-permission.component.html" = "./user-role-permission.component.html"
}

$files = Get-ChildItem -Path $rootPath -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        $modified = $false
        
        foreach ($old in $replacements.Keys) {
            $new = $replacements[$old]
            if ($content -match [regex]::Escape($old)) {
                $content = $content -replace [regex]::Escape($old), $new
                $modified = $true
            }
        }
        
        if ($modified) {
            Set-Content -Path $file.FullName -Value $content -NoNewline -ErrorAction Stop
            Write-Host "Fixed: $($file.FullName)" -ForegroundColor Green
        }
    } catch {
        Write-Host "Skipped: $($file.FullName)" -ForegroundColor Yellow
    }
}

Write-Host "`nDone! Please close your IDE and run this script again if files were skipped." -ForegroundColor Cyan
