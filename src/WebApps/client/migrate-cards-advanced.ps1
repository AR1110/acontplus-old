# migrate-cards-advanced.ps1
# Advanced migration script for mat-card to acp-dynamic-card

param(
    [switch]$DryRun,
    [string[]]$IncludeModules = @(),
    [string[]]$ExcludeModules = @(),
    [switch]$OnlyWithHeaders
)

$srcPath = ".\src"
$stats = @{
    TSFilesProcessed = 0
    HTMLFilesProcessed = 0
    Errors = @()
    Warnings = @()
    ManualReviewNeeded = @()
}

function Write-ColorOutput {
    param($ForegroundColor)
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Process-TypeScriptFile {
    param([string]$Path)

    $content = Get-Content $Path -Raw
    $modified = $false

    # Pattern 1: Replace MatCardModule import
    if ($content -match "import \{ MatCardModule \} from '@angular/material/card';") {
        $content = $content -replace "import \{ MatCardModule \} from '@angular/material/card';", "import { DynamicCard } from '@acontplus/ng-components';"
        $modified = $true
    }

    # Pattern 2: Replace individual MatCard imports
    $matCardImports = @('MatCard', 'MatCardContent', 'MatCardHeader', 'MatCardTitle', 'MatCardTitleGroup', 'MatCardSubtitle', 'MatCardActions')
    $importRegex = "import \{[^}]*(" + ($matCardImports -join '|') + ")[^}]*\} from '@angular/material/card';"

    if ($content -match $importRegex) {
        $content = $content -replace $importRegex, "import { DynamicCard } from '@acontplus/ng-components';"
        $modified = $true
    }

    # Pattern 3: Replace in imports array
    if ($content -match "imports:\s*\[") {
        $content = $content -replace "MatCardModule,", "DynamicCard,"
        $content = $content -replace ",\s*MatCardModule", ", DynamicCard"
        $content = $content -replace "MatCard,", "DynamicCard,"
        $content = $content -replace ",\s*MatCard\b", ", DynamicCard"

        # Remove other mat-card related imports from array
        $content = $content -replace "MatCardContent,\s*", ""
        $content = $content -replace ",\s*MatCardContent", ""
        $content = $content -replace "MatCardHeader,\s*", ""
        $content = $content -replace ",\s*MatCardHeader", ""
        $content = $content -replace "MatCardTitle,\s*", ""
        $content = $content -replace ",\s*MatCardTitle", ""
        $content = $content -replace "MatCardTitleGroup,\s*", ""
        $content = $content -replace ",\s*MatCardTitleGroup", ""
        $content = $content -replace "MatCardSubtitle,\s*", ""
        $content = $content -replace ",\s*MatCardSubtitle", ""
        $content = $content -replace "MatCardActions,\s*", ""
        $content = $content -replace ",\s*MatCardActions", ""

        $modified = $true
    }

    if ($modified -and -not $DryRun) {
        Set-Content $Path -Value $content -NoNewline
    }

    return $modified
}

function Process-HTMLFile {
    param([string]$Path)

    $content = Get-Content $Path -Raw
    $originalContent = $content
    $modified = $false
    $needsManualReview = $false

    # Check if file has mat-card elements
    if ($content -notmatch '<mat-card') {
        return @{ Modified = $false; NeedsReview = $false }
    }

    # Pattern 1: mat-card with header and title (with icon)
    # <mat-card-header><mat-card-title> <mat-icon>icon</mat-icon> Title</mat-card-title></mat-card-header>
    if ($content -match '<mat-card-header>\s*<mat-card-title>\s*<mat-icon>([^<]+)</mat-icon>\s*([^<]+)</mat-card-title>\s*</mat-card-header>') {
        # Extract icon and title, mark for manual review
        $needsManualReview = $true
        $stats.ManualReviewNeeded += "File: $Path - Has mat-card with icon in title"
    }

    # Pattern 2: Simple mat-card-header with mat-card-title
    # Replace: <mat-card-header><mat-card-title>Title</mat-card-title></mat-card-header>
    # This pattern needs manual intervention to add cardTitle property
    if ($content -match '<mat-card-header[^>]*>\s*<mat-card-title[^>]*>([^<]+)</mat-card-title>') {
        $needsManualReview = $true
        $stats.ManualReviewNeeded += "File: $Path - Has mat-card-title that should become cardTitle property"
    }

    # Pattern 3: mat-card-title-group with actions (empty title)
    $content = $content -replace '<mat-card-title-group>\s*<mat-card-title\s*/>\s*<div\s+class="d-flex flex-row gap-2">', '<div headerActions class="d-flex flex-row gap-2">'
    $content = $content -replace '</mat-card-title-group>', ''

    # Pattern 4: Remove mat-card-header wrappers (simple cases)
    $content = $content -replace '<mat-card-header[^>]*>\s*</mat-card-header>', ''

    # Pattern 5: Replace mat-card tags
    $content = $content -replace '<mat-card\s+appearance="outlined">', '<acp-dynamic-card>'
    $content = $content -replace '<mat-card([^>]*)class="([^"]*)"([^>]*)>', '<acp-dynamic-card class="$2">'
    $content = $content -replace '<mat-card>', '<acp-dynamic-card>'
    $content = $content -replace '</mat-card>', '</acp-dynamic-card>'

    # Pattern 6: Remove mat-card-content wrappers
    $content = $content -replace '<mat-card-content[^>]*>', ''
    $content = $content -replace '</mat-card-content>', ''

    # Pattern 7: Handle mat-card-actions
    $content = $content -replace '<mat-card-actions([^>]*)>', '<div$1>'
    $content = $content -replace '</mat-card-actions>', '</div>'

    # Check if anything changed
    if ($content -ne $originalContent) {
        $modified = $true
        if (-not $DryRun) {
            Set-Content $Path -Value $content -NoNewline
        }
    }

    return @{ Modified = $modified; NeedsReview = $needsManualReview }
}

# Main execution
Write-ColorOutput -ForegroundColor Cyan "=========================================="
Write-ColorOutput -ForegroundColor Cyan "  mat-card Migration Script (Advanced)"
Write-ColorOutput -ForegroundColor Cyan "=========================================="
Write-Output ""

if ($DryRun) {
    Write-ColorOutput -ForegroundColor Yellow "[DRY RUN MODE] No files will be modified"
    Write-Output ""
}

# Find all component files
$componentPattern = if ($OnlyWithHeaders) {
    # Only files that likely have headers
    Get-ChildItem -Path $srcPath -Recurse -Filter "*.html" |
        Where-Object { (Get-Content $_.FullName -Raw) -match "mat-card-header|mat-card-title" }
} else {
    Get-ChildItem -Path $srcPath -Recurse -Filter "*.html" |
        Where-Object { (Get-Content $_.FullName -Raw) -match "<mat-card" }
}

Write-Output "Found $($componentPattern.Count) HTML files with mat-card"
Write-Output ""

foreach ($htmlFile in $componentPattern) {
    $relativePath = $htmlFile.FullName.Replace((Get-Location).Path, "").TrimStart('\')

    # Check module filters
    if ($IncludeModules.Count -gt 0) {
        $included = $false
        foreach ($module in $IncludeModules) {
            if ($relativePath -match "modules\\$module") {
                $included = $true
                break
            }
        }
        if (-not $included) { continue }
    }

    if ($ExcludeModules.Count -gt 0) {
        $excluded = $false
        foreach ($module in $ExcludeModules) {
            if ($relativePath -match "modules\\$module") {
                $excluded = $true
                break
            }
        }
        if ($excluded) { continue }
    }

    Write-Output "Processing: $relativePath"

    # Process HTML
    $htmlResult = Process-HTMLFile -Path $htmlFile.FullName

    if ($htmlResult.Modified) {
        $stats.HTMLFilesProcessed++
        Write-ColorOutput -ForegroundColor Green "  ✓ HTML updated"

        # Find and process corresponding TS file
        $tsPath = $htmlFile.FullName -replace '\.html$', '.ts'
        if (-not (Test-Path $tsPath)) {
            $tsPath = $htmlFile.FullName -replace '\.component\.html$', '.component.ts'
        }

        if (Test-Path $tsPath) {
            $tsModified = Process-TypeScriptFile -Path $tsPath
            if ($tsModified) {
                $stats.TSFilesProcessed++
                Write-ColorOutput -ForegroundColor Green "  ✓ TypeScript updated"
            }
        } else {
            $stats.Warnings += "No TypeScript file found for: $relativePath"
            Write-ColorOutput -ForegroundColor Yellow "  ⚠ No TypeScript file found"
        }
    }

    if ($htmlResult.NeedsReview) {
        Write-ColorOutput -ForegroundColor Magenta "  ⚠ Manual review needed"
    }
}

# Summary
Write-Output ""
Write-ColorOutput -ForegroundColor Cyan "=========================================="
Write-ColorOutput -ForegroundColor Cyan "  Migration Complete"
Write-ColorOutput -ForegroundColor Cyan "=========================================="
Write-ColorOutput -ForegroundColor Green "TypeScript files updated: $($stats.TSFilesProcessed)"
Write-ColorOutput -ForegroundColor Green "HTML files updated: $($stats.HTMLFilesProcessed)"

if ($stats.Warnings.Count -gt 0) {
    Write-Output ""
    Write-ColorOutput -ForegroundColor Yellow "Warnings: $($stats.Warnings.Count)"
    $stats.Warnings | ForEach-Object { Write-ColorOutput -ForegroundColor Yellow "  - $_" }
}

if ($stats.ManualReviewNeeded.Count -gt 0) {
    Write-Output ""
    Write-ColorOutput -ForegroundColor Magenta "Files needing manual review: $($stats.ManualReviewNeeded.Count)"
    $stats.ManualReviewNeeded | ForEach-Object { Write-ColorOutput -ForegroundColor Magenta "  - $_" }
}

if ($DryRun) {
    Write-Output ""
    Write-ColorOutput -ForegroundColor Yellow "Run without -DryRun to apply changes"
}

Write-Output ""
Write-Output "Next steps:"
Write-Output "1. Review changes: git diff"
Write-Output "2. Check compilation: npm run build"
Write-Output "3. Manual fixes for files marked for review"
Write-Output "4. Test: npm run production"
