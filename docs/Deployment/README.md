# AcontPlus Deployment Documentation

> **AWS deployment guides and infrastructure configuration**

## 📦 Deployment Platforms

### Amazon EC2
- [EC2 Deployment Guide](ec2/commands-deploy.md) - Deployment commands and procedures
- [Service Definitions](ec2/service_definitions/) - EC2 service configurations

### Amazon ECS (Container Orchestration)
- [ECS Service Definitions](ecs/service-definitions/) - Container service definitions
- [ECS Task Definitions](ecs/task-definitions/) - Task configuration files

### Amazon SES (Email Service)
- [DKIM Configuration](ses/dkim/) - DomainKeys Identified Mail setup
- [DMARC Settings](ses/dmarc-change-batch.json) - Email authentication policy
- [AWS CLI SES Commands](ses/aws%20cli%20ses.txt) - Command reference

## 🔧 Environment-Specific Configuration

Environment variables and secrets are managed via:
- **Development:** User Secrets + `docker-compose.override.yml`
- **Staging:** Environment variables in `docker-compose.staging.yml`
- **Production:** AWS Parameter Store / Secrets Manager

See [Configuration Guide](../Configuration-Guide.md) for details.

## 📚 Related Documentation

- [Docker Compose Guide](../Docker-Compose-Guide.md) - Multi-environment Docker setup
- [Docker Workflow](../Docker-Workflow.md) - Development workflows
- [Configuration Guide](../Configuration-Guide.md) - Environment configuration

---

**Last Updated:** December 18, 2025
