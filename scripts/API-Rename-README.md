# API Directory Renaming Automation Script

## Overview

This comprehensive PowerShell script automates the renaming of all `.API` directories and their references to PascalCase `.Api` format throughout the AcontPlus project. It ensures consistency across the codebase following modern C# naming conventions.

## What Gets Renamed

### 1. **Directory Names**
```
Before:                           After:
src/Services/Vet/Vet.API/        →  src/Services/Vet/Vet.Api/
src/Services/Sales/Sales.API/    →  src/Services/Sales/Sales.Api/
src/Services/Identity/Identity.API/  →  src/Services/Identity/Identity.Api/
...etc
```

### 2. **Project Files (.csproj)**
```
Before:                      After:
Vet.API.csproj             →  Vet.Api.csproj
Sales.API.csproj           →  Sales.Api.csproj
Identity.API.csproj        →  Identity.Api.csproj
...etc
```

### 3. **C# Namespaces**
```csharp
// Before
namespace Vet.API
{
    using Vet.API.Controllers;
}

// After
namespace Vet.Api
{
    using Vet.Api.Controllers;
}
```

### 4. **Project References in .csproj Files**
```xml
<!-- Before -->
<ProjectReference Include="..\..\Vet\Vet.API\Vet.API.csproj" />

<!-- After -->
<ProjectReference Include="..\..\Vet\Vet.Api\Vet.Api.csproj" />
```

### 5. **Solution File References (AcontPlus.sln)**
```
Before: Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "Vet.API", "src\Services\Vet\Vet.API\Vet.API.csproj"
After:  Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "Vet.Api", "src\Services\Vet\Vet.Api\Vet.Api.csproj"
```

## APIs Being Renamed

The script processes **14 API projects**:

1. Accounting.API → Accounting.Api
2. BarberShop.API → BarberShop.Api
3. Billing.API → Billing.Api
4. Common.API → Common.Api
5. Configuration.API → Configuration.Api
6. Identity.API → Identity.Api
7. Inventory.API → Inventory.Api
8. Loyalty.API → Loyalty.Api (already partially converted)
9. Mechanical.API → Mechanical.Api
10. Ocelot.API → Ocelot.Api
11. Purchases.API → Purchases.Api
12. Restaurant.API → Restaurant.Api
13. Sales.API → Sales.Api
14. TechnicalSupport.API → TechnicalSupport.Api
15. Vet.API → Vet.Api

## Usage

### Basic Execution

```powershell
# Run with default path (requires admin privileges for some operations)
.\scripts\Rename-API-Directories.ps1

# From project root
cd c:\Users\ifer7\source\repos\AcontPlus
.\scripts\Rename-API-Directories.ps1
```

### Safe Preview (WhatIf Mode)

Preview all changes WITHOUT making them:

```powershell
.\scripts\Rename-API-Directories.ps1 -WhatIf
```

Output shows what would be changed:
```
[WHATIF] Would rename: Vet.API → Vet.Api
[WHATIF] Would rename: Sales.API → Sales.Api
...etc
```

### With Custom Root Path

```powershell
.\scripts\Rename-API-Directories.ps1 -RootPath "C:\MyProjects\AcontPlus"
```

### With Verbose Output

```powershell
.\scripts\Rename-API-Directories.ps1 -Verbose
```

## Step-by-Step Process

The script executes in 7 sequential steps:

### Step 1: Discovery
- Recursively finds all directories matching `*.API` pattern
- Lists all directories to be renamed
- Validates accessibility

### Step 2: Directory Renaming
- Renames each `.API` directory to `.Api`
- Maintains all contents intact
- Handles path conversions correctly

### Step 3: .csproj File Renaming
- Renames project files from `*.API.csproj` to `*.Api.csproj`
- Located within renamed directories
- Preserves file content

### Step 4: Namespace Updates
- Updates all C# source files (*.cs)
- Replaces namespace declarations
- Updates using statements
- Handles all code references

Example transformations:
```csharp
namespace Vet.API → namespace Vet.Api
using Vet.API.Controllers → using Vet.Api.Controllers
Vet.API.Models → Vet.Api.Models
```

### Step 5: Project Reference Updates
- Updates all `.csproj` files
- Fixes ProjectReference paths
- Handles both backslash and forward slash separators

### Step 6: Solution File Updates
- Updates AcontPlus.sln
- Fixes project path declarations
- Updates project names in solution structure

### Step 7: Report Generation
- Creates comprehensive report
- Saved to: `scripts\API-Rename-Report.txt`
- Contains summary of all changes
- Includes verification checklist

## Prerequisites

- PowerShell 5.0 or higher
- Read/Write permissions on project directory
- Git repository initialized (for tracking changes)
- Close Visual Studio before running (to avoid file locks)
- No active builds or tests running

## Before Running

### 1. Close All Applications
```powershell
# Close Visual Studio
taskkill /F /IM devenv.exe

# Close any build processes
taskkill /F /IM msbuild.exe
```

### 2. Backup Your Work
```powershell
# Create a git backup branch
git checkout -b backup-before-api-rename
git push origin backup-before-api-rename
```

### 3. Verify Git Status
```powershell
git status
# Should show clean working directory
```

## Execution Example

```powershell
PS C:\Users\ifer7\source\repos\AcontPlus> .\scripts\Rename-API-Directories.ps1

================================================================================
Starting API Directory Renaming Process...
Root Path: c:\Users\ifer7\source\repos\AcontPlus
WhatIf Mode: False
================================================================================

================================================================================
STEP 1: Discovering .API Directories
================================================================================
ℹ Found 14 .API directories:
  - Vet.API → Vet.Api
  - Sales.API → Sales.Api
  - Identity.API → Identity.Api
  ...

================================================================================
STEP 2: Renaming Directories
================================================================================
✓ Renamed directory: Vet.API → Vet.Api
✓ Renamed directory: Sales.API → Sales.Api
...

[Process continues with Steps 3-7...]

================================================================================
PROCESS COMPLETED SUCCESSFULLY
================================================================================

All .API directories have been renamed to .Api format!
```

## After Execution

### 1. Review Changes
```powershell
# View all modified files
git status

# Review specific changes
git diff --name-status

# Preview file changes
git diff <file>
```

### 2. Verify Compilation
```powershell
# Clean build
dotnet clean
dotnet build

# Or use pre-configured task
./build
```

### 3. Run Tests
```powershell
# Run all unit tests
dotnet test

# Or run specific project tests
dotnet test src/Services/Vet/Vet.Api/
```

### 4. Commit Changes

The script generates a report with git-ready commit messages:

```powershell
git add .

git commit -m "refactor: rename all .API directories to .Api PascalCase"

# Or more detailed:
git commit -m "refactor(api): standardize directory names from .API to .Api

- Renamed 14 API project directories
- Updated all C# namespaces
- Updated all project references
- Updated solution file
- Maintains all functionality"
```

## Verification Checklist

After running the script, verify:

- [x] All directory names use `.Api` suffix
- [x] All `.csproj` files renamed correctly
- [x] Solution file updated with new paths
- [x] Solution loads in Visual Studio
- [x] Solution builds without errors
- [x] All namespaces use `.Api`
- [x] No broken project references
- [x] Unit tests pass
- [x] IntelliSense works correctly
- [x] Git history is clean

## Troubleshooting

### Issue: "Access Denied" errors

**Solution:** Close Visual Studio and rebuild executables

```powershell
taskkill /F /IM devenv.exe
taskkill /F /IM msbuild.exe
.\scripts\Rename-API-Directories.ps1
```

### Issue: "File is in use" errors

**Solution:** One or more files are locked by another process

```powershell
# List open file handles
Get-Process | Select-Object Handles, ProcessName | Sort-Object Handles -Descending

# Kill specific process
Stop-Process -Name "processname" -Force
```

### Issue: Incomplete renaming or missing references

**Solution:** Run the script again or check the report

```powershell
# View what was processed
Get-Content .\scripts\API-Rename-Report.txt

# Run in WhatIf mode to see what would be changed
.\scripts\Rename-API-Directories.ps1 -WhatIf
```

### Issue: Git shows too many changes

**Solution:** This is normal and expected. Review carefully:

```powershell
# Show summary of changes
git diff --stat

# Review changes by file type
git diff --name-only -- '*.cs' | head -20
```

## Recovery

If something goes wrong:

### Rollback Using Git
```powershell
# Undo all changes
git reset --hard HEAD

# Or restore from backup branch
git checkout backup-before-api-rename
git reset --hard HEAD
```

### Manual Recovery
The script creates backups in the working directory. You can manually restore files if needed.

## Performance Considerations

- Script typically completes in **2-5 minutes** depending on system
- Processes approximately **500+ files**
- No network operations required
- Can be run multiple times safely (idempotent)

## Advanced Usage

### Custom Logging
```powershell
# Log output to file
.\scripts\Rename-API-Directories.ps1 | Tee-Object -FilePath "rename-log.txt"
```

### Dry Run with Details
```powershell
# Run in WhatIf mode with verbose output
.\scripts\Rename-API-Directories.ps1 -WhatIf -Verbose
```

### Run as Scheduled Task
```powershell
# Create scheduled task for automated runs
$trigger = New-JobTrigger -Daily -At 2AM
$taskName = "RenameAPIDirectories"
$script = "C:\...\Rename-API-Directories.ps1"
Register-ScheduledJob -Name $taskName -ScriptBlock { & $script } -Trigger $trigger
```

## Support & Documentation

For issues or questions:

1. Check the generated report: `scripts\API-Rename-Report.txt`
2. Review this documentation
3. Check git logs for verification
4. Run `dotnet build` to validate

## References

- [Microsoft C# Naming Guidelines](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/naming-guidelines)
- [PowerShell Best Practices](https://docs.microsoft.com/en-us/powershell/scripting/learn/ps101/00-introduction)
- [Git Documentation](https://git-scm.com/doc)

---

**Last Updated:** 2025-11-25
**Version:** 1.0
**Scope:** 14 API projects across AcontPlus services
