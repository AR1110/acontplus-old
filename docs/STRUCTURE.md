# 📁 Documentation Structure - Quick Reference

> **Visual guide to AcontPlus documentation organization**

## 📊 Folder Overview

```
docs/
│
├── 📄 README.md                              ⭐ START HERE - Main documentation index
├── 📄 Configuration-Guide.md                 Local dev setup, User Secrets
├── 📄 Ocelot-Configuration.md                API Gateway configuration
├── 📄 MINIMAL_API_STATISTICS_PATTERN.md      Analytics API pattern
│
├── 📊 Analytics/                             Analytics Framework
│   ├── Statistics-Localization-Guide.md      ⭐ Multi-language implementation
│   ├── Base-DTOs-Business-Validation.md      DTO validation patterns
│   └── Chart-Labels-Usage-Guide.md           Chart labeling standards
│
├── 🗄️ Database/                              Database Configuration
│   ├── Connection-String-Guide.md            ⭐ Comprehensive DB connection config
│   └── SQL-Server-Naming-Convention.md       Database naming standards
│
├── 🚀 Deployment/                            AWS Infrastructure
│   ├── README.md                             Deployment overview
│   ├── ec2/                                  Amazon EC2 configs
│   │   ├── commands-deploy.md
│   │   └── service_definitions/
│   ├── ecs/                                  Amazon ECS configs
│   │   ├── service-definitions/
│   │   └── task-definitions/
│   ├── ses/                                  Amazon SES (Email)
│   │   ├── dkim/
│   │   └── dmarc-change-batch.json
│   └── Configurations/                       Environment variables
│
├── 🐳 Docker/                                Containerization
│   ├── Docker-Compose-Guide.md               Multi-environment Docker
│   └── Docker-Workflow.md                    Development workflows
│
├── 🍽️ Restaurant/                            Restaurant Service
│   └── EVENT_DRIVEN_ARCHITECTURE.md          Event-driven patterns
│
└── 📦 Legacy/                                Archived Documentation
    ├── ConnectionStringConfigurationByEnvironment.md
    ├── README-ConnectionStringOptimization.md
    ├── ConnectionPoolValidationTesting.md
    ├── DatabaseConnectionPoolMonitoring.md
    ├── Statistics-Localization-Guide.md
    ├── Facturacion Electronica/              PDFs, executables, XML
    └── Guía de Nomenclatura SQL Server - ERP Ecuador.pdf
```

⭐ = Recently created/consolidated

---

## 🎯 Quick Navigation

### By Task

| Task | Documentation |
|------|---------------|
| **Setup local environment** | [Configuration-Guide.md](Configuration-Guide.md) |
| **Configure database** | [Database/Connection-String-Guide.md](Database/Connection-String-Guide.md) |
| **Run with Docker** | [Docker/Docker-Compose-Guide.md](Docker/Docker-Compose-Guide.md) |
| **Deploy to AWS** | [Deployment/README.md](Deployment/README.md) |
| **Add statistics API** | [MINIMAL_API_STATISTICS_PATTERN.md](MINIMAL_API_STATISTICS_PATTERN.md) |
| **Add multi-language** | [Analytics/Statistics-Localization-Guide.md](Analytics/Statistics-Localization-Guide.md) |
| **Configure API Gateway** | [Ocelot-Configuration.md](Ocelot-Configuration.md) |

### By Topic

| Topic | Folder | Key Files |
|-------|--------|-----------|
| **Analytics** | `Analytics/` | Statistics-Localization-Guide.md |
| **Database** | `Database/` | Connection-String-Guide.md, SQL-Server-Naming-Convention.md |
| **Deployment** | `Deployment/` | ec2/, ecs/, ses/, Configurations/ |
| **Docker** | `Docker/` | Docker-Compose-Guide.md, Docker-Workflow.md |
| **Services** | `Restaurant/` | EVENT_DRIVEN_ARCHITECTURE.md |

---

## 📈 File Count by Category

```
Root Level:        4 files
Analytics/:        3 files
Database/:         2 files
Deployment/:      47+ files (EC2, ECS, SES configs)
Docker/:           2 files
Restaurant/:       1 file
Legacy/:           8+ files (archived)
---
Total Active:     ~60 files
```

---

## 🔄 Recent Changes (Dec 18, 2025)

### Consolidated
- ✅ Connection String docs (4 → 1)
- ✅ Localization docs (2 → 1)

### Organized
- ✅ Created Database/ folder
- ✅ Created Deployment/ folder
- ✅ Created Docker/ folder
- ✅ Created Legacy/ folder

### Archived
- ✅ Old connection string guides → Legacy/
- ✅ Facturación Electrónica → Legacy/
- ✅ Spanish PDF docs → Legacy/

---

## 💡 Best Practices

### Adding New Documentation

1. **Service-specific docs** → Create `docs/{ServiceName}/`
2. **Database topics** → Add to `docs/Database/`
3. **Deployment guides** → Add to `docs/Deployment/`
4. **Analytics patterns** → Add to `docs/Analytics/`
5. **Docker topics** → Add to `docs/Docker/`

### Maintaining Documentation

1. **Update consolidated guides** instead of creating new files
2. **Move completed tasks to Legacy/** folder
3. **Update main README.md** when adding categories
4. **Keep folder structure flat** (max 2 levels deep)

---

**Last Updated:** December 18, 2025
**See Also:** [DOCUMENTATION_REORGANIZATION_DEC18.md](../DOCUMENTATION_REORGANIZATION_DEC18.md) for full details
