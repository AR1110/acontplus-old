$files = Get-ChildItem -Path "src\app" -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue

$count = 0
foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        $original = $content
        
        # Fix all user-customer patterns in paths
        $content = $content -replace 'user-customer-permission\.model', 'user-permission.model'
        $content = $content -replace 'user-customer-role\.model', 'user-role.model'
        $content = $content -replace 'user-customer\.model', 'user.model'
        $content = $content -replace 'user-customer-permission/', 'user-permission/'
        $content = $content -replace 'user-customer-role/', 'user-role/'
        $content = $content -replace 'user-customer/', 'user/'
        $content = $content -replace 'user-customer\.', 'user.'
        
        if ($content -ne $original) {
            [System.IO.File]::WriteAllText($file.FullName, $content)
            $count++
            Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
        }
    } catch {
        Write-Host "Skip: $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "`nTotal fixed: $count files" -ForegroundColor Cyan
