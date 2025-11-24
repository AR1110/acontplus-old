# fix-missing-imports.ps1
# Add DynamicCard import to components that are missing it

$files = @(
    "src\app\modules\purchase\ui\documento-received\document-received.component.ts",
    "src\app\modules\purchase\ui\factura-fisica\factura-fisica.component.ts",
    "src\app\modules\sale\ui\delivery-notes\delivery-notes.ts",
    "src\app\modules\sale\ui\reports\sale-report-page\sale-report-page.component.ts",
    "src\app\modules\technical-support\components\dashboard\dashboard.component.ts",
    "src\app\modules\technical-support\pages\device-page\device-page.component.ts",
    "src\app\modules\technical-support\pages\device-page\device-modal\device-modal.component.ts",
    "src\app\modules\vet\components\pet-modal\pet-modal.component.ts",
    "src\app\modules\vet\pages\medical-history-page\medical-history-modal\medical-history-modal.component.ts",
    "src\app\modules\vet\pages\pet-page\pet-page.component.ts",
    "src\app\modules\vet\pages\stats-page\stats-page.component.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw

        # Check if DynamicCard is already imported
        if ($content -notmatch "DynamicCard") {
            Write-Host "Adding DynamicCard to $file" -ForegroundColor Yellow

            # Add import at the beginning
            if ($content -match "from '@acontplus/ng-components'") {
                # Already has acontplus imports, add to existing
                $content = $content -replace "(import \{[^}]*)(} from '@acontplus/ng-components')", "`$1, DynamicCard`$2"
            } else {
                # Add new import
                $content = "import { DynamicCard } from '@acontplus/ng-components';`n" + $content
            }

            # Add to imports array if not there
            if ($content -match "imports:\s*\[" -and $content -notmatch "imports:.*DynamicCard") {
                $content = $content -replace "(imports:\s*\[)", "`$1`n    DynamicCard,"
            }

            Set-Content $file -Value $content -NoNewline
            Write-Host "  ✓ Updated" -ForegroundColor Green
        } else {
            Write-Host "Skipping $file (already has DynamicCard)" -ForegroundColor Gray
        }
    }
}

Write-Host "`nDone! Run: npm run production" -ForegroundColor Cyan
