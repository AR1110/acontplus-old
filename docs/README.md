# AcontPlus Documentation Index

Comprehensive documentation for the AcontPlus Enterprise Business Management Platform.

## 📚 Core Documentation

### Getting Started
- [Configuration Guide](Configuration-Guide.md) - Local development setup, User Secrets, connection strings
- [Docker Compose Guide](Docker-Compose-Guide.md) - Multi-environment Docker setup (.env files, security)
- [Docker Workflow](Docker-Workflow.md) - Docker profiles and development workflows

### Architecture & Patterns
- [Minimal API Statistics Pattern](MINIMAL_API_STATISTICS_PATTERN.md) - High-performance analytics endpoints
- [Ocelot Configuration](Ocelot-Configuration.md) - API Gateway routing, authentication, rate limiting

### Database
- [SQL Server Naming Convention](SQL-Server-Naming-Convention.md) - Database standards and best practices
- [Connection String Optimization](README-ConnectionStringOptimization.md) - Performance tuning by environment
- [Connection Pool Validation Testing](ConnectionPoolValidationTesting.md) - Testing connection pool settings
- [Database Connection Pool Monitoring](DatabaseConnectionPoolMonitoring.md) - Monitoring and alerting
- [Connection String Configuration by Environment](ConnectionStringConfigurationByEnvironment.md) - Environment-specific configs

## 📁 Service-Specific Documentation

### Restaurant Service
- [EVENT_DRIVEN_ARCHITECTURE.md](Restaurant/EVENT_DRIVEN_ARCHITECTURE.md) - Event-driven patterns
- [Statistics-Localization-Guide.md](Restaurant/Statistics-Localization-Guide.md) - Multi-language stats

## 📊 Analytics Framework

### Acontplus.Analytics
- [Base DTOs Business Validation](Analytics/Base-DTOs-Business-Validation.md) - DTO validation patterns
- [Chart Labels Usage Guide](Analytics/Chart-Labels-Usage-Guide.md) - Chart labeling standards
- [Statistics Localization Implementation Guide](Analytics/StatisticsLocalization-Implementation-Guide.md) - Multi-language implementation

## 🏗️ Infrastructure

### Configuration Management
See [Configurations/](Configurations/) folder for environment-specific configuration guides.

### AWS Deployments
- [EC2 Documentation](ec2/) - EC2 deployment guides
- [ECS Documentation](ecs/) - ECS container orchestration
- [SES Configuration](ses/) - Email service setup

### Facturación Electrónica
See [Facturacion Electronica/](Facturacion%20Electronica/) folder for electronic invoicing documentation.

## 🔍 Quick Reference

### Common Tasks
1. **Setup Development Environment**: [Configuration Guide](Configuration-Guide.md)
2. **Run Services with Docker**: [Docker Compose Guide](Docker-Compose-Guide.md)
3. **Configure API Gateway**: [Ocelot Configuration](Ocelot-Configuration.md)
4. **Implement Statistics API**: [Minimal API Statistics Pattern](MINIMAL_API_STATISTICS_PATTERN.md)
5. **Optimize Database Performance**: [Connection String Optimization](README-ConnectionStringOptimization.md)

### Best Practices
- Follow [SQL Server Naming Convention](SQL-Server-Naming-Convention.md) for all database objects
- Use [Minimal API Statistics Pattern](MINIMAL_API_STATISTICS_PATTERN.md) for analytics endpoints
- Configure environments per [Docker Compose Guide](Docker-Compose-Guide.md)
- Implement multi-language support using [Analytics guides](Analytics/)

## 📖 External Documentation

### Service READMEs
- Restaurant API: `../src/Services/Restaurant/Restaurant.Api/README.md`
- Identity API: `../src/Services/Identity/Identity.Api/README.md`
- Angular Client: `../src/WebApps/client/README.md`
- Shared Analytics: `../src/Shared/Acontplus.Analytics/README.md`

### Additional Resources
- Main Project README: `../README.md`
- Scripts Documentation: `../scripts/README.md`
- Git Hooks Setup: `../.githooks/README.md`

---

**Last Updated:** December 2025
**Maintained by:** AcontPlus Development Team
