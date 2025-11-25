# API Rename - Quick Start Guide

## TL;DR - Fast Execution

```powershell
cd c:\Users\ifer7\source\repos\AcontPlus
.\scripts\Rename-API-Directories.ps1
```

## Pre-Flight Checklist

- [ ] Close Visual Studio
- [ ] Commit current work: `git commit -a -m "work in progress"`
- [ ] Create backup branch: `git checkout -b backup-api-rename`

## Run Options

### 1. Preview Changes (Safe)
```powershell
.\scripts\Rename-API-Directories.ps1 -WhatIf
```

### 2. Execute Renaming
```powershell
.\scripts\Rename-API-Directories.ps1
```

### 3. View Results
```powershell
# Check what changed
git status
git diff --stat

# View detailed report
Get-Content .\scripts\API-Rename-Report.txt
```

## Post-Execution Steps

```powershell
# 1. Verify build
dotnet clean
dotnet build

# 2. Run tests
dotnet test

# 3. Commit changes
git add .
git commit -m "refactor: rename .API dirs to .Api PascalCase"

# 4. Push to repo
git push origin main
```

## What Gets Renamed

| Component | Before | After |
|-----------|--------|-------|
| Directories | `Vet.API/` | `Vet.Api/` |
| Project Files | `Vet.API.csproj` | `Vet.Api.csproj` |
| Namespaces | `namespace Vet.API` | `namespace Vet.Api` |
| References | `using Vet.API` | `using Vet.Api` |
| Solution File | Updated paths in `.sln` | ✓ Auto-updated |

## Affected Projects (14 Total)

```
1. Accounting.API      → Accounting.Api
2. BarberShop.API      → BarberShop.Api
3. Billing.API         → Billing.Api
4. Common.API          → Common.Api
5. Configuration.API   → Configuration.Api
6. Identity.API        → Identity.Api
7. Inventory.API       → Inventory.Api
8. Loyalty.API         → Loyalty.Api
9. Mechanical.API      → Mechanical.Api
10. Ocelot.API         → Ocelot.Api
11. Purchases.API      → Purchases.Api
12. Restaurant.API     → Restaurant.Api
13. Sales.API          → Sales.Api
14. TechnicalSupport.API → TechnicalSupport.Api
15. Vet.API            → Vet.Api
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Access Denied" | Close Visual Studio: `taskkill /F /IM devenv.exe` |
| "File is in use" | Kill msbuild: `taskkill /F /IM msbuild.exe` |
| Want to undo | `git reset --hard HEAD` |
| Verify changes | `git diff --stat` |
| Check report | `Get-Content .\scripts\API-Rename-Report.txt` |

## Time Estimates

| Task | Duration |
|------|----------|
| Script execution | 2-5 minutes |
| Build verification | 3-5 minutes |
| Test execution | 5-10 minutes |
| Total | ~15-20 minutes |

## Success Criteria

After running:

```powershell
# All these should pass:
dotnet build              # ✓ Build succeeds
dotnet test               # ✓ All tests pass
git status                # ✓ Shows expected changes only
```

## Revert if Needed

```powershell
# Option 1: Git reset
git reset --hard HEAD
git checkout backup-api-rename

# Option 2: Restore from backup
git restore .
```

---

**Full documentation:** See `API-Rename-README.md`
