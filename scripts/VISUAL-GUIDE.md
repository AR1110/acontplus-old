# 🚀 API RENAME - VISUAL QUICK START

## 📋 What This Package Does

```
Before:                          After:
┌─────────────────────┐         ┌──────────────────┐
│ Services/           │         │ Services/        │
│ ├─ Vet.API/         │  ──→    │ ├─ Vet.Api/      │
│ │  ├─ *.API.csproj  │         │ │  ├─ *.Api.csproj
│ │  └─ *.cs (ns API) │         │ │  └─ *.cs (ns Api)
│ │                   │         │ │                │
│ ├─ Sales.API/       │  ──→    │ ├─ Sales.Api/   │
│ └─ Identity.API/    │         │ └─ Identity.Api/│
└─────────────────────┘         └──────────────────┘

15 APIs renamed | 500+ files updated | 2-5 minutes
```

---

## 🎯 Three Ways to Use This

### Option 1: FASTEST ⚡ (For Everyone)
```
Run This:
Run-API-Rename.bat
     ↓
Click Menu Options
     ↓
Done!
```

### Option 2: SAFEST 👀 (Recommended)
```
Preview First:
.\scripts\Rename-API-Directories.ps1 -WhatIf
     ↓
Review Output
     ↓
Execute:
.\scripts\Rename-API-Directories.ps1
```

### Option 3: COMPLETE 📚 (Full Understanding)
```
Read:
API-Rename-README.md
     ↓
Review Process
     ↓
Execute & Verify
     ↓
Commit
```

---

## 📁 Files You Got

```
scripts/
├── 🤖 Automation Scripts
│   ├── Rename-API-Directories.ps1  ← MAIN ENGINE
│   ├── Validate-API-Rename.ps1     ← VERIFY IT WORKED
│   └── Run-API-Rename.bat          ← MENU INTERFACE
│
├── 📖 Documentation (Pick One)
│   ├── README.md                   ← YOU ARE HERE
│   ├── QUICK-START.md              ← 2 MIN READ
│   ├── API-Rename-README.md        ← 15 MIN READ
│   └── IMPLEMENTATION_SUMMARY.md   ← TECHNICAL
│
└── 📊 Reports (Generated Automatically)
    ├── API-Rename-Report.txt       ← After renaming
    └── API-Validation-Report.txt   ← After validation
```

---

## ⏱️ Timeline

```
┌─ Task ───────────────────── Time ─┐
│                                    │
│ 1. Close Visual Studio       1 min │
│ 2. Preview changes          1 min │
│ 3. Execute rename           3 min │
│ 4. Validate & build         3 min │
│ 5. Test & commit            2 min │
│                                    │
│ TOTAL:                     ~10 min │
└────────────────────────────────────┘
```

---

## ✅ Checklist

### Before Starting
- [ ] Close Visual Studio
- [ ] Commit current work
- [ ] Create backup branch

### Running the Script
- [ ] Preview with -WhatIf
- [ ] Review output
- [ ] Execute main script

### After Completion
- [ ] Run validation script
- [ ] Build solution
- [ ] Run tests
- [ ] Review git diff
- [ ] Commit changes

---

## 🔄 What Gets Renamed (15 Projects)

```
 1. Accounting.API       ──→ Accounting.Api
 2. BarberShop.API       ──→ BarberShop.Api
 3. Billing.API          ──→ Billing.Api
 4. Common.API           ──→ Common.Api
 5. Configuration.API    ──→ Configuration.Api
 6. Identity.API         ──→ Identity.Api
 7. Inventory.API        ──→ Inventory.Api
 8. Loyalty.API          ──→ Loyalty.Api
 9. Mechanical.API       ──→ Mechanical.Api
10. Ocelot.API           ──→ Ocelot.Api
11. Purchases.API        ──→ Purchases.Api
12. Restaurant.API       ──→ Restaurant.Api
13. Sales.API            ──→ Sales.Api
14. TechnicalSupport.API ──→ TechnicalSupport.Api
15. Vet.API              ──→ Vet.Api
```

---

## 🎬 Start Here (Copy-Paste These)

### Quick Start (Most People)
```powershell
cd c:\Users\ifer7\source\repos\AcontPlus
.\scripts\Run-API-Rename.bat
```

### Power User (Preview First)
```powershell
cd c:\Users\ifer7\source\repos\AcontPlus
taskkill /F /IM devenv.exe
.\scripts\Rename-API-Directories.ps1 -WhatIf
.\scripts\Rename-API-Directories.ps1
.\scripts\Validate-API-Rename.ps1
dotnet build
```

### Full Workflow
```powershell
# 1. Prepare
cd c:\Users\ifer7\source\repos\AcontPlus
taskkill /F /IM devenv.exe
git checkout -b backup-api-rename

# 2. Preview
.\scripts\Rename-API-Directories.ps1 -WhatIf

# 3. Execute
.\scripts\Rename-API-Directories.ps1

# 4. Validate
.\scripts\Validate-API-Rename.ps1

# 5. Verify
dotnet clean
dotnet build
dotnet test

# 6. Commit
git add .
git commit -m "refactor: rename .API dirs to .Api PascalCase"
```

---

## 📚 Documentation Quick Guide

```
Question                          Answer/File
──────────────────────────────────────────────────────
"How do I start?"                 → QUICK-START.md
"What exactly happens?"           → API-Rename-README.md
"Show me the architecture"        → IMPLEMENTATION_SUMMARY.md
"How do I troubleshoot?"          → API-Rename-README.md
"I want to preview first"         → Use -WhatIf parameter
"How do I undo?"                  → git reset --hard HEAD
```

---

## 🛡️ Safety Features

```
✓ WhatIf Mode       → Preview before executing
✓ Git Integration   → Full change history
✓ Validation Script → Verify success
✓ Error Handling    → Detailed error messages
✓ Rollback Ready    → Easy undo with git
✓ Report Generated  → Track all changes
```

---

## 🚨 Common Issues & Fixes

```
Issue: "Access Denied"
Fix: taskkill /F /IM devenv.exe

Issue: "File is in use"
Fix: taskkill /F /IM msbuild.exe

Issue: "Want to undo"
Fix: git reset --hard HEAD

Issue: "Script won't run"
Fix: Check QUICK-START.md Troubleshooting
```

---

## 📊 What Changes

```
┌─ File Types ─────────┐
│                      │
│ C# Files (*.cs)      │ - Namespace updates
│ Projects (*.csproj)  │ - File/path updates
│ Solution (*.sln)     │ - Reference updates
│                      │
└──────────────────────┘

Total: ~500 files modified
Result: All .API → .Api throughout project
```

---

## ✨ Features

- ✅ **Automated** - No manual editing needed
- ✅ **Safe** - WhatIf mode for preview
- ✅ **Complete** - Updates all related files
- ✅ **Reversible** - Git tracked for rollback
- ✅ **Verified** - Validation script included
- ✅ **Documented** - Multiple doc files
- ✅ **User-Friendly** - Interactive menu option
- ✅ **Fast** - 2-5 minutes to execute

---

## 🎯 Success Criteria

After running, verify:

```
✓ No .API directories remain
✓ All .Api directories exist
✓ Solution builds without errors
✓ All tests pass
✓ Git diff shows expected changes
✓ No broken references
✓ Validation script passes
```

---

## 📞 Need Help?

```
Quick Questions?        → QUICK-START.md
Detailed Guide?         → API-Rename-README.md
Technical Details?      → IMPLEMENTATION_SUMMARY.md
After Running?          → Check generated report files
Still Stuck?            → Review API-Rename-README.md Troubleshooting
```

---

## 🎓 Learning Paths

### 👶 Beginner
1. Read: QUICK-START.md (2 min)
2. Run: Run-API-Rename.bat
3. Done!

### 👨‍💻 Intermediate
1. Read: QUICK-START.md (2 min)
2. Run: Preview mode first
3. Run: Execute rename
4. Run: Validation script

### 🧠 Advanced
1. Read: API-Rename-README.md (15 min)
2. Review script source
3. Customize if needed
4. Execute with custom parameters

---

## 🔑 Key Commands

```
Preview:    .\scripts\Rename-API-Directories.ps1 -WhatIf
Execute:    .\scripts\Rename-API-Directories.ps1
Validate:   .\scripts\Validate-API-Rename.ps1
Menu:       Run-API-Rename.bat
Build:      dotnet build
Test:       dotnet test
Undo:       git reset --hard HEAD
```

---

## ⏰ Time Breakdown

```
Reading docs:           10-15 min (optional)
Preparation:            2 min
Renaming execution:     2-5 min
Validation:             1-2 min
Build verification:     3-5 min
Testing:                5-10 min
Commit:                 1 min
──────────────────────
Total (with testing):   ~20 min
```

---

## 🎬 Right Now

**Pick ONE:**

```
□ "Just do it"
  → Double-click: Run-API-Rename.bat

□ "Let me preview first"
  → Run: .\scripts\Rename-API-Directories.ps1 -WhatIf

□ "I want to read docs"
  → Open: QUICK-START.md

□ "I need complete understanding"
  → Open: API-Rename-README.md
```

---

## 📈 What Happens

```
START
  ↓
Discover 15 .API directories
  ↓
Rename directories
  ↓
Rename .csproj files
  ↓
Update C# namespaces
  ↓
Update project references
  ↓
Update solution file
  ↓
Generate report
  ↓
DONE ✓
```

---

## 🎯 Next Action

### In 2 Seconds: Close this file and...

**Option A (Fastest):**
```
Double-click: Run-API-Rename.bat
```

**Option B (Safest):**
```powershell
.\scripts\Rename-API-Directories.ps1 -WhatIf
```

**Option C (Most Informed):**
```
Read: QUICK-START.md
```

---

**Status:** ✅ Ready to Use

**Questions?** → See documentation files
**Problems?** → Check QUICK-START.md Troubleshooting
**Want Details?** → Read API-Rename-README.md

---

Good luck! 🚀
