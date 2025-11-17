# Script to fix Pagination update patterns
# This script converts plain object returns to new Pagination() instances

$files = @(
    "src\app\modules\accounting\caja\presentation\control-caja-modal\control-caja-modal.component.ts",
    "src\app\modules\accounting\comprobante-egreso\presentation\comprobante-egreso\comprobante-egreso.component.ts",
    "src\app\modules\accounting\comprobante-ingreso\presentation\comprobante-ingreso\comprobante-ingreso.component.ts",
    "src\app\modules\accounting\cuenta-por-pagar\presentation\components\cuenta-por-pagar-lista\cuenta-por-pagar-lista.component.ts",
    "src\app\modules\accounting\movimiento-caja\presentation\anticipo\anticipo.component.ts",
    "src\app\modules\accounting\movimiento-caja\presentation\egreso-ingreso-caja\egreso-ingreso-caja.component.ts",
    "src\app\modules\accounting\sub-category\presentation\subcategory\subcategory.component.ts",
    "src\app\modules\billing\ui\doc-elect\doc-elect.ts",
    "src\app\modules\billing\ui\guia-remision\components\docs-guia-remision\docs-guia-remision.component.ts",
    "src\app\modules\billing\ui\guia-remision\guia-remision.component.ts",
    "src\app\modules\billing\ui\invoice\invoice.ts",
    "src\app\modules\common\ui\user-manual\user-manual-page.component.ts",
    "src\app\modules\config\ui\credit-time\credit-time.component.ts",
    "src\app\modules\config\ui\solicitud-autorizacion\solicitud-autorizacion.component.ts",
    "src\app\modules\config\ui\user-customer\user-customer.component.ts",
    "src\app\modules\customer\company-customer\presentation\company-customer\company-customer.component.ts",
    "src\app\modules\inventory\inventory-adjustment\presentation\inventory-adjustment\inventory-adjustment.component.ts",
    "src\app\modules\inventory\ui\brand-page\brand-page.component.ts",
    "src\app\modules\inventory\ui\fractional-product\components\fracc-product-list\fracc-product-list.component.ts",
    "src\app\modules\inventory\ui\inv-model-page\inv-model-page.component.ts",
    "src\app\modules\inventory\ui\measure-page\measure-page.component.ts",
    "src\app\modules\inventory\ui\sub-category\sub-category.component.ts",
    "src\app\modules\inventory\ui\tags\tags.component.ts",
    "src\app\modules\inventory\ui\warehouse-transfer\warehouse-transfer.ts",
    "src\app\modules\mechanical\ui\pages\config-inspection-page\config-inspection-page.component.ts",
    "src\app\modules\mechanical\ui\pages\inspection-page\inspection-page.component.ts",
    "src\app\modules\mechanical\ui\pages\support-page\support-page.component.ts",
    "src\app\modules\mechanical\ui\pages\vehicle-page\vehicle-page.component.ts",
    "src\app\modules\purchase\ui\factura-fisica\factura-fisica.component.ts",
    "src\app\modules\restaurant\ui\ingredient\ingredient-list\ingredient-list.component.ts",
    "src\app\modules\restaurant\ui\items\items.ts",
    "src\app\modules\restaurant\ui\promotion\promotion-list\promotion-list.component.ts",
    "src\app\modules\sale\ui\delivery-notes\delivery-notes.ts",
    "src\app\modules\sale\ui\proforma-invoices\proformas.ts",
    "src\app\modules\technical-support\pages\order-page\order-list\order-list.component.ts",
    "src\app\modules\vet\pages\medical-history-page\medical-history-page.component.ts"
)

Write-Host "Fixing Pagination update patterns in $($files.Count) files..." -ForegroundColor Cyan

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing: $file" -ForegroundColor Yellow

        $content = Get-Content -Path $file -Raw

        # Pattern 1: Fix pagination.update with object spread for totalRecords only (multi-line with return)
        $content = $content -replace '(?s)this\.pagination\.update\(\((\w+)\)\s*=>\s*\{\s*return\s*\{\s*\.\.\.(\1),\s*totalRecords:\s*([^,}]+),?\s*\};\s*\}\)', 'this.pagination.update(($1) => new Pagination($1.pageIndex, $1.pageSize, $3))'

        # Pattern 2: Fix pagination.update in handlePageEvent with object spread (multi-line with return)
        $content = $content -replace '(?s)this\.pagination\.update\(\((\w+)\)\s*=>\s*\{\s*return\s*\{\s*\.\.\.(\1),\s*totalRecords:\s*e\.length,\s*pageSize:\s*e\.pageSize,\s*pageIndex:\s*e\.pageIndex,?\s*\};\s*\}\)', 'this.pagination.update(($1) => { const updated = new Pagination($1.pageIndex, $1.pageSize, $1.totalRecords); updated.handlePageEvent(e); return updated; })'

        # Pattern 3: Fix pagination.update with object literal without spread (no return, arrow function)
        $content = $content -replace 'this\.pagination\.update\(\((\w+)\)\s*=>\s*\(\{([^}]*totalRecords:\s*([^,}]+)[^}]*)\}\)\)', 'this.pagination.update(($1) => new Pagination($1.pageIndex, $1.pageSize, $3))'

        # Pattern 4: Fix pagination.set with object literal
        $content = $content -replace 'this\.pagination\.set\(\{([^}]*totalRecords:\s*([^,}]+)[^}]*pageSize:\s*([^,}]+)[^}]*pageIndex:\s*([^,}]+)[^}]*)\}\)', 'this.pagination.set(new Pagination($4, $3, $2))'

        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "  ✓ Fixed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nDone! Fixed pagination patterns in all files." -ForegroundColor Green
