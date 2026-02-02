# Scripts de Automatización para AcontPlus
## Índice de Herramientas de Desarrollo

---

## 📂 Contenido

### ☁️ **Scripts de AWS** (Deployment a la Nube)

#### 📁 Carpeta: `aws/`

| Archivo | Descripción |
|---------|-------------|
| `ecs-deployment-guide.md` | Guía completa de despliegue a ECS Fargate |
| `alb-configuration-guide.md` | Configuración de Application Load Balancer |

**Uso típico:**
```bash
# Login a ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin {ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com

# Push imagen a ECR
docker push {ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/acontplus-api-billing:prd-1.0.0

# Actualizar servicio ECS
aws ecs update-service --cluster acontplus-prd-ecs --service acontplus-prd-api-billing-svc --force-new-deployment
```

**Naming Convention:** Todos los recursos siguen el formato:
```
acontplus-{env}-{app-type}-{service}-{aws-service}
```
Ver [AWS Naming Convention](../docs/AWS-Naming-Convention.md) para más detalles.

---

### 🐳 **Scripts de Docker** (Desarrollo Local)

#### 1. `docker-profiles.ps1` ⭐ PERFILES DE DOCKER
- **Propósito:** Ejecutar builds y deployments selectivos por módulo
- **Tipo:** PowerShell Script
- **Ejecución:**
  ```powershell
  .\scripts\docker-profiles.ps1 -Profile Sales -Action build
  .\scripts\docker-profiles.ps1 -Profile Restaurant -Action up
  ```
- **Perfiles Disponibles:**
  - `Core` - Infraestructura básica (Gateway, Identity, Configuration, Common)
  - `Sales` - Módulo de ventas (Gateway + Sales + Billing + Inventory)
  - `Inventory` - Gestión de inventario (Gateway + Inventory + Purchases + Accounting)
  - `Financial` - Contabilidad (Gateway + Accounting + Billing + Purchases)
  - `Restaurant` - Restaurante (Gateway + Restaurant + Sales + Inventory)
  - `Automotive` - Automotriz (Gateway + Mechanical + Vet + TechnicalSupport)
  - `Services` - Servicios (Gateway + BarberShop + TechnicalSupport)
  - `Gateway` - Solo API Gateway
  - `All` - Todos los 14 servicios
- **Acciones:**
  - `build` - Construir imágenes Docker
  - `up` - Iniciar contenedores
  - `restart` - Reiniciar servicios
  - `stop` - Detener servicios
  - `start` - Iniciar servicios detenidos
  - `logs` - Ver logs
- **Opciones:**
  - `-Parallel` - Build paralelo (más rápido)
  - `-NoBuild` - Up sin rebuild
  - `-Follow` - Logs en tiempo real
- **Tiempo:** 2-3 min por perfil (vs 25-30 min para todos)

#### 2. `quick-start.ps1` 🚀 INICIO RÁPIDO
- **Propósito:** Iniciar un perfil completo con un comando
- **Tipo:** PowerShell Script
- **Ejecución:**
  ```powershell
  .\scripts\quick-start.ps1              # Inicia perfil Core
  .\scripts\quick-start.ps1 -Profile Sales
  ```
- **Qué hace:**
  1. Build paralelo del perfil
  2. Inicia contenedores
  3. Muestra estado
- **Mejor para:** Comenzar a trabajar rápidamente

**Ejemplos de Uso:**
```powershell
# Desarrollo de módulo de ventas
.\scripts\quick-start.ps1 -Profile Sales

# Solo infraestructura
.\scripts\quick-start.ps1 -Profile Core

# Ver logs en tiempo real
.\scripts\docker-profiles.ps1 -Profile Sales -Action logs -Follow

# Rebuild + Restart
.\scripts\docker-profiles.ps1 -Profile Sales -Action up
```

---

### 🤖 **Scripts de Renombrado** (Migración de Nombres)

#### 1. `Rename-API-Directories.ps1` ⭐ MAIN SCRIPT
- **Purpose:** Core renaming automation engine
- **Type:** PowerShell Script
- **Execution:** `.\scripts\Rename-API-Directories.ps1`
- **Options:**
  - `-WhatIf` → Preview without changes (SAFE!)
  - `-RootPath` → Custom root directory
- **Output:** Generates `API-Rename-Report.txt`
- **Time:** 2-5 minutes

#### 2. `Validate-API-Rename.ps1` ✅ VALIDATION
- **Purpose:** Verify successful renaming
- **Type:** PowerShell Script
- **Execution:** `.\scripts\Validate-API-Rename.ps1`
- **Checks:** 8 different validation tests
- **Output:** Generates `API-Validation-Report.txt`
- **Time:** 1-2 minutes

#### 3. `Run-API-Rename.bat` 🎯 INTERACTIVE MENU
- **Purpose:** Guided workflow for all users
- **Type:** Batch Script (Windows)
- **Execution:** Double-click or `scripts\Run-API-Rename.bat`
- **Features:** Menu-driven interface
- **Options:**
  1. Preview mode
  2. Execute rename
  3. Validate results
  4. Build solution
  5. Run tests
  6. Commit to git
  7. View help
  8. Exit

---

### 📖 **Documentation Files** (Read These!)

#### 1. `QUICK-START.md` ⚡ START HERE (2 min)
- **Best for:** Users who want to get started immediately
- **Contains:**
  - TL;DR commands
  - Pre-flight checklist
  - Common troubleshooting table
  - Time estimates
- **Read time:** 2-3 minutes

#### 2. `API-Rename-README.md` 📚 COMPLETE GUIDE (15 min)
- **Best for:** Understanding the complete process
- **Contains:**
  - Detailed overview
  - Step-by-step process explanation
  - All prerequisites
  - Before/after examples
  - Troubleshooting section
  - Recovery procedures
  - Advanced usage
- **Read time:** 15-20 minutes

#### 3. `IMPLEMENTATION_SUMMARY.md` 🏗️ ARCHITECTURE
- **Best for:** Technical overview and architecture
- **Contains:**
  - Package overview
  - Getting started guide
  - What gets changed
  - Architecture & design
  - Verification checklist
  - Quick command reference
- **Read time:** 10-15 minutes

#### 4. This File (`README.md`) 📍 YOU ARE HERE
- Navigation guide for all files
- Quick decisions table
- Getting started flowchart

---

## 🚀 Quick Start (Choose Your Path)

### Path 1: I Want to Get Started NOW ⚡
1. Read: `QUICK-START.md` (2 min)
2. Execute: `.\scripts\Run-API-Rename.bat` (click menu options)
3. Done!

### Path 2: I Want to Preview First 👀
1. Run: `.\scripts\Rename-API-Directories.ps1 -WhatIf`
2. Review output
3. If happy, run without `-WhatIf`

### Path 3: I Want to Understand Everything 🎓
1. Read: `API-Rename-README.md` (15 min)
2. Read: `IMPLEMENTATION_SUMMARY.md` (10 min)
3. Run: `.\scripts\Rename-API-Directories.ps1`

### Path 4: I'm Using the Interactive Menu 🎯
1. Execute: `Run-API-Rename.bat`
2. Follow the menu options
3. Script guides you through everything

---

## 📋 Decision Tree

```
START
  │
  ├─ I want a graphical menu
  │  └─→ Run: Run-API-Rename.bat
  │
  ├─ I want to preview first (SAFE!)
  │  └─→ Run: Rename-API-Directories.ps1 -WhatIf
  │
  ├─ I want quick answers only
  │  └─→ Read: QUICK-START.md
  │
  ├─ I want detailed documentation
  │  └─→ Read: API-Rename-README.md
  │
  └─ I want technical details
     └─→ Read: IMPLEMENTATION_SUMMARY.md
```

---

## ⚡ 30-Second Quick Start

```powershell
# Close Visual Studio
taskkill /F /IM devenv.exe

# Navigate to project
cd c:\Users\ifer7\source\repos\AcontPlus

# Preview changes (safe!)
.\scripts\Rename-API-Directories.ps1 -WhatIf

# Execute rename (if happy with preview)
.\scripts\Rename-API-Directories.ps1

# Validate results
.\scripts\Validate-API-Rename.ps1

# Build & test
dotnet build
dotnet test
```

---

## 📊 What This Package Does

### Renames 15 API Projects
```
Accounting.API       → Accounting.Api
BarberShop.API       → BarberShop.Api
Billing.API          → Billing.Api
Common.API           → Common.Api
Configuration.API    → Configuration.Api
Identity.API         → Identity.Api
Inventory.API        → Inventory.Api
Loyalty.API          → Loyalty.Api
Mechanical.API       → Mechanical.Api
Ocelot.API           → Ocelot.Api
Purchases.API        → Purchases.Api
Restaurant.API       → Restaurant.Api
Sales.API            → Sales.Api
TechnicalSupport.API → TechnicalSupport.Api
Vet.API              → Vet.Api
```

### Updates Everything
- ✅ Directory names
- ✅ .csproj files
- ✅ C# namespaces
- ✅ Using statements
- ✅ Project references
- ✅ Solution file
- ✅ Code references

### Safe & Reversible
- ✅ Preview mode (-WhatIf)
- ✅ Git-tracked changes
- ✅ Easy rollback
- ✅ Validation script included

---

## 🎯 Typical Workflow

### Step 1: Prepare (2 min)
```powershell
cd c:\Users\ifer7\source\repos\AcontPlus
taskkill /F /IM devenv.exe
git checkout -b backup-api-rename
```

### Step 2: Preview (1 min)
```powershell
.\scripts\Rename-API-Directories.ps1 -WhatIf
```

### Step 3: Execute (3 min)
```powershell
.\scripts\Rename-API-Directories.ps1
```

### Step 4: Validate (2 min)
```powershell
.\scripts\Validate-API-Rename.ps1
dotnet build
```

### Step 5: Commit (1 min)
```powershell
git add .
git commit -m "refactor: rename .API dirs to .Api PascalCase"
```

**Total Time: ~10 minutes**

---

## 📖 Which File Should I Read?

| If You Want To... | Read This | Time |
|---|---|---|
| Get started immediately | QUICK-START.md | 2 min |
| Understand the process | API-Rename-README.md | 15 min |
| Know the architecture | IMPLEMENTATION_SUMMARY.md | 10 min |
| Make decisions | This file (README.md) | 5 min |
| Understand all scripts | API-Rename-README.md | 15 min |

---

## 🛠️ Script Comparison

| Feature | Rename Script | Validate Script | Batch Menu |
|---------|---------------|-----------------|-----------|
| Main automation | ✅ | ❌ | ❌ |
| Preview mode | ✅ | ❌ | ✅ |
| Validation | ❌ | ✅ | ❌ |
| Interactive menu | ❌ | ❌ | ✅ |
| Guided workflow | ❌ | ❌ | ✅ |
| Detailed checks | ❌ | ✅ | ❌ |
| Auto-generates report | ✅ | ✅ | ❌ |
| Windows compatible | ✅ | ✅ | ✅ |
| PowerShell compatible | ✅ | ✅ | ❌ |

---

## ⚠️ Important Notes

### Before You Start
- [ ] Close Visual Studio
- [ ] Commit your current work
- [ ] No running builds
- [ ] Git status should be clean

### While Running
- Don't interrupt the script
- Watch for any error messages
- Review the generated report

### After Completion
- Run validation script
- Build the solution
- Run unit tests
- Review git diff
- Commit when happy

---

## 🔧 Troubleshooting Quick Links

### Script Won't Run
→ See: QUICK-START.md - Troubleshooting Table

### Build Fails
→ See: API-Rename-README.md - Troubleshooting Section

### Want to Undo
→ See: API-Rename-README.md - Recovery Section

### Validation Fails
→ Run: `.\scripts\Validate-API-Rename.ps1` and review output

### Need More Help
→ Read: API-Rename-README.md (Complete Documentation)

---

## 📞 Getting Help

### Quick Questions
1. Check: QUICK-START.md
2. Check: Generated report files
3. Run: Validation script

### Detailed Questions
1. Read: API-Rename-README.md
2. Review: IMPLEMENTATION_SUMMARY.md
3. Check: Generated report files

### Technical Issues
1. Check error messages in console
2. Review: Generated report files
3. Run: `git status` to see changes
4. Run: `git diff` to see details

---

## 📝 Generated Report Files

### After Running Rename Script
- **File:** `scripts\API-Rename-Report.txt`
- **Contains:**
  - List of directories renamed
  - List of files renamed
  - List of updated namespaces
  - Summary of all changes
  - Verification checklist

### After Running Validation Script
- **File:** `scripts\API-Validation-Report.txt`
- **Contains:**
  - Validation test results
  - Issues found (if any)
  - Warnings
  - Recommendations

---

## 🎓 Learning Path

### Absolute Beginner
1. Read: QUICK-START.md (2 min)
2. Run: Run-API-Rename.bat (use menu)
3. Done!

### Intermediate User
1. Read: QUICK-START.md (2 min)
2. Read: IMPLEMENTATION_SUMMARY.md (10 min)
3. Run: Rename-API-Directories.ps1 -WhatIf (1 min)
4. Run: Rename-API-Directories.ps1 (3 min)
5. Run: Validate-API-Rename.ps1 (2 min)

### Advanced User
1. Read: API-Rename-README.md (15 min)
2. Review: Script source code
3. Customize if needed
4. Run with custom parameters

---

## ✨ Key Features

### Automation
- ✅ Fully automated renaming
- ✅ No manual file edits needed
- ✅ Handles dependencies automatically

### Safety
- ✅ WhatIf mode for preview
- ✅ Git integration for rollback
- ✅ Validation script included
- ✅ Detailed error reporting

### User-Friendly
- ✅ Interactive menu option
- ✅ Multiple documentation files
- ✅ Quick reference available
- ✅ Step-by-step guides

### Comprehensive
- ✅ Updates all file types
- ✅ Handles all references
- ✅ Updates solution file
- ✅ Generates reports

---

## 🚀 Next Steps

### 1. Read This First
**Choose One:**
- Busy? → Read `QUICK-START.md` (2 min)
- Learning? → Read `API-Rename-README.md` (15 min)
- Technical? → Read `IMPLEMENTATION_SUMMARY.md` (10 min)

### 2. Then Do This
**Choose One:**
- Just execute? → Run `Run-API-Rename.bat`
- Preview first? → Run `Rename-API-Directories.ps1 -WhatIf`
- Full control? → Read docs, then run script

### 3. Finally Verify
```powershell
.\scripts\Validate-API-Rename.ps1
dotnet build
dotnet test
```

---

## 📞 Questions?

| Question | Answer |
|----------|--------|
| Will it break my code? | No, it's fully automated and safe |
| Can I preview first? | Yes! Use `-WhatIf` parameter |
| How do I undo it? | Use git: `git reset --hard HEAD` |
| How long does it take? | 2-5 minutes to run, ~10 min total |
| Do I need admin rights? | Recommended, but usually no |
| What if something fails? | Validation script tells you what's wrong |

---

## 📄 File Summary

```
scripts/
├── Rename-API-Directories.ps1          ⭐ Main automation engine
├── Validate-API-Rename.ps1             ✅ Validation & verification
├── Run-API-Rename.bat                  🎯 Interactive guided menu
├── QUICK-START.md                      ⚡ Quick reference (2 min)
├── API-Rename-README.md                📚 Complete guide (15 min)
├── IMPLEMENTATION_SUMMARY.md           🏗️ Technical overview (10 min)
├── README.md                           📍 This file
└── API-Rename-Report.txt               📊 Generated after rename
└── API-Validation-Report.txt           📊 Generated after validate
```

---

## 🎬 Ready? Let's Go!

### The Fastest Way
```powershell
Run-API-Rename.bat  # Double-click or execute
```

### The Safest Way
```powershell
.\scripts\Rename-API-Directories.ps1 -WhatIf  # Preview
# Review output
.\scripts\Rename-API-Directories.ps1          # Execute
```

### The Most Thorough Way
1. Read `API-Rename-README.md`
2. Run `.\scripts\Rename-API-Directories.ps1 -WhatIf`
3. Review the output
4. Run `.\scripts\Rename-API-Directories.ps1`
5. Run `.\scripts\Validate-API-Rename.ps1`
6. Build and test

---

## 📚 Complete File Index

| File | Purpose | Read Time | Audience |
|------|---------|-----------|----------|
| QUICK-START.md | Quick commands & reference | 2 min | Everyone |
| API-Rename-README.md | Complete documentation | 15 min | Detailed learners |
| IMPLEMENTATION_SUMMARY.md | Architecture & overview | 10 min | Technical users |
| README.md | This navigation file | 5 min | Decision makers |
| Rename-API-Directories.ps1 | Main script | - | Automated execution |
| Validate-API-Rename.ps1 | Validation script | - | Verification |
| Run-API-Rename.bat | Interactive menu | - | Guided workflow |

---

**Status:** ✅ Ready to Use
**Total Package Size:** 100+ KB of documentation & scripts
**Compatibility:** Windows PowerShell 5.0+, .NET 6.0+
**Last Updated:** 2025-11-25

---

## 🎯 Start Here

**Choose your learning style:**

1. **"Just tell me the commands"**
   → Open: `QUICK-START.md`

2. **"Show me how it works"**
   → Open: `API-Rename-README.md`

3. **"Let's use a menu"**
   → Run: `Run-API-Rename.bat`

4. **"I want to understand the design"**
   → Open: `IMPLEMENTATION_SUMMARY.md`

---

Good luck! 🚀
