# AcontPlus EC2 Deployment Commands Reference

Quick reference commands for deploying and managing AcontPlus services with systemd.

---

## Service File Operations

### Copy service file

```bash
# API Services
sudo cp acontplus-prd-api-{service}.service /etc/systemd/system/

# Web Applications
sudo cp acontplus-prd-web-{app}.service /etc/systemd/system/

# Gateway
sudo cp acontplus-prd-gtw-ocelot.service /etc/systemd/system/
```

### Create/Edit service file

```bash
sudo nano /etc/systemd/system/acontplus-prd-api-{service}.service
```

---

## Systemd Commands

### Reload systemd (required after changes)

```bash
sudo systemctl daemon-reload
```

### Enable service at boot

```bash
sudo systemctl enable acontplus-prd-api-{service}.service
```

### Start service

```bash
sudo systemctl start acontplus-prd-api-{service}.service
```

### Stop service

```bash
sudo systemctl stop acontplus-prd-api-{service}.service
```

### Restart service

```bash
sudo systemctl restart acontplus-prd-api-{service}.service
```

### Check status

```bash
sudo systemctl status acontplus-prd-api-{service}.service
```

---

## Log Commands

### View all logs

```bash
sudo journalctl -u acontplus-prd-api-{service}.service
```

### Real-time logs

```bash
sudo journalctl -u acontplus-prd-api-{service}.service -f
```

### Last N lines

```bash
sudo journalctl -u acontplus-prd-api-{service}.service -n 100
```

### Logs since today

```bash
sudo journalctl -u acontplus-prd-api-{service}.service --since today
```

---

## Batch Commands

### Deploy all API services

```bash
# Copy all service files
for service in identity accounting billing sales inventory purchases restaurant common configuration mechanical vet techsupport barbershop; do
  sudo cp acontplus-prd-api-${service}.service /etc/systemd/system/
done

# Also gateway
sudo cp acontplus-prd-gtw-ocelot.service /etc/systemd/system/

# Reload and enable
sudo systemctl daemon-reload

for service in identity accounting billing sales inventory purchases restaurant common configuration mechanical vet techsupport barbershop; do
  sudo systemctl enable acontplus-prd-api-${service}.service
  sudo systemctl start acontplus-prd-api-${service}.service
done

# Gateway
sudo systemctl enable acontplus-prd-gtw-ocelot.service
sudo systemctl start acontplus-prd-gtw-ocelot.service
```

### List all AcontPlus services

```bash
systemctl list-units --type=service | grep acontplus
```

### Check all services status

```bash
for service in identity accounting billing sales inventory purchases restaurant common configuration mechanical vet techsupport barbershop; do
  echo "=== API ${service} ==="
  sudo systemctl is-active acontplus-prd-api-${service}.service
done
```

### Stop all services

```bash
for service in identity accounting billing sales inventory purchases restaurant common configuration mechanical vet techsupport barbershop; do
  sudo systemctl stop acontplus-prd-api-${service}.service
done
sudo systemctl stop acontplus-prd-gtw-ocelot.service
```

---

## Service Names Reference

| Component | Service File |
|-----------|-------------|
| Ocelot Gateway | `acontplus-prd-gtw-ocelot.service` |
| Identity API | `acontplus-prd-api-identity.service` |
| Accounting API | `acontplus-prd-api-accounting.service` |
| Billing API | `acontplus-prd-api-billing.service` |
| Sales API | `acontplus-prd-api-sales.service` |
| Inventory API | `acontplus-prd-api-inventory.service` |
| Purchases API | `acontplus-prd-api-purchases.service` |
| Restaurant API | `acontplus-prd-api-restaurant.service` |
| Common API | `acontplus-prd-api-common.service` |
| Configuration API | `acontplus-prd-api-configuration.service` |
| Mechanical API | `acontplus-prd-api-mechanical.service` |
| Vet API | `acontplus-prd-api-vet.service` |
| TechSupport API | `acontplus-prd-api-techsupport.service` |
| BarberShop API | `acontplus-prd-api-barbershop.service` |
| Admin Web | `acontplus-prd-web-admin.service` |
| Restaurant Web | `acontplus-prd-web-restaurant.service` |
| Invoice Web | `acontplus-prd-web-invoice.service` |
| WebUI | `acontplus-prd-web-webui.service` |

---

## Environment Files

### Create environment directory

```bash
sudo mkdir -p /etc/acontplus/env
```

### Create environment file

```bash
sudo nano /etc/acontplus/env/acontplus-api-{service}.env
```

### Reference in service file

Add to `[Service]` section:

```ini
EnvironmentFile=/etc/acontplus/env/acontplus-api-{service}.env
```

---

## Troubleshooting

### Service fails to start

```bash
# Check detailed status
sudo systemctl status acontplus-prd-api-{service}.service -l

# Check recent logs
sudo journalctl -u acontplus-prd-api-{service}.service -n 50 --no-pager

# Verify file permissions
ls -la /home/acontplus/services/acontplus-api-{service}/
```

### Port already in use

```bash
# Find process using port
sudo netstat -tulpn | grep :{PORT}
# or
sudo ss -tulpn | grep :{PORT}

# Kill process if needed
sudo kill -9 {PID}
```

### Check .NET runtime

```bash
dotnet --list-runtimes
dotnet --version
```
