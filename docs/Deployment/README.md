# AcontPlus Deployment Documentation

> **AWS deployment guides and infrastructure configuration**

## � Naming Conventions

All AWS resources follow the standard naming convention documented in:
- **[AWS Naming Convention Guide](../AWS-Naming-Convention.md)** - Complete reference

### Quick Reference

```
{prefix}-{environment}-{app-type}-{service-name}-{aws-service}[-{qualifier}]
```

| Component | Values |
|-----------|--------|
| Prefix | `acontplus` (or `acp` for 32-char limits) |
| Environment | `prd`, `stg`, `dev` |
| App Type | `api`, `web`, `wrk`, `gtw`, `db` |
| AWS Service | `ecs`, `svc`, `task`, `ecr`, `alb`, `tg`, etc. |

---

## 📦 Deployment Platforms

### Amazon ECS (Container Orchestration) - Recommended

- **[ECS Deployment Guide](../../scripts/aws/ecs-deployment-guide.md)** - Complete CLI commands
- **[ALB Configuration Guide](../../scripts/aws/alb-configuration-guide.md)** - Load balancer setup
- [Task Definitions](ecs/task-definitions/) - Container task configurations
- [Service Definitions](ecs/service-definitions/) - ECS service configurations

### Amazon EC2 (Legacy)

- [EC2 Deployment Guide](ec2/commands-deploy.md) - Systemd service deployment

### Amazon SES (Email Service)

- [SES Configuration Guide](ses/ses-configuration-guide.md) - Email identity setup
- [DKIM Configuration](ses/dkim/) - DomainKeys Identified Mail

---

## 🏗️ Infrastructure Resources

### Production Environment (`prd`)

| Resource Type | Resource ID | Name |
|---------------|-------------|------|
| VPC | `vpc-02176c456642a9383` | `acontplus-prd-vpc` |
| ECS Cluster | - | `acontplus-prd-ecs` |
| ECR Registry | `{ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com` | - |

### Subnets (Production)

| Subnet ID | AZ | Name |
|-----------|----|------|
| `subnet-07500f3abec27f804` | us-east-1a | `acontplus-prd-snet-public-a` |
| `subnet-0b9c5c1185466f2c8` | us-east-1b | `acontplus-prd-snet-public-b` |
| `subnet-057b2f56f51de62ee` | us-east-1c | `acontplus-prd-snet-public-c` |
| `subnet-042ea48a0330849dc` | us-east-1d | `acontplus-prd-snet-public-d` |
| `subnet-0c4a8c8754df52a55` | us-east-1e | `acontplus-prd-snet-public-e` |
| `subnet-042881445c370b0aa` | us-east-1f | `acontplus-prd-snet-public-f` |

### Security Groups (Production)

| Security Group ID | Name | Purpose |
|-------------------|------|---------|
| `sg-0b97cddbc968046e6` | `acontplus-prd-ecs-sg` | ECS services |
| `sg-0122fa572251b26d4` | `acontplus-prd-db-sg` | Database access |
| `sg-0337c2488dcfd66c0` | `acontplus-prd-sg-default` | Default VPC |
| `sg-01bd9aa3b3f732718` | `acontplus-prd-api-reports-sg` | Reports API |

---

## 🔧 Environment Configuration

| Environment | Configuration Source |
|-------------|---------------------|
| Development | User Secrets + `docker-compose.override.yml` |
| Staging | Environment variables in `docker-compose.staging.yml` |
| Production | AWS Secrets Manager + Parameter Store |

### Secrets Manager Naming Convention

```
acontplus/{env}/{category}/{name}
```

Examples:
- `acontplus/prd/db/main/connection-string`
- `acontplus/prd/auth/jwt-secret`
- `acontplus/prd/api/billing/secrets`

### Parameter Store Naming Convention

```
/acontplus/{env}/{category}/{name}
```

Examples:
- `/acontplus/prd/config/environment`
- `/acontplus/prd/api/billing/feature-flags`

---

## 📚 Related Documentation

- [Docker Compose Guide](../Docker/Docker-Compose-Guide.md) - Multi-environment Docker setup
- [Docker Workflow](../Docker/Docker-Workflow.md) - Development workflows
- [Configuration Guide](../Configuration-Guide.md) - Environment configuration
- [AWS Naming Convention](../AWS-Naming-Convention.md) - Complete naming standards

---

**Last Updated:** February 2026
