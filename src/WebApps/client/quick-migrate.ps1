# quick-migrate.ps1 - Fast migration for common patterns
# Usage: .\quick-migrate.ps1 [-DryRun] [-Module "inventory"]

param(
    [switch]$DryRun,
    [string]$Module = ""
)

$files = if ($Module) {
    Get-ChildItem ".\src\app\modules\$Module" -Recurse -Filter "*.ts" | Where-Object {
        (Get-Content $_.FullName -Raw) -match "MatCardModule|MatCard,"
    }
} else {
    Get-ChildItem ".\src\app\modules" -Recurse -Filter "*.ts" | Where-Object {
        (Get-Content $_.FullName -Raw) -match "MatCardModule|MatCard,"
    }
}

$count = 0
foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Cyan

    # TS file
    $ts = Get-Content $file.FullName -Raw
    $ts = $ts -replace "import \{ MatCardModule \} from '@angular/material/card';", "import { DynamicCard } from '@acontplus/ng-components';"
    $ts = $ts -replace "import \{([^}]*)(MatCard|MatCardContent|MatCardHeader|MatCardTitle|MatCardTitleGroup|MatCardSubtitle|MatCardActions)([^}]*)\} from '@angular/material/card';", "import { DynamicCard } from '@acontplus/ng-components';"
    $ts = $ts -replace "MatCardModule,", "DynamicCard,"
    $ts = $ts -replace ", MatCardModule", ", DynamicCard"
    $ts = $ts -replace "MatCard,", "DynamicCard,"
    $ts = $ts -replace "(MatCardContent|MatCardHeader|MatCardTitle|MatCardTitleGroup|MatCardSubtitle|MatCardActions),\s*", ""

    if (-not $DryRun) { Set-Content $file.FullName -Value $ts -NoNewline }

    # HTML file
    $htmlPath = $file.FullName -replace '\.ts$', '.html'
    if (Test-Path $htmlPath) {
        $html = Get-Content $htmlPath -Raw

        # Basic replacements
        $html = $html -replace '<mat-card\s+appearance="outlined">', '<acp-dynamic-card>'
        $html = $html -replace '<mat-card>', '<acp-dynamic-card>'
        $html = $html -replace '</mat-card>', '</acp-dynamic-card>'
        $html = $html -replace '<mat-card-content[^>]*>', ''
        $html = $html -replace '</mat-card-content>', ''

        # Title-group pattern (empty title with actions)
        $html = $html -replace '<mat-card-title-group>\s*<mat-card-title\s*/>\s*<div\s+class="d-flex flex-row gap-2">', '<div headerActions class="d-flex flex-row gap-2">'
        $html = $html -replace '</mat-card-title-group>\s*</mat-card-header>', ''

        # Actions
        $html = $html -replace '<mat-card-actions([^>]*)>', '<div$1>'
        $html = $html -replace '</mat-card-actions>', '</div>'

        if (-not $DryRun) { Set-Content $htmlPath -Value $html -NoNewline }
        Write-Host "  ✓ Updated $($file.Name) and HTML" -ForegroundColor Green
        $count++
    }
}

Write-Host "`nProcessed $count component(s)" -ForegroundColor Green
if ($DryRun) { Write-Host "DRY RUN - no changes made" -ForegroundColor Yellow }
else { Write-Host "Run: npm run build" -ForegroundColor Cyan }
