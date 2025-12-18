# Environment Configuration Templates

This directory contains template files for environment-specific configuration used with Docker Compose.

## Quick Start

### For Staging Environment

```bash
# 1. Copy the template
cp .env.staging.template .env.staging

# 2. Edit with your staging values
# Windows: notepad .env.staging
# Linux/Mac: nano .env.staging

# 3. Deploy
docker-compose -f docker-compose.yml -f docker-compose.staging.yml --env-file .env.staging up -d
```

### For Production Environment

```bash
# 1. Copy the template
cp .env.production.template .env.production

# 2. Edit with your production values (⚠️ use strong passwords!)
# Windows: notepad .env.production
# Linux/Mac: nano .env.production

# 3. Secure the file (Linux/Mac only)
chmod 600 .env.production

# 4. Deploy
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d
```

## Template Files

| File | Purpose | Git Tracked |
|------|---------|-------------|
| `.env.staging.template` | Staging configuration template | ✅ Yes |
| `.env.production.template` | Production configuration template | ✅ Yes |
| `.env.staging` | Actual staging config (created from template) | ❌ No (.gitignore) |
| `.env.production` | Actual production config (created from template) | ❌ No (.gitignore) |

## Configuration Variables

### Required Variables

- **CONNECTION_STRING** - Database connection string
- **SAFE_ORIGINS** - Allowed CORS origins (comma-separated)

### Service URLs (all required)
All microservice URLs must be configured. Default values use internal Docker network names.

### Optional Variables (have defaults)

- **ASPNETCORE_ENVIRONMENT** - Defaults to Staging/Production
- **RESTART_POLICY** - Defaults to unless-stopped/always
- **LOG_LEVEL** - Defaults to Information/Warning
- **GATEWAY_PORT** - Defaults to 80
- **CPU_LIMIT** - Defaults to 1.5/1
- **MEMORY_LIMIT** - Defaults to 512M

## Security Notes

⚠️ **Important:**
- Never commit `.env.staging` or `.env.production` to version control
- These files are already listed in `.gitignore`
- Use strong passwords for production databases
- Limit CORS origins to actual domains
- Protect production .env files with appropriate permissions

## Using with Docker Profiles Script

The environment files work seamlessly with the docker profile scripts:

```powershell
# Windows
.\scripts\docker-profiles.ps1 -Profile All -Action up

# Linux/Mac
./scripts/docker-profiles.sh all up
```

The scripts will automatically use the correct environment based on the compose file you specify.
