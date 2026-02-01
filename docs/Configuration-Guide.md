# Configuration Guide for Local Docker Development

## Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Set up User Secrets** (for sensitive data like connection strings):
   ```bash
   cd src/Services/Identity/Identity.Api
   dotnet user-secrets init
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Your-Connection-String"
   ```

3. **Start services:**
   ```bash
   docker-compose up -d
   ```

## Common Configuration Scenarios

### Database Connection Strings

#### Option 1: Using User Secrets (Recommended)
```bash
cd src/Services/Accounting/Accounting.Api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=host.docker.internal,1433;Database=Accounting;User Id=sa;Password=YourPassword;TrustServerCertificate=True"
```

#### Option 2: Using .env file
Add to `.env`:
```
ConnectionStrings__DefaultConnection=Server=host.docker.internal,1433;Database=AcontPlus;User Id=sa;Password=YourPassword;TrustServerCertificate=True
```

#### Option 3: Using SQL Server in Docker
Add to `docker-compose.override.yml`:
```yaml
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: sqlserver
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=Strong@Password123
    ports:
      - "1433:1433"
    volumes:
      - sqlserver-data:/var/opt/mssql

volumes:
  sqlserver-data:
```

Then use connection string:
```
Server=sqlserver;Database=AcontPlus;User Id=sa;Password=Strong@Password123;TrustServerCertificate=True
```

### JWT Configuration

Set JWT secret via User Secrets:
```bash
cd src/Services/Identity/Identity.Api
dotnet user-secrets set "JwtSettings:SecretKey" "your-super-secret-key-min-32-characters-long"
dotnet user-secrets set "JwtSettings:Issuer" "AcontPlus"
dotnet user-secrets set "JwtSettings:Audience:0" "ocelot.service"
```

Or via environment variables in `docker-compose.override.yml`:
```yaml
identity.api:
  environment:
    - JwtSettings__SecretKey=your-super-secret-key-min-32-characters-long
    - JwtSettings__Issuer=AcontPlus
```

### CORS Origins

Add to `docker-compose.override.yml` for Ocelot:
```yaml
ocelot.api:
  environment:
    - SafeOrigins=https://localhost:7166,http://localhost:4200,http://localhost:5001
```

### Logging Configuration

#### Change Log Level
In `docker-compose.override.yml`:
```yaml
accounting.api:
  environment:
    - Serilog__MinimumLevel__Default=Debug
    - Serilog__MinimumLevel__Override__Microsoft=Warning
```

#### Disable File Logging
```yaml
accounting.api:
  environment:
    - AdvancedLogging__EnableLocalFile=false
```

### Service-to-Service URLs

These are already configured in `docker-compose.override.yml` for the Ocelot gateway:
```yaml
ocelot.api:
  environment:
    - ServiceUrls__IdentityApi=http://identity.api:8080
    - ServiceUrls__AccountingApi=http://accounting.api:8080
    # etc...
```

Customize if needed for your environment.

### External Services (Redis, RabbitMQ, etc.)

Add to `docker-compose.override.yml`:
```yaml
services:
  redis:
    image: redis:alpine
    container_name: redis
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: rabbitmq
    environment:
      - RABBITMQ_DEFAULT_USER=guest
      - RABBITMQ_DEFAULT_PASS=guest
    ports:
      - "5672:5672"
      - "15672:15672"
```

Then configure in your services:
```yaml
accounting.api:
  environment:
    - Redis__ConnectionString=redis:6379
    - RabbitMQ__Host=rabbitmq
    - RabbitMQ__Username=guest
    - RabbitMQ__Password=guest
```

## Configuration Hierarchy

Remember, configuration is loaded in this order (last wins):

1. `appsettings.json` (in Docker image)
2. `appsettings.Development.json` (in Docker image)
3. User Secrets (mounted volume)
4. Environment Variables (docker-compose)
5. Command Line Arguments

## Tips

### View effective configuration
```bash
docker-compose exec identity.api dotnet run --urls "http://0.0.0.0:8080"
# Check startup logs for configuration values
```

### Debug configuration issues
```bash
# View environment variables in running container
docker-compose exec identity.api env | grep -i connection

# Check User Secrets mount
docker-compose exec identity.api ls -la /home/app/.microsoft/usersecrets/
```

### Override for a single service
Create `docker-compose.override.local.yml` (gitignored):
```yaml
services:
  identity.api:
    environment:
      - Serilog__MinimumLevel__Default=Verbose
      - MyCustomSetting__Value=test
```

Run with:
```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.override.local.yml up -d
```

## Common Issues

### Connection refused to host services
Use `host.docker.internal` instead of `localhost` to connect from Docker container to host machine:
```
Server=host.docker.internal,1433;...
```

### User Secrets not loading
Ensure the secrets are set for the correct project ID:
```bash
cd src/Services/Identity/Identity.Api
cat Identity.Api.csproj | grep UserSecretsId
# Use this ID to verify secrets location:
# Windows: %APPDATA%\Microsoft\UserSecrets\{UserSecretsId}\secrets.json
```

### Logs not appearing
Check if the logs directory exists and has write permissions:
```bash
mkdir -p logs/identity
docker-compose restart identity.api
```

### Environment variables not taking effect
Rebuild the containers after changing environment variables:
```bash
docker-compose down
docker-compose up -d --build
```

## AWS Production Configuration

For AWS ECS deployments, configuration is managed through:

### Secrets Manager
Sensitive data like connection strings and API keys:
```
acontplus/{env}/db/main/connection-string
acontplus/{env}/auth/jwt-secret
acontplus/{env}/aws/access-key
```

### Parameter Store (SSM)
Non-sensitive configuration:
```
/acontplus/{env}/config/environment
/acontplus/{env}/api/billing/feature-flags
```

See [AWS Naming Convention](AWS-Naming-Convention.md) and [ECS Deployment Guide](../scripts/aws/ecs-deployment-guide.md) for details.
