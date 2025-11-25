# API Directory Renaming - Complete Implementation Package

## 📋 Overview

This package contains complete automation for renaming all `.API` directories to `.Api` (PascalCase) throughout the AcontPlus project, ensuring modern C# naming conventions.

**Total Projects Affected:** 15 API services
**Estimated Execution Time:** 2-5 minutes
**Files to be Modified:** 500+ files

---

## 📦 What's Included

### 1. **Rename-API-Directories.ps1** - Main Automation Script
- **Purpose:** Core renaming engine
- **Features:**
  - Renames 15 API directories from `.API` to `.Api`
  - Renames all `.csproj` files
  - Updates all C# namespaces
  - Updates project references
  - Updates solution file
  - Generates detailed report
- **Usage:**
  ```powershell
  .\scripts\Rename-API-Directories.ps1          # Execute
  .\scripts\Rename-API-Directories.ps1 -WhatIf  # Preview only
  ```

### 2. **Validate-API-Rename.ps1** - Validation Script
- **Purpose:** Verify successful renaming
- **Validates:**
  - No `.API` directories remain
  - No `.API.csproj` files remain
  - No `.API` namespace declarations remain
  - No `.API` code references remain
  - All `.Api` directories exist
  - Project references are valid
- **Usage:**
  ```powershell
  .\scripts\Validate-API-Rename.ps1
  ```

### 3. **Run-API-Rename.bat** - Workflow Automation
- **Purpose:** Interactive guided workflow
- **Menu Options:**
  1. Preview changes
  2. Execute rename
  3. Validate results
  4. Build solution
  5. Run tests
  6. Commit changes
  7. View documentation
- **Usage:**
  ```cmd
  scripts\Run-API-Rename.bat
  ```

### 4. **API-Rename-README.md** - Complete Documentation
- **Contents:**
  - Detailed overview
  - Step-by-step process
  - Prerequisites
  - Troubleshooting
  - Recovery procedures
  - Advanced usage
- **Target Audience:** Technical team members

### 5. **QUICK-START.md** - Quick Reference
- **Contents:**
  - TL;DR commands
  - Pre-flight checklist
  - Run options
  - Quick troubleshooting table
- **Target Audience:** Quick reference for experienced users

### 6. **This File (Implementation Summary)**
- Overview of all components
- Getting started guide
- Architecture notes

---

## 🚀 Getting Started (5 minutes)

### Step 1: Prepare (2 minutes)
```powershell
# Close Visual Studio
taskkill /F /IM devenv.exe

# Navigate to project
cd c:\Users\ifer7\source\repos\AcontPlus

# Create backup branch
git checkout -b backup-api-rename
git push origin backup-api-rename

# Check status
git status  # Should be clean
```

### Step 2: Preview Changes (1 minute)
```powershell
# See what will be changed WITHOUT making changes
.\scripts\Rename-API-Directories.ps1 -WhatIf
```

### Step 3: Execute Rename (2 minutes)
```powershell
# Run the actual rename
.\scripts\Rename-API-Directories.ps1

# Check the report
Get-Content .\scripts\API-Rename-Report.txt
```

---

## 🔍 What Gets Changed

### Directories (15 total)
```
Accounting.API          → Accounting.Api
BarberShop.API          → BarberShop.Api
Billing.API             → Billing.Api
Common.API              → Common.Api
Configuration.API       → Configuration.Api
Identity.API            → Identity.Api
Inventory.API           → Inventory.Api
Loyalty.API             → Loyalty.Api
Mechanical.API          → Mechanical.Api
Ocelot.API              → Ocelot.Api
Purchases.API           → Purchases.Api
Restaurant.API          → Restaurant.Api
Sales.API               → Sales.Api
TechnicalSupport.API    → TechnicalSupport.Api
Vet.API                 → Vet.Api
```

### File Types Modified
- **C# Source Files (*.cs)**
  - Namespace declarations
  - Using statements
  - Code references

- **Project Files (*.csproj)**
  - File names
  - ProjectReference paths
  - Project names

- **Solution Files (*.sln)**
  - Project paths
  - Project declarations

---

## 📊 Architecture & Design

### Script Workflow

```
Start
  ↓
Step 1: Discover .API directories
  ↓
Step 2: Rename directories
  ↓
Step 3: Rename .csproj files
  ↓
Step 4: Update C# namespaces
  ↓
Step 5: Update project references
  ↓
Step 6: Update solution file
  ↓
Step 7: Generate report
  ↓
End
```

### Key Design Decisions

1. **Non-Destructive:** All changes tracked by git for easy rollback
2. **Incremental:** Each step can be verified before proceeding
3. **Idempotent:** Script can be run multiple times safely
4. **Well-Documented:** Comprehensive logging and reporting
5. **User-Friendly:** Interactive menu for non-technical users

### Safety Features

- WhatIf mode for preview
- Validation script to verify
- Backup branch creation recommended
- Detailed error reporting
- Easy rollback with git

---

## ✅ Verification Checklist

### Before Execution
- [ ] Visual Studio is closed
- [ ] All work is committed
- [ ] Backup branch created
- [ ] Git status is clean
- [ ] No build processes running

### After Execution
- [ ] Script completed without errors
- [ ] Report file generated
- [ ] Git shows expected changes: `git status`
- [ ] Validation script passes: `.\scripts\Validate-API-Rename.ps1`
- [ ] Solution builds: `dotnet build`
- [ ] Tests pass: `dotnet test`
- [ ] No broken references

---

## 🔧 Common Operations

### Preview All Changes
```powershell
.\scripts\Rename-API-Directories.ps1 -WhatIf
```

### Execute Rename
```powershell
.\scripts\Rename-API-Directories.ps1
```

### Validate Results
```powershell
.\scripts\Validate-API-Rename.ps1
```

### Build and Test
```powershell
dotnet clean
dotnet build
dotnet test
```

### Commit Changes
```powershell
git add .
git commit -m "refactor: rename .API dirs to .Api PascalCase"
git push origin main
```

### Rollback if Needed
```powershell
git reset --hard HEAD
git checkout backup-api-rename
```

---

## 🐛 Troubleshooting

### Issue: "Access Denied" or "File locked"
```powershell
# Kill Visual Studio
taskkill /F /IM devenv.exe
taskkill /F /IM msbuild.exe

# Try again
.\scripts\Rename-API-Directories.ps1
```

### Issue: Script shows .API directories still exist
```powershell
# Run validation script
.\scripts\Validate-API-Rename.ps1

# Check what's in those directories
Get-ChildItem "path/to/directory" -Recurse | Select-Object FullName
```

### Issue: Build fails after rename
```powershell
# Full clean rebuild
dotnet clean
dotnet build --noIncremental

# If still fails, check:
git diff --stat  # See all changes
git diff -- '*.csproj' | head -50  # Check project file changes
```

### Issue: Want to undo everything
```powershell
# Option 1: Using git
git reset --hard HEAD
git checkout backup-api-rename

# Option 2: Delete and restore
rm -r *
git restore .
```

---

## 📈 Performance Notes

- **Execution Time:** 2-5 minutes (depends on disk speed)
- **Files Processed:** ~500+ files
- **Directories Renamed:** 15 (plus subdirectories)
- **Network Required:** No
- **External Dependencies:** None

---

## 📚 Documentation Files

### For Quick Reference
- **QUICK-START.md** (2-3 min read)
  - Essential commands only
  - Troubleshooting table
  - Time estimates

### For Complete Understanding
- **API-Rename-README.md** (15-20 min read)
  - Detailed process explanation
  - All options and modes
  - Advanced usage
  - Recovery procedures

### Generated Reports
- **API-Rename-Report.txt** (auto-generated)
  - What was actually changed
  - Summary of operations
  - Verification checklist

- **API-Validation-Report.txt** (auto-generated)
  - Validation results
  - Issues found (if any)
  - Recommendations

---

## 🎯 Success Criteria

After running the script, all of these must be true:

✓ All .API directories renamed to .Api
✓ All .csproj files renamed
✓ All namespaces updated to .Api
✓ Solution file updated
✓ No .API references remain
✓ Solution builds successfully
✓ All tests pass
✓ Git diff shows only expected changes

---

## 🔐 Backup & Recovery

### Automatic Backup
- Git tracks all changes automatically
- Create backup branch: `git branch backup-api-rename`
- View changes: `git diff`

### Recovery Options
1. **Git reset:** `git reset --hard HEAD`
2. **Branch restore:** `git checkout backup-api-rename`
3. **Selective undo:** `git restore <specific-file>`

---

## 📞 Support

For issues:

1. **Check documentation:**
   - QUICK-START.md for quick answers
   - API-Rename-README.md for detailed info

2. **Check generated reports:**
   - API-Rename-Report.txt after execution
   - API-Validation-Report.txt after validation

3. **Manual verification:**
   ```powershell
   # See what changed
   git status
   git diff --stat

   # Check for remaining issues
   Get-ChildItem -Recurse | Where-Object { $_.Name -match "\.API$" }
   ```

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-25 | Initial release with all features |

---

## 🎓 Learning Resources

- [PowerShell Documentation](https://docs.microsoft.com/powershell)
- [C# Naming Guidelines](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/naming-guidelines)
- [Git Documentation](https://git-scm.com/doc)
- [Microsoft C# Best Practices](https://docs.microsoft.com/en-us/archive/msdn-magazine/2017/may/csharp-declaration-expressions-in-c-7)

---

## ⚖️ License & Attribution

**Scope:** AcontPlus Project
**Created:** 2025-11-25
**Purpose:** Standardize API project naming to modern conventions

---

## 🚦 Quick Command Reference

```powershell
# All commands as quick copy-paste

# 1. Prepare
taskkill /F /IM devenv.exe
cd c:\Users\ifer7\source\repos\AcontPlus
git checkout -b backup-api-rename

# 2. Preview
.\scripts\Rename-API-Directories.ps1 -WhatIf

# 3. Execute
.\scripts\Rename-API-Directories.ps1

# 4. Validate
.\scripts\Validate-API-Rename.ps1

# 5. Build & Test
dotnet clean
dotnet build
dotnet test

# 6. Commit
git add .
git commit -m "refactor: rename .API dirs to .Api PascalCase"
git push origin main
```

---

**Status:** ✅ Ready for Use
**Last Updated:** 2025-11-25
**Compatibility:** Windows PowerShell 5.0+, .NET 6.0+

