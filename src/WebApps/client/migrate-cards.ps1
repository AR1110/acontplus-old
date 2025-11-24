# migrate-cards.ps1
# Script to migrate mat-card components to acp-dynamic-card

param(
    [switch]$DryRun,
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"
$migrationLog = @()
$srcPath = Join-Path $PSScriptRoot "src"

# Components to migrate with their patterns
$componentsToMigrate = @(
    @{
        Path = "app\modules\home\dashboard\dashboard.ts"
        ImportPattern = "import { MatCardModule } from '@angular/material/card';"
        ImportReplace = "import { DynamicCard } from '@acontplus/ng-components';"
        ImportsPattern = "imports: \[MatCardModule, ChartComponent\],"
        ImportsReplace = "imports: [DynamicCard, ChartComponent],"
    },
    @{
        Path = "app\modules\billing\ui\ats\ats.component.ts"
        ImportPattern = "MatCardModule"
        ImportReplace = "DynamicCard"
    },
    @{
        Path = "app\modules\config\ui\setup-dashboard\setup-dashboard.component.ts"
        ImportPattern = "MatCardModule"
        ImportReplace = "DynamicCard"
    },
    @{
        Path = "app\modules\config\ui\general-config\general-config.component.ts"
        ImportPattern = "MatCardModule"
        ImportReplace = "DynamicCard"
    },
    @{
        Path = "app\modules\sale\ui\reports\sale-report-page\sale-report-page.component.ts"
        ImportPattern = "MatCardModule"
        ImportReplace = "DynamicCard"
    },
    @{
        Path = "app\modules\inventory\ui\inventory-report\inventory-report.component.ts"
        ImportPattern = "MatCardModule"
        ImportReplace = "DynamicCard"
    },
    @{
        Path = "app\modules\common\ui\user-manual\user-manual-page.component.ts"
        ImportPattern = "MatCardModule"
        ImportReplace = "DynamicCard"
    }
)

# HTML migration patterns
$htmlPatterns = @(
    # Pattern 1: mat-card-header with mat-card-title (simple title)
    @{
        Find = @"
<mat-card appearance="outlined">
  <mat-card-header>
    <mat-card-title>(?<title>[^<]+)</mat-card-title>
  </mat-card-header>
  <mat-card-content>
"@
        Replace = @"
<acp-dynamic-card cardTitle="`$1" [isHeaderVisible]="true">

"@
    },
    # Pattern 2: mat-card-header with mat-card-title-group (empty title with actions)
    @{
        Find = @"
  <mat-card-header>
    <mat-card-title-group>
      <mat-card-title />
      <div class="d-flex flex-row gap-2">
"@
        Replace = @"
  <div headerActions class="d-flex flex-row gap-2">
"@
    },
    # Pattern 3: Close mat-card-content and mat-card
    @{
        Find = "</mat-card-content>`r`n</mat-card>"
        Replace = "</acp-dynamic-card>"
    },
    # Pattern 4: Close just mat-card (for cards without mat-card-content)
    @{
        Find = "</mat-card>"
        Replace = "</acp-dynamic-card>"
    }
)

function Write-Log {
    param([string]$Message, [string]$Type = "INFO")

    $timestamp = Get-Date -Format "HH:mm:ss"
    $logEntry = "[$timestamp] [$Type] $Message"
    $migrationLog += $logEntry

    if ($Verbose) {
        switch ($Type) {
            "ERROR" { Write-Host $logEntry -ForegroundColor Red }
            "SUCCESS" { Write-Host $logEntry -ForegroundColor Green }
            "WARNING" { Write-Host $logEntry -ForegroundColor Yellow }
            default { Write-Host $logEntry }
        }
    }
}

function Update-TypeScriptImports {
    param(
        [string]$FilePath
    )

    if (-not (Test-Path $FilePath)) {
        Write-Log "File not found: $FilePath" "ERROR"
        return $false
    }

    $content = Get-Content $FilePath -Raw
    $originalContent = $content
    $modified = $false

    # Replace MatCardModule import
    if ($content -match "import.*MatCardModule.*from '@angular/material/card';") {
        $content = $content -replace "import.*MatCardModule.*from '@angular/material/card';", "import { DynamicCard } from '@acontplus/ng-components';"
        $modified = $true
        Write-Log "Replaced MatCardModule import in $FilePath" "SUCCESS"
    }

    # Replace MatCard, MatCardContent, etc. imports
    if ($content -match "import.*\{[^}]*(MatCard|MatCardContent|MatCardHeader|MatCardTitle|MatCardTitleGroup)[^}]*\}.*from '@angular/material/card';") {
        $content = $content -replace "import.*\{[^}]*(MatCard|MatCardContent|MatCardHeader|MatCardTitle|MatCardTitleGroup)[^}]*\}.*from '@angular/material/card';", "import { DynamicCard } from '@acontplus/ng-components';"
        $modified = $true
        Write-Log "Replaced MatCard component imports in $FilePath" "SUCCESS"
    }

    # Replace in imports array
    if ($content -match "MatCardModule") {
        $content = $content -replace "MatCardModule,?", "DynamicCard,"
        $modified = $true
        Write-Log "Replaced MatCardModule in imports array in $FilePath" "SUCCESS"
    }

    if ($content -match "MatCard,") {
        $content = $content -replace "MatCard,", "DynamicCard,"
        $modified = $true
    }

    if ($content -match "MatCardContent,") {
        $content = $content -replace "MatCardContent,", ""
        $modified = $true
    }

    if ($content -match "MatCardHeader,") {
        $content = $content -replace "MatCardHeader,", ""
        $modified = $true
    }

    if ($content -match "MatCardTitle,") {
        $content = $content -replace "MatCardTitle,", ""
        $modified = $true
    }

    if ($modified) {
        if (-not $DryRun) {
            Set-Content $FilePath -Value $content -NoNewline
            Write-Log "Updated TypeScript file: $FilePath" "SUCCESS"
        } else {
            Write-Log "[DRY RUN] Would update TypeScript file: $FilePath" "WARNING"
        }
        return $true
    }

    return $false
}

function Update-HTMLTemplate {
    param(
        [string]$FilePath
    )

    if (-not (Test-Path $FilePath)) {
        Write-Log "File not found: $FilePath" "ERROR"
        return $false
    }

    $content = Get-Content $FilePath -Raw
    $originalContent = $content
    $modified = $false

    # Simple replacements
    if ($content -match "<mat-card") {
        # Replace mat-card opening tags
        $content = $content -replace '<mat-card([^>]*)>', '<acp-dynamic-card$1>'
        $content = $content -replace '</mat-card>', '</acp-dynamic-card>'
        $modified = $true
        Write-Log "Replaced mat-card tags in $FilePath" "SUCCESS"
    }

    # Handle mat-card-header + mat-card-title patterns
    # Pattern: <mat-card-header><mat-card-title>Title</mat-card-title></mat-card-header>
    if ($content -match '<mat-card-header>\s*<mat-card-title>([^<]+)</mat-card-title>\s*</mat-card-header>') {
        $content = $content -replace '<mat-card-header>\s*<mat-card-title>([^<]+)</mat-card-title>\s*</mat-card-header>', ''
        # Add cardTitle property to acp-dynamic-card (this requires manual intervention)
        $modified = $true
        Write-Log "Found mat-card-title pattern in $FilePath - MANUAL REVIEW NEEDED" "WARNING"
    }

    # Remove mat-card-content wrappers
    if ($content -match "<mat-card-content>") {
        $content = $content -replace '<mat-card-content[^>]*>', ''
        $content = $content -replace '</mat-card-content>', ''
        $modified = $true
        Write-Log "Removed mat-card-content wrappers in $FilePath" "SUCCESS"
    }

    # Remove mat-card-header wrappers (after extracting titles)
    if ($content -match "<mat-card-header>") {
        $content = $content -replace '<mat-card-header[^>]*>', ''
        $content = $content -replace '</mat-card-header>', ''
        $modified = $true
        Write-Log "Removed mat-card-header in $FilePath" "SUCCESS"
    }

    # Remove mat-card-title-group
    if ($content -match "<mat-card-title-group>") {
        $content = $content -replace '<mat-card-title-group[^>]*>', ''
        $content = $content -replace '</mat-card-title-group>', ''
        $modified = $true
        Write-Log "Removed mat-card-title-group in $FilePath" "SUCCESS"
    }

    if ($modified) {
        if (-not $DryRun) {
            Set-Content $FilePath -Value $content -NoNewline
            Write-Log "Updated HTML file: $FilePath" "SUCCESS"
        } else {
            Write-Log "[DRY RUN] Would update HTML file: $FilePath" "WARNING"
        }
        return $true
    }

    return $false
}

# Main execution
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  mat-card to acp-dynamic-card Migration Script" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "Running in DRY RUN mode - no files will be modified" -ForegroundColor Yellow
    Write-Host ""
}

# Find all TypeScript files with MatCardModule
Write-Host "Searching for components using MatCardModule..." -ForegroundColor Cyan
$tsFiles = Get-ChildItem -Path $srcPath -Recurse -Filter "*.ts" |
    Where-Object { (Get-Content $_.FullName -Raw) -match "MatCardModule|MatCard," }

Write-Host "Found $($tsFiles.Count) TypeScript files to process" -ForegroundColor Green
Write-Host ""

$processedTS = 0
$processedHTML = 0

foreach ($tsFile in $tsFiles) {
    Write-Host "Processing: $($tsFile.Name)" -ForegroundColor White

    # Update TypeScript file
    if (Update-TypeScriptImports -FilePath $tsFile.FullName) {
        $processedTS++

        # Find corresponding HTML file
        $htmlPath = $tsFile.FullName -replace '\.ts$', '.html'
        if (Test-Path $htmlPath) {
            if (Update-HTMLTemplate -FilePath $htmlPath) {
                $processedHTML++
            }
        } else {
            # Try alternative naming
            $htmlPath = $tsFile.FullName -replace '\.component\.ts$', '.component.html'
            if (Test-Path $htmlPath) {
                if (Update-HTMLTemplate -FilePath $htmlPath) {
                    $processedHTML++
                }
            }
        }
    }
}

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  Migration Summary" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "TypeScript files processed: $processedTS" -ForegroundColor Green
Write-Host "HTML files processed: $processedHTML" -ForegroundColor Green
Write-Host ""

if ($DryRun) {
    Write-Host "This was a DRY RUN. Run without -DryRun to apply changes." -ForegroundColor Yellow
} else {
    Write-Host "Migration complete! Please review changes and run tests." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Review git diff to check changes" -ForegroundColor White
    Write-Host "2. Some components may need manual adjustment for:" -ForegroundColor White
    Write-Host "   - cardTitle properties" -ForegroundColor Yellow
    Write-Host "   - isHeaderVisible flags" -ForegroundColor Yellow
    Write-Host "   - headerActions content projection" -ForegroundColor Yellow
    Write-Host "3. Run: npm run build" -ForegroundColor White
    Write-Host "4. Run: npm run production" -ForegroundColor White
}

Write-Host ""
Write-Host "Log saved to: migration-log.txt" -ForegroundColor Cyan
$migrationLog | Out-File -FilePath "migration-log.txt"
