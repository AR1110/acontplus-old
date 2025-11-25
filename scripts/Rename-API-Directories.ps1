#requires -version 5.0
<#
.SYNOPSIS
    Automates renaming of all .API directories and references to .Api (PascalCase) format.

.DESCRIPTION
    This script recursively renames:
    - Directory names from *.API to *.Api
    - .csproj file names from *.API.csproj to *.Api.csproj
    - Namespace declarations in C# files
    - Project references in solution file (.sln)
    - ProjectReference entries in .csproj files
    - All internal namespace usages

.NOTES
    Author: Automation Script
    Date: 2025
    Requires: PowerShell 5.0 or higher
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string]$RootPath = "c:\Users\ifer7\source\repos\AcontPlus",

    [Parameter(Mandatory=$false)]
    [switch]$WhatIf = $false
)$ErrorActionPreference = "Stop"

# Color output
function Write-Title {
    param([string]$Message)
    Write-Host "`n" -ForegroundColor Cyan
    Write-Host "=" * 80 -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "=" * 80 -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning2 {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error2 {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Blue
}

# Find all .API directories
function Get-ApiDirectories {
    param([string]$SearchPath)

    Write-Title "STEP 1: Discovering .API Directories"

    $apiDirs = @()
    # Case-insensitive match for .API or .Api directories
    $dirs = Get-ChildItem -Path $SearchPath -Directory -Recurse | Where-Object { $_.Name -match "\.API$|\.Api$" }

    foreach ($dir in $dirs) {
        # Only rename if currently ends with .API (uppercase)
        if ($dir.Name -match "\.API$") {
            $apiDirs += @{
                OldPath = $dir.FullName
                OldName = $dir.Name
                NewName = $dir.Name -replace "\.API$", ".Api"
                NewPath = Join-Path -Path $dir.Parent.FullName -ChildPath ($dir.Name -replace "\.API$", ".Api")
            }
        }
    }

    Write-Info "Found $($apiDirs.Count) .API directories to rename:"
    foreach ($dir in $apiDirs) {
        Write-Host "  - $($dir.OldName) → $($dir.NewName)"
    }

    return $apiDirs
}

# Rename directories
function Rename-ApiDirectories {
    param([array]$Directories)

    Write-Title "STEP 2: Renaming Directories"

    foreach ($dir in $Directories) {
        # Skip if already renamed (case-sensitive check)
        if ($dir.OldName -ceq $dir.NewName) {
            Write-Info "Skipping (already correct): $($dir.OldName)"
            continue
        }

        if (Test-Path -Path $dir.OldPath) {
            try {
                if ($WhatIf) {
                    Write-Info "[WHATIF] Would rename: $($dir.OldPath) → $($dir.NewPath)"
                } else {
                    Rename-Item -Path $dir.OldPath -NewName $dir.NewName -Force
                    Write-Success "Renamed directory: $($dir.OldName) → $($dir.NewName)"
                }
            } catch {
                Write-Warning "Failed to rename directory $($dir.OldPath): $_. Skipping..."
                continue
            }
        }
    }
}

# Rename .csproj files
function Rename-CsprojFiles {
    param([array]$Directories)

    Write-Title "STEP 3: Renaming .csproj Files"

    foreach ($dir in $Directories) {
        # Skip if already renamed (case-sensitive check)
        if ($dir.OldName -ceq $dir.NewName) {
            continue
        }

        $oldCsproj = Join-Path -Path $dir.NewPath -ChildPath "$($dir.OldName).csproj"
        $newCsproj = Join-Path -Path $dir.NewPath -ChildPath "$($dir.NewName).csproj"

        if (Test-Path -Path $oldCsproj) {
            try {
                if ($WhatIf) {
                    Write-Info "[WHATIF] Would rename: $($dir.OldName).csproj → $($dir.NewName).csproj"
                } else {
                    Rename-Item -Path $oldCsproj -NewName "$($dir.NewName).csproj" -Force
                    Write-Success "Renamed csproj: $($dir.OldName).csproj → $($dir.NewName).csproj"
                }
            } catch {
                Write-Error2 "Failed to rename csproj file: $_"
                throw
            }
        }
    }
}

# Update namespace in C# files
function Update-Namespaces {
    param([array]$Directories)

    Write-Title "STEP 4: Updating C# Namespaces and Code"

    $searchPatterns = @("*.cs", "*.csproj", "*.sln")

    foreach ($dir in $Directories) {
        # Extract service name from path (e.g., from src/Services/Vet/Vet.Api)
        $serviceName = $dir.OldName -replace "\.API$", ""

        # Search in the specific service directory
        $serviceRoot = Split-Path -Path $dir.NewPath -Parent

        # Update all C# files in this service
        $csFiles = Get-ChildItem -Path $serviceRoot -Filter "*.cs" -Recurse

        foreach ($file in $csFiles) {
            try {
                $content = Get-Content -Path $file.FullName -Raw
                $originalContent = $content

                # Replace namespace declarations and usages
                $content = $content -replace "namespace $($serviceName)\.API", "namespace $($serviceName).Api"
                $content = $content -replace "using $($serviceName)\.API", "using $($serviceName).Api"
                $content = $content -replace "$($serviceName)\.API\.", "$($serviceName).Api."

                # Only write if content changed
                if ($content -ne $originalContent) {
                    if ($WhatIf) {
                        Write-Info "[WHATIF] Would update namespaces in: $($file.Name)"
                    } else {
                        Set-Content -Path $file.FullName -Value $content -Force
                        Write-Success "Updated namespaces in: $($file.Name)"
                    }
                }
            } catch {
                Write-Warning2 "Could not update file $($file.FullName): $_"
            }
        }
    }
}

# Update project references in .csproj files
function Update-ProjectReferences {
    param([array]$Directories)

    Write-Title "STEP 5: Updating Project References in .csproj Files"

    $allCsprojFiles = Get-ChildItem -Path $RootPath -Filter "*.csproj" -Recurse

    foreach ($csproj in $allCsprojFiles) {
        try {
            $content = Get-Content -Path $csproj.FullName -Raw
            $originalContent = $content

            foreach ($dir in $Directories) {
                $serviceName = $dir.OldName -replace "\.API$", ""

                # Update ProjectReference paths
                $oldRef = "$($serviceName)\$($dir.OldName)\$($dir.OldName).csproj"
                $newRef = "$($serviceName)\$($dir.NewName)\$($dir.NewName).csproj"
                $content = $content -replace [regex]::Escape($oldRef), $newRef

                # Also handle variations with different separators
                $oldRef2 = "$($serviceName)/$($dir.OldName)/$($dir.OldName).csproj"
                $newRef2 = "$($serviceName)/$($dir.NewName)/$($dir.NewName).csproj"
                $content = $content -replace [regex]::Escape($oldRef2), $newRef2
            }

            if ($content -ne $originalContent) {
                if ($WhatIf) {
                    Write-Info "[WHATIF] Would update project references in: $($csproj.Name)"
                } else {
                    Set-Content -Path $csproj.FullName -Value $content -Force -Encoding UTF8
                    Write-Success "Updated project references in: $($csproj.Name)"
                }
            }
        } catch {
            Write-Warning2 "Could not update references in $($csproj.FullName): $_"
        }
    }
}

# Update .sln file
function Update-SlnFile {
    param([array]$Directories)

    Write-Title "STEP 6: Updating Solution File (.sln)"

    $slnFile = Join-Path -Path $RootPath -ChildPath "AcontPlus.sln"

    if (Test-Path -Path $slnFile) {
        try {
            $content = Get-Content -Path $slnFile -Raw
            $originalContent = $content

            foreach ($dir in $Directories) {
                $serviceName = $dir.OldName -replace "\.API$", ""

                # Update project declarations
                $oldProject = "`"$($serviceName)\$($dir.OldName)\$($dir.OldName).csproj`""
                $newProject = "`"$($serviceName)\$($dir.NewName)\$($dir.NewName).csproj`""
                $content = $content -replace [regex]::Escape($oldProject), $newProject

                # Update project names in declarations
                $content = $content -replace "`"= `"$($dir.OldName)`"`"", "`"= `"$($dir.NewName)`"`""
            }            if ($content -ne $originalContent) {
                if ($WhatIf) {
                    Write-Info "[WHATIF] Would update solution file: AcontPlus.sln"
                } else {
                    Set-Content -Path $slnFile -Value $content -Force -Encoding UTF8
                    Write-Success "Updated solution file: AcontPlus.sln"
                }
            }
        } catch {
            Write-Error2 "Failed to update solution file: $_"
            throw
        }
    }
}

# Generate report
function Generate-Report {
    param([array]$Directories)

    Write-Title "STEP 7: Renaming Summary Report"

    $reportFile = Join-Path -Path $RootPath -ChildPath "scripts\API-Rename-Report.txt"

    $report = @"
=============================================================================
API DIRECTORY RENAMING REPORT
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
=============================================================================

DIRECTORIES RENAMED:
$($Directories | ForEach-Object { "`n  $($_.OldName) → $($_.NewName)`n  Path: $($_.NewPath)" } | Out-String)

CSPROJ FILES RENAMED:
$($Directories | ForEach-Object { "`n  $($_.OldName).csproj → $($_.NewName).csproj" } | Out-String)

FILES UPDATED:
- C# source files with namespace declarations
- .csproj project files with project references
- Solution file (AcontPlus.sln)

NAMESPACES UPDATED:
$($Directories | ForEach-Object {
    $serviceName = $_.OldName -replace "\.API$", ""
    "`n  namespace $($serviceName).API → namespace $($serviceName).Api"
} | Out-String)

PROJECT REFERENCES UPDATED:
$($Directories | ForEach-Object {
    "`n  Path updated from $($_.OldName) to $($_.NewName)"
} | Out-String)

=============================================================================
NEXT STEPS:
1. Review all changes using git diff
2. Rebuild solution: dotnet build
3. Run unit tests to verify functionality
4. Commit changes with appropriate message

VERIFICATION CHECKLIST:
□ All directory names use .Api suffix
□ All .csproj files renamed correctly
□ Solution builds without errors
□ All namespaces use .Api
□ No broken project references
□ Git commits are clean
=============================================================================
"@

    if (-not $WhatIf) {
        $report | Out-File -FilePath $reportFile -Encoding UTF8
        Write-Success "Report saved to: scripts\API-Rename-Report.txt"
    }

    Write-Host $report
}

# Main execution
function Main {
    try {
        Write-Host "`nStarting API Directory Renaming Process..." -ForegroundColor Cyan
        Write-Host "Root Path: $RootPath" -ForegroundColor Cyan
        Write-Host "WhatIf Mode: $($WhatIf.IsPresent)" -ForegroundColor Cyan

        # Get all .API directories
        $apiDirs = Get-ApiDirectories -SearchPath $RootPath

        if ($apiDirs.Count -eq 0) {
            Write-Error2 "No .API directories found!"
            return
        }

        # Execute renaming steps
        if ($WhatIf) {
            Write-Title "WHATIF MODE: No changes will be made"
        }

        Rename-ApiDirectories -Directories $apiDirs
        Rename-CsprojFiles -Directories $apiDirs
        Update-Namespaces -Directories $apiDirs
        Update-ProjectReferences -Directories $apiDirs
        Update-SlnFile -Directories $apiDirs
        Generate-Report -Directories $apiDirs

        Write-Title "PROCESS COMPLETED SUCCESSFULLY"
        Write-Host "`nAll .API directories have been renamed to .Api format!`n" -ForegroundColor Green

    } catch {
        Write-Error2 "PROCESS FAILED: $_"
        Write-Error2 "Stack Trace: $($_.ScriptStackTrace)"
        exit 1
    }
}

# Execute
Main
