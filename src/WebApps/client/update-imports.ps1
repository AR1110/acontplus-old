# Update all imports from user-customer to user pattern
$rootPath = "src\app\modules\config"

# Define replacements
$replacements = @{
    "user-customer.store" = "user.store"
    "user-customer.repository" = "user.repository"
    "user-customer-permission.repository" = "user-permission.repository"
    "user-customer-role.repository" = "user-role.repository"
    "user-customer/user-customer-repository-impl" = "user/user-repository-impl"
    "user-customer-permission/user-customer-permission-repository-impl" = "user-permission/user-permission-repository-impl"
    "user-customer-role/user-customer-role-repository-impl" = "user-role/user-role-repository-impl"
    "user-customer/get-user-customer-form-data.mapper" = "user/get-user-form-data.mapper"
    "user-customer/list-user-customer.mapper" = "user/list-user.mapper"
    "user-customer-permission/create-user-customer-permission.mapper" = "user-permission/create-user-permission.mapper"
    "user-customer-permission/list-user-customer-permission.mapper" = "user-permission/list-user-permission.mapper"
    "user-customer-permission/user-customer-permission.entity" = "user-permission/user-permission.entity"
    "user-customer-permission/user-customer-permission.service" = "user-permission/user-permission.service"
    "user-customer-role/list-access-user-customer-role.mapper" = "user-role/list-access-user-role.mapper"
    "user-customer-role/list-user-customer-role.mapper" = "user-role/list-user-role.mapper"
    "models/user-customer/user-customer.model" = "models/user/user.model"
    "models/user-customer/user-customer-permission.model" = "models/user/user-permission.model"
    "models/user-customer/user-customer-role.model" = "models/user/user-role.model"
    "models/user-customer/user-customer-request.model" = "models/user/user-request.model"
    "models/user-customer/asignacion" = "models/user/asignacion"
    "use-cases/user-customer/create-user-customer.use-case" = "use-cases/user/create-user.use-case"
    "use-cases/user-customer/get-user-customer-form-data.use-case." = "use-cases/user/get-user-form-data.use-case"
    "use-cases/user-customer/list-user-customer.use-case" = "use-cases/user/list-user.use-case"
    "use-cases/user-customer/update-user-customer.use-case" = "use-cases/user/update-user.use-case"
    "use-cases/user-customer-permission/create-user-customer-permission.use-case" = "use-cases/user-permission/create-user-permission.use-case"
    "use-cases/user-customer-permission/list-user-customer-permission.use-case" = "use-cases/user-permission/list-user-permission.use-case"
    "use-cases/user-customer-permission/update-user-customer-permission.use-case" = "use-cases/user-permission/update-user-permission.use-case"
    "use-cases/user-customer-role/list-access-user-customer-role.use-case" = "use-cases/user-role/list-access-user-role.use-case"
    "use-cases/user-customer-role/list-user-customer-role.use-case" = "use-cases/user-role/list-user-role.use-case"
    "use-cases/user-customer-role/update-access-user-customer-role.use-case" = "use-cases/user-role/update-access-user-role.use-case"
    "store/user-customer.store" = "store/user.store"
    "services/user-customer/user-permission.service" = "services/user/user-permission.service"
    "ui/user-customer/user-customer-page" = "ui/user/user-page"
    "ui/user-customer/user-customer-add-edit-modal/user-customer-add-edit-modal" = "ui/user/user-add-edit-modal/user-add-edit-modal"
    "ui/user-customer/setting-user-customer/setting-user-customer" = "ui/user/setting-user/setting-user"
    "ui/user-customer/setting-user-customer/user-customer-permission/user-customer-permission.component" = "ui/user/setting-user/user-permission/user-permission.component"
    "ui/user-customer/setting-user-customer/user-customer-access/user-customer-access.component" = "ui/user/setting-user/user-access/user-access.component"
    "ui/user-customer/setting-user-customer/user-customer-role-access/user-customer-role-access.component" = "ui/user/setting-user/user-role-access/user-role-access.component"
    "ui/user-customer/setting-user-customer/user-customer-role-permission/user-customer-role-permission.component" = "ui/user/setting-user/user-role-permission/user-role-permission.component"
    "ui/user-customer/setting-user-customer/list-asignacion-estab/list-asignacion-estab.component" = "ui/user/setting-user/list-asignacion-estab/list-asignacion-estab.component"
}

# Get all TypeScript files
$files = Get-ChildItem -Path $rootPath -Filter "*.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        if ($content -match [regex]::Escape($old)) {
            $content = $content -replace [regex]::Escape($old), $new
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "Import updates complete!"
