#requires -version 5.0
<#
.SYNOPSIS
    Validates the API naming convention changes across the project.

.DESCRIPTION
    This script verifies that:
    - All .API directories have been renamed to .Api
    - All .csproj files use .Api naming
    - All namespaces use .Api format
    - No remaining .API references exist
    - Solution file is correctly updated

.NOTES
    Run this AFTER executing the rename script to verify success.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string]$RootPath = "c:\Users\ifer7\source\repos\AcontPlus"
)

$ErrorActionPreference = "Continue"
$issues = @()
$warnings = @()
$successes = @()

# Color output
function Write-Title {
    param([string]$Message)
    Write-Host "`n$('=' * 80)" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "$('=' * 80)`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
    $script:successes += $Message
}

function Write-Warning2 {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
    $script:warnings += $Message
}

function Write-Error2 {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
    $script:issues += $Message
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Blue
}

# Check for remaining .API directories
function Test-ApiDirectories {
    Write-Title "CHECK 1: Directory Names"

    $apiDirs = Get-ChildItem -Path $RootPath -Directory -Recurse | Where-Object { $_.Name -match "\.API$" }

    if ($apiDirs.Count -gt 0) {
        Write-Error2 "Found $($apiDirs.Count) .API directories still present:"
        foreach ($dir in $apiDirs) {
            Write-Host "  - $($dir.FullName)" -ForegroundColor Red
        }
        return $false
    } else {
        Write-Success "No .API directories found (Good!)"
        return $true
    }
}

# Check for remaining .API.csproj files
function Test-CsprojFiles {
    Write-Title "CHECK 2: Project Files"

    $csprojFiles = Get-ChildItem -Path $RootPath -Filter "*API.csproj" -Recurse

    if ($csprojFiles.Count -gt 0) {
        Write-Error2 "Found $($csprojFiles.Count) .API.csproj files:"
        foreach ($file in $csprojFiles) {
            Write-Host "  - $($file.Name)" -ForegroundColor Red
        }
        return $false
    } else {
        Write-Success "No .API.csproj files found (Good!)"
        return $true
    }
}

# Check namespace declarations
function Test-Namespaces {
    Write-Title "CHECK 3: C# Namespaces"

    $apiNamespaces = Get-ChildItem -Path $RootPath -Filter "*.cs" -Recurse |
        Select-String -Pattern "namespace\s+\w+\.API" -ErrorAction SilentlyContinue

    if ($apiNamespaces) {
        Write-Error2 "Found $($apiNamespaces.Count) files with .API namespace declarations:"
        foreach ($item in $apiNamespaces | Select-Object -Unique -ExpandProperty Path) {
            Write-Host "  - $item" -ForegroundColor Red
        }
        return $false
    } else {
        Write-Success "No .API namespace declarations found (Good!)"
        return $true
    }
}

# Check for remaining .API references in code
function Test-CodeReferences {
    Write-Title "CHECK 4: Code References"

    $apiReferences = Get-ChildItem -Path $RootPath -Filter "*.cs" -Recurse |
        Select-String -Pattern "\.API\." -ErrorAction SilentlyContinue |
        Where-Object { $_.Line -notmatch "^//.*\.API\." } # Exclude comments

    if ($apiReferences.Count -gt 0) {
        Write-Warning2 "Found $($apiReferences.Count) potential .API references in code:"
        foreach ($item in $apiReferences | Select-Object -First 10) {
            Write-Host "  - $($item.Path): $($item.Line.Trim())" -ForegroundColor Yellow
        }
        if ($apiReferences.Count -gt 10) {
            Write-Warning2 "  ... and $($apiReferences.Count - 10) more"
        }
        return $false
    } else {
        Write-Success "No .API code references found (Good!)"
        return $true
    }
}

# Check .csproj project references
function Test-ProjectReferences {
    Write-Title "CHECK 5: Project References"

    $badReferences = Get-ChildItem -Path $RootPath -Filter "*.csproj" -Recurse |
        Select-String -Pattern "API.*\.csproj" -ErrorAction SilentlyContinue

    if ($badReferences) {
        Write-Warning2 "Found potential outdated project references:"
        foreach ($item in $badReferences | Select-Object -Unique -ExpandProperty Path) {
            Write-Host "  - $item" -ForegroundColor Yellow
        }
        return $false
    } else {
        Write-Success "No outdated .API project references found (Good!)"
        return $true
    }
}

# Check solution file
function Test-SlnFile {
    Write-Title "CHECK 6: Solution File"

    $slnFile = Join-Path -Path $RootPath -ChildPath "AcontPlus.sln"

    if (-not (Test-Path -Path $slnFile)) {
        Write-Error2 "Solution file not found: $slnFile"
        return $false
    }

    $slnContent = Get-Content -Path $slnFile -Raw

    # Check for .API references in solution
    if ($slnContent -match '\.API[\\"]') {
        Write-Error2 "Found .API references in solution file"
        return $false
    } else {
        Write-Success "Solution file updated correctly (Good!)"
        return $true
    }
}

# Check for expected .Api directories
function Test-ApiDirectoriesExist {
    Write-Title "CHECK 7: Expected .Api Directories"

    $expectedDirs = @(
        "Accounting.Api", "BarberShop.Api", "Billing.Api", "Common.Api",
        "Configuration.Api", "Identity.Api", "Inventory.Api", "Loyalty.Api",
        "Mechanical.Api", "Ocelot.Api", "Purchases.Api", "Restaurant.Api",
        "Sales.Api", "TechnicalSupport.Api", "Vet.Api"
    )

    $found = 0
    foreach ($dirName in $expectedDirs) {
        $paths = Get-ChildItem -Path $RootPath -Directory -Recurse | Where-Object { $_.Name -eq $dirName }
        if ($paths) {
            $found++
            Write-Success "Found: $dirName"
        } else {
            Write-Warning2 "Missing: $dirName"
        }
    }

    Write-Info "Found $found/$($expectedDirs.Count) expected .Api directories"
    return ($found -eq $expectedDirs.Count)
}

# Validate build
function Test-BuildValidity {
    Write-Title "CHECK 8: Build Validation"

    Write-Info "Attempting to validate solution structure..."

    $slnFile = Join-Path -Path $RootPath -ChildPath "AcontPlus.sln"
    $csprojFiles = Get-ChildItem -Path $RootPath -Filter "*.csproj" -Recurse

    Write-Info "Found $($csprojFiles.Count) total project files"

    # Check for orphaned project references
    $orphaned = 0
    foreach ($csproj in $csprojFiles) {
        try {
            $content = Get-Content -Path $csproj.FullName
            $projectRefs = $content | Select-String -Pattern '<ProjectReference Include="([^"]+)"' |
                ForEach-Object { $_.Matches[0].Groups[1].Value }

            foreach ($ref in $projectRefs) {
                $refPath = Join-Path -Path $csproj.Directory.FullName -ChildPath $ref -Resolve -ErrorAction SilentlyContinue
                if (-not $refPath) {
                    $orphaned++
                    Write-Warning2 "Orphaned reference in $($csproj.Name): $ref"
                }
            }
        } catch {
            # Skip files that can't be parsed
        }
    }

    if ($orphaned -eq 0) {
        Write-Success "No orphaned project references found (Good!)"
        return $true
    } else {
        Write-Warning2 "Found $orphaned orphaned project references"
        return $false
    }
}

# Generate summary report
function Generate-ValidationReport {
    Write-Title "VALIDATION SUMMARY"

    $report = @"
================================================================================
API NAMING VALIDATION REPORT
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
================================================================================

CHECKS PERFORMED: 8

SUCCESSES: $($script:successes.Count)
WARNINGS:  $($script:warnings.Count)
ISSUES:    $($script:issues.Count)

================================================================================
DETAILED RESULTS:
================================================================================

"@

    if ($script:successes.Count -gt 0) {
        $report += "`nSUCCESSES:`n"
        $script:successes | ForEach-Object { $report += "  ✓ $_`n" }
    }

    if ($script:warnings.Count -gt 0) {
        $report += "`nWARNINGS:`n"
        $script:warnings | ForEach-Object { $report += "  ⚠ $_`n" }
    }

    if ($script:issues.Count -gt 0) {
        $report += "`nISSUES FOUND:`n"
        $script:issues | ForEach-Object { $report += "  ✗ $_`n" }
    }

    $report += @"
================================================================================
RECOMMENDATIONS:
================================================================================

"@

    if ($script:issues.Count -gt 0) {
        $report += @"
⚠ CRITICAL: Issues found that require attention!
  1. Review all items marked with ✗
  2. Re-run the rename script if needed
  3. Manually fix any remaining .API references

"@
    }

    if ($script:warnings.Count -gt 0) {
        $report += @"
⚠ WARNING: Some items need review
  1. Review all items marked with ⚠
  2. Verify manually if corrections are needed
  3. Update documentation if necessary

"@
    }

    $report += @"
NEXT STEPS:
  1. Run 'dotnet clean && dotnet build' to verify compilation
  2. Run 'dotnet test' to verify functionality
  3. Review git diff for unexpected changes
  4. Commit when satisfied with results

================================================================================
VALIDATION COMPLETE
================================================================================
"@

    Write-Host $report

    $reportFile = Join-Path -Path $RootPath -ChildPath "scripts\API-Validation-Report.txt"
    $report | Out-File -FilePath $reportFile -Encoding UTF8
    Write-Info "Report saved to: scripts\API-Validation-Report.txt"
}

# Main execution
function Main {
    Write-Host "`nStarting API Naming Validation..." -ForegroundColor Cyan
    Write-Host "Root Path: $RootPath`n" -ForegroundColor Cyan

    # Run all tests
    $results = @()
    $results += Test-ApiDirectories
    $results += Test-CsprojFiles
    $results += Test-Namespaces
    $results += Test-CodeReferences
    $results += Test-ProjectReferences
    $results += Test-SlnFile
    $results += Test-ApiDirectoriesExist
    $results += Test-BuildValidity

    # Generate report
    Generate-ValidationReport

    # Final verdict
    Write-Title "VALIDATION RESULT"

    if ($script:issues.Count -eq 0 -and $script:warnings.Count -eq 0) {
        Write-Host "✓ ALL VALIDATIONS PASSED! Ready for build and testing." -ForegroundColor Green
        exit 0
    } elseif ($script:issues.Count -eq 0) {
        Write-Host "⚠ VALIDATION PASSED WITH WARNINGS. Review recommended items above." -ForegroundColor Yellow
        exit 0
    } else {
        Write-Host "✗ VALIDATION FAILED! $($script:issues.Count) issue(s) found." -ForegroundColor Red
        exit 1
    }
}

# Execute
Main
