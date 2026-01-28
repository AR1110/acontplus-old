$ErrorActionPreference = 'SilentlyContinue'

# Get all TS files
$files = Get-ChildItem -Path "src\app" -Filter "*.ts" -Recurse

$patterns = @(
    @{Old='@modules/config/data/models/user/user-customer-permission.model'; New='@modules/config/data/models/user/user-permission.model'}
    @{Old='@modules/config/data/models/user/user-customer-role.model'; New='@modules/config/data/models/user/user-role.model'}
    @{Old='@modules/config/data/models/user/user-customer.model'; New='@modules/config/data/models/user/user.model'}
    @{Old='@modules/config/data/models/user-customer/'; New='@modules/config/data/models/user/'}
    @{Old='@modules/config/application/store/user-customer.store'; New='@modules/config/application/store/user.store'}
    @{Old='@modules/config/application/use-cases/user-customer-permission/'; New='@modules/config/application/use-cases/user-permission/'}
    @{Old='@modules/config/application/use-cases/user-customer-role/'; New='@modules/config/application/use-cases/user-role/'}
    @{Old='@modules/config/application/use-cases/user-customer/'; New='@modules/config/application/use-cases/user/'}
    @{Old='@modules/config/services/user-customer/'; New='@modules/config/services/user/'}
    @{Old='@modules/config/ui/user-customer/'; New='@modules/config/ui/user/'}
    @{Old='./setting-user-customer.html'; New='./setting-user.html'}
    @{Old='./user-customer-page.html'; New='./user-page.html'}
    @{Old='./user-customer-add-edit-modal.html'; New='./user-add-edit-modal.html'}
    @{Old='./user-customer-permission.component.html'; New='./user-permission.component.html'}
    @{Old='./user-customer-access.component.html'; New='./user-access.component.html'}
    @{Old='./user-customer-role-access.component.html'; New='./user-role-access.component.html'}
    @{Old='./user-customer-role-permission.component.html'; New='./user-role-permission.component.html'}
    @{Old='list-user-customer-permission.use-case'; New='list-user-permission.use-case'}
    @{Old='create-user-customer-permission.use-case'; New='create-user-permission.use-case'}
    @{Old='update-user-customer-permission.use-case'; New='update-user-permission.use-case'}
    @{Old='list-user-customer-role.use-case'; New='list-user-role.use-case'}
    @{Old='list-access-user-customer-role.use-case'; New='list-access-user-role.use-case'}
    @{Old='update-access-user-customer-role.use-case'; New='update-access-user-role.use-case'}
    @{Old='list-user-customer.use-case'; New='list-user.use-case'}
    @{Old='create-user-customer.use-case'; New='create-user.use-case'}
    @{Old='update-user-customer.use-case'; New='update-user.use-case'}
    @{Old='get-user-customer-form-data.use-case.'; New='get-user-form-data.use-case'}
    @{Old='user-customer-add-edit-modal/user-customer-add-edit-modal'; New='user-add-edit-modal/user-add-edit-modal'}
    @{Old='setting-user-customer/setting-user-customer'; New='setting-user/setting-user'}
    @{Old='setting-user-customer/list-asignacion-estab'; New='setting-user/list-asignacion-estab'}
    @{Old='setting-user-customer/asignacion-bodega-punto-emision-dialog'; New='setting-user/asignacion-bodega-punto-emision-dialog'}
    @{Old='setting-user-customer/user-customer-permission'; New='setting-user/user-permission'}
    @{Old='setting-user-customer/user-customer-access'; New='setting-user/user-access'}
    @{Old='setting-user-customer/user-customer-role-permission'; New='setting-user/user-role-permission'}
    @{Old='setting-user-customer/user-customer-role-access'; New='setting-user/user-role-access'}
    @{Old='UserCustomerStore'; New='UserStore'}
    @{Old='$userCustomerStore'; New='$userStore'}
    @{Old='$listUserCustomerRoleUseCase'; New='$listUserRoleUseCase'}
    @{Old='$listUserCustomerUseCase'; New='$listUserUseCase'}
    @{Old='$getUserCustomerDataFormUseCase'; New='$getUserDataFormUseCase'}
    @{Old='$updateUserCustomerUseCase'; New='$updateUserUseCase'}
    @{Old='$createUserCustomerUseCase'; New='$createUserUseCase'}
    @{Old='_updateUserCustomerUseCase'; New='_updateUserUseCase'}
    @{Old='UserCustomerAddEditModal'; New='UserAddEditModal'}
    @{Old='SettingUserCustomer'; New='SettingUser'}
    @{Old='userCustomerRoleData'; New='userRoleData'}
)

$count = 0
foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        $original = $content
        
        foreach ($pattern in $patterns) {
            $content = $content.Replace($pattern.Old, $pattern.New)
        }
        
        if ($content -ne $original) {
            [System.IO.File]::WriteAllText($file.FullName, $content)
            $count++
        }
    } catch {}
}

Write-Host "Fixed $count files" -ForegroundColor Green
