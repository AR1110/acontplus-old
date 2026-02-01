# AWS Application Load Balancer Configuration Guide

This guide provides AWS CLI commands for configuring Application Load Balancers following the AcontPlus naming conventions.

> **Reference:** See [AWS-Naming-Convention.md](../../docs/AWS-Naming-Convention.md) for full naming standards.

---

## 1. Target Group Management

### Create Target Group

```bash
# Format: acontplus-{env}-{app-type}-{service}-tg
# Note: Target group names are limited to 32 characters. Use abbreviations if needed.

aws elbv2 create-target-group \
  --name acontplus-{env}-{app-type}-{service}-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id {VPC_ID} \
  --target-type ip \
  --health-check-path "/health" \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3

# Examples (Production):
aws elbv2 create-target-group \
  --name acp-prd-api-billing-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-02176c456642a9383 \
  --target-type ip

aws elbv2 create-target-group \
  --name acp-prd-api-sales-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-02176c456642a9383 \
  --target-type ip

aws elbv2 create-target-group \
  --name acp-prd-gtw-ocelot-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-02176c456642a9383 \
  --target-type ip

aws elbv2 create-target-group \
  --name acp-prd-web-client-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-02176c456642a9383 \
  --target-type ip
```

### List Target Groups

```bash
aws elbv2 describe-target-groups \
  --query "TargetGroups[*].{Name:TargetGroupName,ARN:TargetGroupArn,Port:Port}" \
  --output table
```

---

## 2. Load Balancer Management

### Create Application Load Balancer

```bash
# Format: acp-{env}-{purpose}-alb
# Note: ALB names are limited to 32 characters

aws elbv2 create-load-balancer \
  --name acp-{env}-{purpose}-alb \
  --subnets {SUBNET_ID_1} {SUBNET_ID_2} {SUBNET_ID_3} \
  --security-groups {SECURITY_GROUP_ID} \
  --scheme internet-facing \
  --type application

# Example - Main ERP Load Balancer:
aws elbv2 create-load-balancer \
  --name acp-prd-erp-alb \
  --subnets subnet-057b2f56f51de62ee subnet-0b9c5c1185466f2c8 subnet-07500f3abec27f804 \
  --security-groups sg-0b97cddbc968046e6 \
  --scheme internet-facing \
  --type application

# Example - API Gateway Load Balancer:
aws elbv2 create-load-balancer \
  --name acp-prd-api-alb \
  --subnets subnet-057b2f56f51de62ee subnet-0b9c5c1185466f2c8 \
  --security-groups sg-0b97cddbc968046e6 \
  --scheme internet-facing \
  --type application
```

### List Load Balancers

```bash
aws elbv2 describe-load-balancers \
  --query "LoadBalancers[*].{Name:LoadBalancerName,DNSName:DNSName,State:State.Code}" \
  --output table
```

---

## 3. Listener Configuration

### Create HTTPS Listener with Default Action

```bash
# Create listener with fixed 404 response as default (for host-based routing)
aws elbv2 create-listener \
  --load-balancer-arn {LOAD_BALANCER_ARN} \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn={ACM_CERTIFICATE_ARN} \
  --default-actions Type=fixed-response,FixedResponseConfig='{StatusCode=404,ContentType="text/plain",MessageBody="Not Found"}'

# Create listener with forward to target group as default
aws elbv2 create-listener \
  --load-balancer-arn {LOAD_BALANCER_ARN} \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn={ACM_CERTIFICATE_ARN} \
  --default-actions Type=forward,TargetGroupArn={TARGET_GROUP_ARN}
```

### Create HTTP to HTTPS Redirect Listener

```bash
aws elbv2 create-listener \
  --load-balancer-arn {LOAD_BALANCER_ARN} \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=redirect,RedirectConfig='{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}'
```

---

## 4. Listener Rules (Host-Based Routing)

### Rule Format

```bash
aws elbv2 create-rule \
  --listener-arn {LISTENER_ARN} \
  --priority {PRIORITY_NUMBER} \
  --conditions Field=host-header,Values='{HOSTNAME}' \
  --actions Type=forward,TargetGroupArn={TARGET_GROUP_ARN}
```

### Example Rules Configuration

| Priority | Hostname | Target Group | Description |
|----------|----------|--------------|-------------|
| 10 | `api.acontplus.com` | `acp-prd-gtw-ocelot-tg` | API Gateway |
| 11 | `app.acontplus.com` | `acp-prd-web-client-tg` | Main Web Client |
| 12 | `admin.acontplus.com` | `acp-prd-web-admin-tg` | Admin Panel |
| 13 | `restaurant.acontplus.com` | `acp-prd-web-restaurant-tg` | Restaurant Module |
| 14 | `demo.acontplus.com` | `acp-prd-web-demo-tg` | Demo Environment |
| 15 | `docs.acontplus.com` | `acp-prd-web-invoice-tg` | Invoice/Documents |
| 99 | `*.acontplus.com` | - | Catch-all (404) |

### Create Rules

```bash
# API Gateway
aws elbv2 create-rule \
  --listener-arn {LISTENER_ARN} \
  --priority 10 \
  --conditions Field=host-header,Values='api.acontplus.com' \
  --actions Type=forward,TargetGroupArn={API_GATEWAY_TG_ARN}

# Main Web Client
aws elbv2 create-rule \
  --listener-arn {LISTENER_ARN} \
  --priority 11 \
  --conditions Field=host-header,Values='app.acontplus.com' \
  --actions Type=forward,TargetGroupArn={WEB_CLIENT_TG_ARN}

# Admin Panel
aws elbv2 create-rule \
  --listener-arn {LISTENER_ARN} \
  --priority 12 \
  --conditions Field=host-header,Values='admin.acontplus.com' \
  --actions Type=forward,TargetGroupArn={ADMIN_TG_ARN}

# Restaurant Module
aws elbv2 create-rule \
  --listener-arn {LISTENER_ARN} \
  --priority 13 \
  --conditions Field=host-header,Values='restaurant.acontplus.com' \
  --actions Type=forward,TargetGroupArn={RESTAURANT_TG_ARN}

# Demo Environment
aws elbv2 create-rule \
  --listener-arn {LISTENER_ARN} \
  --priority 14 \
  --conditions Field=host-header,Values='demo.acontplus.com' \
  --actions Type=forward,TargetGroupArn={DEMO_TG_ARN}

# Documents/Invoice
aws elbv2 create-rule \
  --listener-arn {LISTENER_ARN} \
  --priority 15 \
  --conditions Field=host-header,Values='docs.acontplus.com' \
  --actions Type=forward,TargetGroupArn={INVOICE_TG_ARN}
```

### List Rules

```bash
aws elbv2 describe-rules --listener-arn {LISTENER_ARN} \
  --query "Rules[*].{Priority:Priority,Conditions:Conditions[0].Values[0],TargetGroup:Actions[0].TargetGroupArn}" \
  --output table
```

### Modify Rule Priority

```bash
aws elbv2 set-rule-priorities \
  --rule-priorities RuleArn={RULE_ARN},Priority={NEW_PRIORITY}
```

### Delete Rule

```bash
aws elbv2 delete-rule --rule-arn {RULE_ARN}
```

---

## 5. Connect ECS Service to Load Balancer

### Update ECS Service with Load Balancer

```bash
aws ecs update-service \
  --cluster acontplus-{env}-ecs \
  --service acontplus-{env}-{app-type}-{service}-svc \
  --load-balancers "targetGroupArn={TARGET_GROUP_ARN},containerName=acontplus-{app-type}-{service},containerPort=80"
```

---

## 6. SSL Certificate Management

### List Certificates

```bash
aws acm list-certificates \
  --query "CertificateSummaryList[*].{Domain:DomainName,ARN:CertificateArn,Status:Status}" \
  --output table
```

### Request New Certificate

```bash
aws acm request-certificate \
  --domain-name "*.acontplus.com" \
  --subject-alternative-names "acontplus.com" \
  --validation-method DNS
```

---

## Quick Reference: Naming Convention for ALB Resources

| Resource Type | Format | Example | Max Length |
|---------------|--------|---------|------------|
| Load Balancer | `acp-{env}-{purpose}-alb` | `acp-prd-erp-alb` | 32 |
| Target Group | `acp-{env}-{app}-{svc}-tg` | `acp-prd-api-billing-tg` | 32 |
| Listener Rule | (by priority) | Priority 10-99 | - |

### Abbreviations for 32-char Limit

| Full Name | Abbreviation |
|-----------|--------------|
| `acontplus` | `acp` |
| `production` | `prd` |
| `staging` | `stg` |
| `development` | `dev` |
| `restaurant` | `rest` |
| `accounting` | `acct` |
| `configuration` | `cfg` |
| `notifications` | `notif` |
| `technical-support` | `techsup` |

---

## Health Check Configuration

### Recommended Settings

```bash
aws elbv2 modify-target-group \
  --target-group-arn {TARGET_GROUP_ARN} \
  --health-check-path "/health" \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --matcher HttpCode=200
```

---

## Troubleshooting

### Check Target Health

```bash
aws elbv2 describe-target-health --target-group-arn {TARGET_GROUP_ARN}
```

### Check Load Balancer Attributes

```bash
aws elbv2 describe-load-balancer-attributes --load-balancer-arn {LOAD_BALANCER_ARN}
```

### Enable Access Logs

```bash
aws elbv2 modify-load-balancer-attributes \
  --load-balancer-arn {LOAD_BALANCER_ARN} \
  --attributes Key=access_logs.s3.enabled,Value=true \
               Key=access_logs.s3.bucket,Value=acontplus-prd-str-alb-logs-s3 \
               Key=access_logs.s3.prefix,Value=alb-logs
```

---

## Related Documentation

- [AWS Naming Convention](../../docs/AWS-Naming-Convention.md)
- [ECS Deployment Guide](./ecs-deployment-guide.md)
