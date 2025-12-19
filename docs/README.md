# AcontPlus Documentation Index

> **Comprehensive documentation for the AcontPlus Enterprise Business Management Platform**

## 🚀 Getting Started

### Essential Guides
- [Configuration Guide](Configuration-Guide.md) - Local development setup, User Secrets, connection strings
- [Docker Compose Guide](Docker/Docker-Compose-Guide.md) - Multi-environment Docker setup
- [Docker Workflow](Docker/Docker-Workflow.md) - Development workflows and profiles

## 📚 Core Documentation

### Architecture & Patterns
- [Minimal API Statistics Pattern](MINIMAL_API_STATISTICS_PATTERN.md) - High-performance analytics endpoints
- [Ocelot Configuration](Ocelot-Configuration.md) - API Gateway routing, authentication, rate limiting

### Database
- [Connection String Guide](Database/Connection-String-Guide.md) - **NEW** Comprehensive connection string configuration for all environments
- [SQL Server Naming Convention](Database/SQL-Server-Naming-Convention.md) - Database standards and best practices

### Analytics Framework
- [Statistics Localization Guide](Analytics/Statistics-Localization-Guide.md) - **NEW** Multi-language support implementation
- [Base DTOs Business Validation](Analytics/Base-DTOs-Business-Validation.md) - DTO validation patterns
- [Chart Labels Usage Guide](Analytics/Chart-Labels-Usage-Guide.md) - Chart labeling standards

## 📁 Service-Specific Documentation

### Restaurant Service
- [Event-Driven Architecture](Restaurant/EVENT_DRIVEN_ARCHITECTURE.md) - Event-driven patterns and implementation

## 🏗️ Infrastructure & Deployment

### Docker
- [Docker Compose Guide](Docker/Docker-Compose-Guide.md) - Multi-environment setup
- [Docker Workflow](Docker/Docker-Workflow.md) - Development workflows

### AWS Deployment
- [Deployment Documentation](Deployment/README.md) - Overview of AWS deployment
  - [EC2 Deployment](Deployment/ec2/) - EC2 deployment guides
  - [ECS Container Orchestration](Deployment/ecs/) - ECS service and task definitions
  - [SES Email Service](Deployment/ses/) - Email service configuration
  - [Environment Configuration](Deployment/Configurations/) - Environment-specific settings

## 🔍 Quick Reference

### Common Tasks
1. **Setup Development Environment**: [Configuration Guide](Configuration-Guide.md)
2. **Run Services with Docker**: [Docker Compose Guide](Docker/Docker-Compose-Guide.md)
3. **Configure Database Connections**: [Connection String Guide](Database/Connection-String-Guide.md)
4. **Configure API Gateway**: [Ocelot Configuration](Ocelot-Configuration.md)
5. **Implement Statistics API**: [Minimal API Statistics Pattern](MINIMAL_API_STATISTICS_PATTERN.md)
6. **Add Multi-language Support**: [Statistics Localization Guide](Analytics/Statistics-Localization-Guide.md)

### Best Practices
- Follow [SQL Server Naming Convention](Database/SQL-Server-Naming-Convention.md) for all database objects
- Use [Minimal API Statistics Pattern](MINIMAL_API_STATISTICS_PATTERN.md) for analytics endpoints
- Configure environments per [Docker Compose Guide](Docker/Docker-Compose-Guide.md)
- Implement multi-language support using [Statistics Localization Guide](Analytics/Statistics-Localization-Guide.md)

## 📂 Folder Structure

```
docs/
├── README.md (this file)
├── Configuration-Guide.md
├── Ocelot-Configuration.md
├── MINIMAL_API_STATISTICS_PATTERN.md
│
├── Analytics/          - Analytics framework documentation
├── Database/           - Database configuration and standards
├── Deployment/         - AWS deployment guides (EC2, ECS, SES)
├── Docker/             - Docker and containerization guides
├── Restaurant/         - Restaurant service-specific docs
└── Legacy/             - Archived/outdated documentation
```

## 📖 Additional Resources

### Service-Specific READMEs
- Restaurant API: `../src/Services/Restaurant/Restaurant.Api/README.md`
- Identity API: `../src/Services/Identity/Identity.Api/README.md`
- Angular Client: `../src/WebApps/client/README.md`
- Shared Analytics: `../src/Shared/Acontplus.Analytics/README.md`

### Project Resources
- Main Project README: `../README.md`
- Scripts Documentation: `../scripts/README.md`
- Git Hooks Setup: `../.githooks/README.md`
- Commit Guidelines: `../.github/instructions/commits.instructions.md`

---

**Last Updated:** December 18, 2025
**Maintained by:** AcontPlus Development Team
