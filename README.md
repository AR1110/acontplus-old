# AcontPlus - Enterprise Business Management Platform

Modern microservices-based ERP solution built with .NET 10 and Angular 20+.

## 🚀 Quick Start

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- Docker Desktop
- SQL Server 2022+

### Development Setup

1. **Clone and configure:**
   ```bash
   git clone <repository-url>
   cd AcontPlus
   git config core.hooksPath .githooks
   ```

2. **Environment setup:**
   ```bash
   cp .env.development .env
   # Configure User Secrets for each service (see Configuration Guide)
   ```

3. **Run with Docker:**
   ```bash
   docker-compose up -d
   ```

4. **Or run locally:**
   ```bash
   dotnet build
   dotnet run --project src/ApiGateways/Ocelot.Api
   ```

## 📋 Architecture

### Backend (Microservices)
- **Framework:** .NET 10 with Clean Architecture
- **Services:** 14+ microservices (Accounting, Billing, Sales, Inventory, Restaurant, etc.)
- **API Gateway:** Ocelot for routing and centralized authentication
- **Database:** SQL Server with schema-per-service pattern
- **ORM:** Entity Framework Core
- **Mapping:** Mapster
- **Logging:** Serilog

### Frontend
- **Angular App:** Modern Angular 20+ standalone components ([client/README.md](src/WebApps/client/README.md))
- **Legacy WebUI:** ASP.NET Core Razor Pages (being migrated)
- **Hybrid Auth:** Supports both legacy and modern authentication

### Infrastructure
- **Containerization:** Docker Compose for development and staging
- **Package Management:** Central Package Management (Directory.Packages.props)
- **CI/CD:** PowerShell automation scripts

## 📚 Documentation Index

### Getting Started
- [Docker Compose Guide](docs/Docker-Compose-Guide.md) - Container setup and environment configuration
- [Configuration Guide](docs/Configuration-Guide.md) - User Secrets, connection strings, and settings
- [Docker Workflow](docs/Docker-Workflow.md) - Docker profiles and quick start
- [Git Hooks Setup](.githooks/README.md) - Team development standards

### Architecture & Patterns
- [Minimal API Statistics Pattern](docs/MINIMAL_API_STATISTICS_PATTERN.md) - High-performance analytics endpoints
- [Ocelot Gateway Configuration](docs/Ocelot-Configuration.md) - API Gateway routing and security
- [SQL Server Naming Conventions](docs/Database/SQL-Server-Naming-Convention.md) - Database standards
- [Connection String Guide](docs/Database/Connection-String-Guide.md) - Database connection optimization
- [AWS Naming Convention](docs/AWS-Naming-Convention.md) - AWS resource naming standards

### Service-Specific Documentation
- [Restaurant API](src/Services/Restaurant/Restaurant.Api/README.md) - Database schema and migrations
- [Restaurant Meal Management](src/Services/Restaurant/MEAL_MANAGEMENT_DOCUMENTATION.md) - QR-based meal tracking
- [Identity API](src/Services/Identity/Identity.Api/README.md) - Authentication and user management

### Frontend
- [Angular Client](src/WebApps/client/README.md) - Modern Angular 20+ application
- [Hybrid Authentication Guide](src/WebApps/client/docs/HYBRID-AUTH-GUIDE.md) - Legacy/Modern auth coexistence

### Shared Libraries
- [Acontplus.Analytics](src/Shared/Acontplus.Analytics/README.md) - Universal statistics framework

## 🏗️ Project Structure

```
AcontPlus/
├── src/
│   ├── Services/              # Microservices (Clean Architecture)
│   │   ├── Accounting/
│   │   ├── Billing/
│   │   ├── Sales/
│   │   ├── Inventory/
│   │   ├── Restaurant/
│   │   ├── Identity/
│   │   └── ... (14+ services)
│   ├── ApiGateways/
│   │   └── Ocelot.Api/        # API Gateway
│   ├── WebApps/
│   │   ├── client/            # Angular 20+ app
│   │   └── WebUI/             # Legacy Razor Pages
│   └── Shared/                # Shared libraries
│       ├── Acontplus.Core/
│       ├── Acontplus.Persistence/
│       └── Acontplus.Analytics/
├── database/                  # SQL scripts and migrations
├── docs/                      # Architecture documentation
├── scripts/                   # Automation scripts
└── docker-compose.yml         # Container orchestration
```

## 🔧 Common Tasks

### Build Solution
```bash
dotnet build AcontPlus.sln
```

### Run Tests
```bash
# Backend
dotnet test

# Frontend
cd src/WebApps/client
npm test
```

### Database Migrations
```sql
-- See database/ folder for numbered migration scripts
-- Example: 009_migration__removing_user_id_fks.sql
```

### Add New Service
1. Follow Clean Architecture pattern
2. Update `Directory.Packages.props` for dependencies
3. Configure Ocelot routing in appropriate environment file
4. Add database schema in `database/{ServiceName}/`

## 🛠️ Development Tools

- **VS Code Tasks:** Pre-configured build, watch, and Docker tasks
- **PowerShell Scripts:** Automation in `scripts/` folder
- **Git Hooks:** Enforce commit standards and prevent direct pushes to main

## 🌍 Environments

- **Local Development:** Individual developer workstations
- **Docker Development:** Containerized environment with docker-compose
- **AWS Development:** Shared development server (`acontplus-dev-ec2`)
- **Staging:** QA testing environment (`acontplus-stg-ecs`)
- **Production:** AWS ECS Fargate (`acontplus-prd-ecs`)

> See [AWS Naming Convention](docs/AWS-Naming-Convention.md) for resource naming standards.

## 📦 Package Management

All NuGet packages are centrally managed via `Directory.Packages.props`:
- Consistent versions across all services
- Single source of truth for dependencies
- Easy bulk updates

## 🤝 Contributing

1. Create feature branch from `develop`
2. Follow naming conventions (see documentation)
3. Write tests for new features
4. Update relevant documentation
5. Submit PR with descriptive commit message (see `.github/instructions/commits.instructions.md`)

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For issues or questions:
1. Check relevant documentation in this README
2. Review service-specific README files
3. Contact development team

---

**Last Updated:** February 2026
**Version:** .NET 10.0 / Angular 20+
