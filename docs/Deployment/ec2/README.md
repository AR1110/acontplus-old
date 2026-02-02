# EC2 Systemd Service Deployment Guide

This guide provides instructions for deploying AcontPlus services on EC2 instances using systemd.

> **Note:** This is a **legacy** deployment method. For new deployments, consider using [ECS with Fargate](../../../scripts/aws/ecs-deployment-guide.md).

---

## Naming Convention

### Service File Names

```
acontplus-{env}-{app-type}-{service}.service
```

Examples:
- `acontplus-prd-gtw-ocelot.service`
- `acontplus-prd-api-identity.service`
- `acontplus-prd-api-billing.service`
- `acontplus-prd-web-admin.service`

### Directory Structure

```
/home/acontplus/
├── services/                    # API services and Gateway
│   ├── acontplus-gtw-ocelot/
│   ├── acontplus-api-identity/
│   ├── acontplus-api-accounting/
│   ├── acontplus-api-billing/
│   ├── acontplus-api-sales/
│   ├── acontplus-api-inventory/
│   ├── acontplus-api-purchases/
│   ├── acontplus-api-restaurant/
│   ├── acontplus-api-common/
│   ├── acontplus-api-configuration/
│   ├── acontplus-api-mechanical/
│   ├── acontplus-api-vet/
│   ├── acontplus-api-techsupport/
│   └── acontplus-api-barbershop/
└── web/                         # Web applications
    ├── acontplus-web-admin/
    ├── acontplus-web-restaurant/
    ├── acontplus-web-invoice/
    └── acontplus-web-webui/
```

### Syslog Identifiers

```
acontplus-{app-type}-{service}
```

Examples:
- `acontplus-gtw-ocelot`
- `acontplus-api-identity`
- `acontplus-web-admin`

---

## Service File Template

```ini
[Unit]
Description=AcontPlus {ServiceName} - {Environment}
After=network.target

[Service]
WorkingDirectory=/home/acontplus/services/acontplus-{app-type}-{service}
ExecStart=/usr/bin/dotnet /home/acontplus/services/acontplus-{app-type}-{service}/{Assembly}.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=acontplus-{app-type}-{service}
User=acontplus
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
Environment=ASPNETCORE_URLS=http://0.0.0.0:{PORT}

[Install]
WantedBy=multi-user.target
```

---

## Deployment Steps

### 1. Copy the service file

```bash
sudo cp acontplus-prd-{app-type}-{service}.service /etc/systemd/system/
```

Or create directly:

```bash
sudo nano /etc/systemd/system/acontplus-prd-{app-type}-{service}.service
```

### 2. Reload systemd

```bash
sudo systemctl daemon-reload
```

### 3. Enable service at boot

```bash
sudo systemctl enable acontplus-prd-{app-type}-{service}.service
```

### 4. Start the service

```bash
sudo systemctl start acontplus-prd-{app-type}-{service}.service
```

### 5. Check service status

```bash
sudo systemctl status acontplus-prd-{app-type}-{service}.service
```

### 6. View logs

```bash
# Full logs
sudo journalctl -u acontplus-prd-{app-type}-{service}.service

# Real-time logs
sudo journalctl -u acontplus-prd-{app-type}-{service}.service -f

# Last 100 lines
sudo journalctl -u acontplus-prd-{app-type}-{service}.service -n 100
```

---

## Port Assignments

| Service | Port | Service File |
|---------|------|--------------|
| Ocelot Gateway | 5001 | `acontplus-prd-gtw-ocelot.service` |
| Identity API | 5007 | `acontplus-prd-api-identity.service` |
| Accounting API | 5005 | `acontplus-prd-api-accounting.service` |
| Billing API | 5003 | `acontplus-prd-api-billing.service` |
| Sales API | 5013 | `acontplus-prd-api-sales.service` |
| Inventory API | 5008 | `acontplus-prd-api-inventory.service` |
| Purchases API | 5010 | `acontplus-prd-api-purchases.service` |
| Restaurant API | 5011 | `acontplus-prd-api-restaurant.service` |
| Common API | 5004 | `acontplus-prd-api-common.service` |
| Configuration API | 5006 | `acontplus-prd-api-configuration.service` |
| Mechanical API | 5009 | `acontplus-prd-api-mechanical.service` |
| Vet API | 5014 | `acontplus-prd-api-vet.service` |
| TechSupport API | 5012 | `acontplus-prd-api-techsupport.service` |
| BarberShop API | 5002 | `acontplus-prd-api-barbershop.service` |
| Admin Web | 8000 | `acontplus-prd-web-admin.service` |
| Restaurant Web | 8001 | `acontplus-prd-web-restaurant.service` |
| Invoice Web | 8002 | `acontplus-prd-web-invoice.service` |
| WebUI | 8003 | `acontplus-prd-web-webui.service` |

---

## Useful Commands

### Stop a service

```bash
sudo systemctl stop acontplus-prd-{app-type}-{service}.service
```

### Restart a service

```bash
sudo systemctl restart acontplus-prd-{app-type}-{service}.service
```

### Disable service at boot

```bash
sudo systemctl disable acontplus-prd-{app-type}-{service}.service
```

### List all AcontPlus services

```bash
systemctl list-units --type=service | grep acontplus
```

### Check all services status

```bash
systemctl status 'acontplus-prd-*.service'
```

---

## Security Recommendations

1. **Don't run as root**: Use a dedicated `acontplus` user
2. **Limit permissions**: Set proper file permissions
3. **Use environment files**: Store secrets in `/etc/acontplus/env/{service}.env`

### Using Environment Files

Create environment file:

```bash
sudo mkdir -p /etc/acontplus/env
sudo nano /etc/acontplus/env/acontplus-api-identity.env
```

Content:

```ini
ConnectionStrings__DefaultConnection=Server=...;Database=...
JwtSettings__SecurityKey=your-secret-key
```

Update service file:

```ini
[Service]
EnvironmentFile=/etc/acontplus/env/acontplus-api-identity.env
```

---

## Migration to ECS

For production workloads, consider migrating to ECS:

- [ECS Deployment Guide](../../../scripts/aws/ecs-deployment-guide.md)
- [AWS Naming Convention](../../AWS-Naming-Convention.md)

---

## Related Documentation

- [AWS Naming Convention](../../AWS-Naming-Convention.md)
- [ECS Deployment Guide](../../../scripts/aws/ecs-deployment-guide.md)
- [Docker Compose Guide](../../Docker/Docker-Compose-Guide.md)
