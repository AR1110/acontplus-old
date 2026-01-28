$files = Get-ChildItem -Path "src\app\modules\config" -Filter "*.ts" -Recurse

$replacements = @{
    "@modules/config/data/models/user-customer/" = "@modules/config/data/models/user/"
    "@modules/config/data/repositories/user-customer.repository" = "@modules/config/data/repositories/user.repository"
    "@modules/config/data/repositories/user-customer-permission.repository" = "@modules/config/data/repositories/user-permission.repository"
    "@modules/config/data/repositories/user-customer-role.repository" = "@modules/config/data/repositories/user-role.repository"
    "@modules/config/data/user-customer/" = "@modules/config/data/user/"
    "@modules/config/data/user-customer-permission/" = "@modules/config/data/user-permission/"
    "@modules/config/data/user-customer-role/" = "@modules/config/data/user-role/"
    "@modules/config/application/store/user-customer.store" = "@modules/config/application/store/user.store"
    "@modules/config/application/use-cases/user-customer/" = "@modules/config/application/use-cases/user/"
    "@modules/config/application/use-cases/user-customer-permission/" = "@modules/config/application/use-cases/user-permission/"
    "@modules/config/application/use-cases/user-customer-role/" = "@modules/config/application/use-cases/user-role/"
    "@modules/config/services/user-customer/" = "@modules/config/services/user/"
    "@modules/config/ui/user-customer/" = "@modules/config/ui/user/"
    "./user-customer-page.html" = "./user-page.html"
    "./user-customer-add-edit-modal.html" = "./user-add-edit-modal.html"
    "./setting-user-customer.html" = "./setting-user.html"
    "./user-customer-permission.component.html" = "./user-permission.component.html"
    "./user-customer-access.component.html" = "./user-access.component.html"
    "./user-customer-role-access.component.html" = "./user-role-access.component.html"
    "./user-customer-role-permission.component.html" = "./user-role-permission.component.html"
    "./list-user-customer-permission.mapper" = "./list-user-permission.mapper"
    "./list-user-customer-role.mapper" = "./list-user-role.mapper"
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($null -eq $content) { continue }
    
    $modified = $false
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        if ($content -match [regex]::Escape($old)) {
            $content = $content -replace [regex]::Escape($old), $new
            $modified = $true
        }
    }
    
    if ($modified) {
        try {
            Set-Content -Path $file.FullName -Value $content -NoNewline -ErrorAction Stop
            Write-Host "Updated: $($file.FullName)"
        } catch {
            Write-Host "Skipped (locked): $($file.FullName)" -ForegroundColor Yellow
        }
    }
}

Write-Host "`nAll updates complete!" -ForegroundColor Green
