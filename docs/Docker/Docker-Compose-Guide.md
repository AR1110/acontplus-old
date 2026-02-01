# Docker Compose Environment Configuration

This project uses a multi-file Docker Compose setup with `.env` files for flexible configuration across environments.

## Files Structure

- **docker-compose.yml** - Base service definitions (environment-agnostic)
- **docker-compose.override.yml** - Development overrides (auto-merged)
- **docker-compose.prod.yml** - Production overrides
- **.env.development** - Development defaults (safe to commit)
- **.env.example** - Template with all available options (safe to commit)
- **.env** - Your actual environment config (gitignored - NEVER commit!)

## Security Note

⚠️ **CRITICAL**: The `.env` file contains sensitive credentials and is gitignored. Never commit this file to version control!

- ✅ `.env.development` - Safe to commit (no sensitive data, defaults only)
- ✅ `.env.example` - Safe to commit (template only)
- ❌ `.env` - NEVER commit (contains actual credentials)

## Configuration Approach

All settings are controlled via `.env` files:

### ✅ Benefits
- **Single source of truth** - All config in one file per environment
- **Easy switching** - Change environments by switching `.env` content
- **Team flexibility** - Each environment has its own `.env`
- **CI/CD friendly** - Build .env from secrets in your pipeline
- **No hardcoded values** - Everything configurable
- **Secure** - Actual credentials only in gitignored `.env`

## Configuration Priority

ASP.NET Core loads configuration in this order (highest priority first):

1. **Environment Variables** (from `.env` files loaded by docker-compose)
2. **User Secrets** (mounted from `%APPDATA%/Microsoft/UserSecrets`)
3. **appsettings.{Environment}.json** (copied into Docker image)
4. **appsettings.json** (copied into Docker image)

## Quick Start

### Development

```bash
# Option 1: Copy development defaults
cp .env.development .env
# Customize .env if needed
docker-compose up -d

# Option 2: Use development env file directly (for testing)
docker-compose --env-file .env.development up -d
```

### Production

```bash
# Production .env should already exist with actual credentials
# Verify all sensitive values are set (no CHANGE_THIS placeholders)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### First Time Setup (Production)

```bash
# Copy example as starting point
cp .env.example .env
# Edit .env and replace ALL placeholder values with actual credentials
nano .env  # or use your preferred editor
# Verify configuration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml config
# Deploy
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

The development environment is optimized for local development with minimal resources.

### Features
- **User Secrets** mounted for sensitive configuration
- **Local logs** written to `./logs/{service}` directory
- **Container names** for easy identification and debugging
- **Gateway** accessible on port 5000
- **Service URLs** pre-configured for inter-service communication
- **Hot reload** support (when using dotnet watch)
- **Environment variable overrides** for Docker-specific paths

### Key Configuration Overrides

All development services have these overrides:
- `AdvancedLogging__LocalFilePath=/app/logs/log-.txt` - Logs to mounted volume
- Service-to-service URLs use Docker network names (e.g., `http://identity.api:8080`)

### Local Log Access

Logs are written to `./logs/{service}/` in your project root:
- `./logs/ocelot/` - API Gateway logs
- `./logs/identity/` - Identity service logs
- `./logs/accounting/` - Accounting service logs
- etc.

These directories are created automatically when services start writing logs.

### Usage

```bash
# Start all services (automatically uses override.yml)
docker-compose up -d

# Start specific services
docker-compose up -d ocelot.api identity.api accounting.api

# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Production Environment

The production environment includes resource limits, restart policies, and log rotation.

### Features
- Automatic restart on failure
- Resource limits (512MB RAM, 1 CPU per service)
- Log rotation (10MB, 3 files)
- Production environment variables
- Gateway on port 80

### Usage

```bash
# Start production environment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Build and start production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Stop production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

## Service Ports

### Development
- **Ocelot API Gateway**: http://localhost:5000
- Internal services communicate via Docker network (no exposed ports by default)

### Production
- **Ocelot API Gateway**: http://localhost:80
- All services run behind the gateway

## Resource Allocation (Production)

Each service has:
- **Limit**: 1 CPU, 512MB RAM
- **Reservation**: 0.25 CPU, 128MB RAM

Total for all 14 services:
- **Maximum**: 14 CPUs, 7GB RAM
- **Reserved**: 3.5 CPUs, 1.8GB RAM

## Services

1. ocelot.api - API Gateway
2. accounting.api - Accounting Service
3. barbershop.api - BarberShop Service
4. billing.api - Billing Service
5. common.api - Common Service
6. configuration.api - Configuration Service
7. identity.api - Identity Service
8. inventory.api - Inventory Service
9. mechanical.api - Mechanical Service
10. purchases.api - Purchases Service
11. restaurant.api - Restaurant Service
12. sales.api - Sales Service
13. technicalsupport.api - Technical Support Service
14. vet.api - Vet Service

## Tips

### Build specific service
```bash
docker-compose build accounting.api
```

### Remove all containers and volumes
```bash
docker-compose down -v
```

### Check running containers
```bash
docker-compose ps
```

### Execute command in running container
```bash
docker-compose exec identity.api bash
```

## Environment Variables

Set `DOCKER_REGISTRY` to push images to a registry:

```bash
# For AWS ECR (following naming convention):
export DOCKER_REGISTRY={ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/acontplus-
docker-compose build
docker-compose push

# Image names will be:
# {ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/acontplus-api-billing
# {ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/acontplus-api-sales
# {ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/acontplus-gtw-ocelot
```

## Notes

- All services use .NET 10
- All images run as non-root users
- Development uses User Secrets for sensitive configuration
- Production should use environment variables or secret management services

## Related Documentation

- [AWS Naming Convention](../AWS-Naming-Convention.md) - Resource naming standards
- [ECS Deployment Guide](../../scripts/aws/ecs-deployment-guide.md) - AWS ECS deployment
- [ALB Configuration Guide](../../scripts/aws/alb-configuration-guide.md) - Load balancer setup
