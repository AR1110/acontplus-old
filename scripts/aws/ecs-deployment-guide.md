# AWS ECS Deployment Guide

This guide provides AWS CLI commands for deploying services to ECS following the AcontPlus naming conventions.

> **Reference:** See [AWS-Naming-Convention.md](../../docs/AWS-Naming-Convention.md) for full naming standards.

---

## Prerequisites

### AWS CLI Authentication

```bash
# Configure AWS CLI (if not already configured)
aws configure

# Verify current identity
aws sts get-caller-identity
```

### ECR Authentication

```bash
# Login to ECR (replace with your account ID and region)
aws ecr get-login-password --region {REGION} | docker login --username AWS --password-stdin {ACCOUNT_ID}.dkr.ecr.{REGION}.amazonaws.com

# Example:
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin {ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com
```

---

## 1. ECR Repository Management

### Create Repository

```bash
# Format: acontplus-{app-type}-{service-name}
aws ecr create-repository --repository-name acontplus-{app-type}-{service-name}

# Examples:
aws ecr create-repository --repository-name acontplus-api-billing
aws ecr create-repository --repository-name acontplus-api-sales
aws ecr create-repository --repository-name acontplus-api-accounting
aws ecr create-repository --repository-name acontplus-gtw-ocelot
aws ecr create-repository --repository-name acontplus-web-client
aws ecr create-repository --repository-name acontplus-web-restaurant
aws ecr create-repository --repository-name acontplus-wrk-notifications
```

### Build and Push Images

```bash
# Build image with proper tag
# Format: {ACCOUNT_ID}.dkr.ecr.{REGION}.amazonaws.com/acontplus-{app-type}-{service}:{env}-{version}
docker build -t {ACCOUNT_ID}.dkr.ecr.{REGION}.amazonaws.com/acontplus-{app-type}-{service}:{env}-latest ./path/to/dockerfile

# Push to ECR
docker push {ACCOUNT_ID}.dkr.ecr.{REGION}.amazonaws.com/acontplus-{app-type}-{service}:{env}-latest

# Examples:
docker build -t {ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/acontplus-api-billing:prd-1.0.0 ./src/Services/Billing/Billing.Api
docker push {ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/acontplus-api-billing:prd-1.0.0
```

### List Repositories

```bash
aws ecr describe-repositories --query "repositories[*].{Name:repositoryName,URI:repositoryUri}" --output table
```

---

## 2. ECS Cluster Management

### Create Cluster

```bash
# Format: acontplus-{env}-ecs
aws ecs create-cluster --cluster-name acontplus-{env}-ecs

# Examples:
aws ecs create-cluster --cluster-name acontplus-prd-ecs
aws ecs create-cluster --cluster-name acontplus-stg-ecs
aws ecs create-cluster --cluster-name acontplus-dev-ecs
```

### List Clusters

```bash
aws ecs list-clusters --output table
```

---

## 3. Task Definition

### Register Task Definition

```bash
# Register from JSON file
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### Task Definition Template

Create a file `task-definition.json`:

```json
{
  "family": "acontplus-{env}-{app-type}-{service}-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::{ACCOUNT_ID}:role/acontplus-{env}-ecs-task-role",
  "containerDefinitions": [
    {
      "name": "acontplus-{app-type}-{service}",
      "image": "{ACCOUNT_ID}.dkr.ecr.{REGION}.amazonaws.com/acontplus-{app-type}-{service}:{env}-latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "secrets": [
        {
          "name": "ConnectionStrings__DefaultConnection",
          "valueFrom": "arn:aws:secretsmanager:{REGION}:{ACCOUNT_ID}:secret:acontplus/{env}/db/{service}/connection-string"
        }
      ],
      "environment": [
        {
          "name": "ASPNETCORE_ENVIRONMENT",
          "value": "Production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/acontplus/{env}/{app-type}/{service}",
          "awslogs-region": "{REGION}",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

---

## 4. ECS Service Management

### Create Service

```bash
# Format: acontplus-{env}-{app-type}-{service}-svc
aws ecs create-service \
  --cluster acontplus-{env}-ecs \
  --service-name acontplus-{env}-{app-type}-{service}-svc \
  --task-definition acontplus-{env}-{app-type}-{service}-task:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[{SUBNET_ID_1},{SUBNET_ID_2}],securityGroups=[{SECURITY_GROUP_ID}],assignPublicIp=ENABLED}"

# Example - API Service:
aws ecs create-service \
  --cluster acontplus-prd-ecs \
  --service-name acontplus-prd-api-billing-svc \
  --task-definition acontplus-prd-api-billing-task:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-07500f3abec27f804,subnet-0b9c5c1185466f2c8],securityGroups=[sg-0b97cddbc968046e6],assignPublicIp=ENABLED}"

# Example - Worker Service:
aws ecs create-service \
  --cluster acontplus-prd-ecs \
  --service-name acontplus-prd-wrk-notifications-svc \
  --task-definition acontplus-prd-wrk-notifications-task:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-057b2f56f51de62ee],securityGroups=[sg-0337c2488dcfd66c0],assignPublicIp=ENABLED}"
```

### Update Service (Force New Deployment)

```bash
aws ecs update-service \
  --cluster acontplus-{env}-ecs \
  --service acontplus-{env}-{app-type}-{service}-svc \
  --task-definition acontplus-{env}-{app-type}-{service}-task:1 \
  --force-new-deployment
```

### Update Service Network Configuration

```bash
aws ecs update-service \
  --cluster acontplus-{env}-ecs \
  --service acontplus-{env}-{app-type}-{service}-svc \
  --network-configuration "awsvpcConfiguration={subnets=[{SUBNET_ID}],securityGroups=[{SECURITY_GROUP_ID}],assignPublicIp=ENABLED}"
```

### Attach Load Balancer to Service

```bash
aws ecs update-service \
  --cluster acontplus-{env}-ecs \
  --service acontplus-{env}-{app-type}-{service}-svc \
  --load-balancers "targetGroupArn={TARGET_GROUP_ARN},containerName=acontplus-{app-type}-{service},containerPort=80"
```

### List Services

```bash
aws ecs list-services --cluster acontplus-{env}-ecs --output table
```

---

## 5. Secrets Manager

### Create Secrets

```bash
# Format: acontplus/{env}/{category}/{name}
aws secretsmanager create-secret \
  --name "acontplus/{env}/db/{service}/connection-string" \
  --description "Database connection string for {service}" \
  --secret-string "{CONNECTION_STRING}"

# Examples:
aws secretsmanager create-secret \
  --name "acontplus/prd/db/main/connection-string" \
  --description "Main database connection string" \
  --secret-string "{YOUR_CONNECTION_STRING}"

aws secretsmanager create-secret \
  --name "acontplus/prd/auth/jwt-secret" \
  --description "JWT signing secret" \
  --secret-string "{YOUR_JWT_SECRET}"

aws secretsmanager create-secret \
  --name "acontplus/prd/api-gateway/url" \
  --description "API Gateway URL" \
  --secret-string "https://api.acontplus.com"
```

### Update Secret

```bash
aws secretsmanager update-secret \
  --secret-id "acontplus/{env}/db/{service}/connection-string" \
  --secret-string "{NEW_CONNECTION_STRING}"
```

### Get Secret Value

```bash
aws secretsmanager get-secret-value --secret-id "acontplus/{env}/db/{service}/connection-string"

# Get previous version
aws secretsmanager get-secret-value \
  --secret-id "acontplus/{env}/db/{service}/connection-string" \
  --version-stage AWSPREVIOUS
```

### List Secrets

```bash
aws secretsmanager list-secrets --query "SecretList[*].{Name:Name,ARN:ARN}" --output table
```

---

## 6. Parameter Store (SSM)

### Create Parameters

```bash
# Format: /acontplus/{env}/{category}/{name}
aws ssm put-parameter \
  --name "/acontplus/{env}/config/environment" \
  --type String \
  --value "Production"

# Examples:
aws ssm put-parameter --name "/acontplus/prd/config/environment" --type String --value "Production"
aws ssm put-parameter --name "/acontplus/stg/config/environment" --type String --value "Staging"
aws ssm put-parameter --name "/acontplus/dev/config/environment" --type String --value "Development"
```

### Get Parameter

```bash
aws ssm get-parameter --name "/acontplus/{env}/config/{name}"
```

---

## Quick Reference: Resource IDs

### VPC Resources (Production)

| Resource | ID | Name |
|----------|-----|------|
| VPC | `vpc-02176c456642a9383` | `acontplus-prd-vpc` |
| Subnet A | `subnet-07500f3abec27f804` | `acontplus-prd-snet-public-a` |
| Subnet B | `subnet-0b9c5c1185466f2c8` | `acontplus-prd-snet-public-b` |
| Subnet C | `subnet-057b2f56f51de62ee` | `acontplus-prd-snet-public-c` |
| Subnet D | `subnet-042ea48a0330849dc` | `acontplus-prd-snet-public-d` |
| Subnet E | `subnet-0c4a8c8754df52a55` | `acontplus-prd-snet-public-e` |
| Subnet F | `subnet-042881445c370b0aa` | `acontplus-prd-snet-public-f` |
| Security Group (ECS) | `sg-0b97cddbc968046e6` | `acontplus-prd-ecs-sg` |
| Security Group (DB) | `sg-0122fa572251b26d4` | `acontplus-prd-db-sg` |
| Security Group (Default) | `sg-0337c2488dcfd66c0` | `acontplus-prd-sg-default` |

---

## Useful Commands

```bash
# Check service status
aws ecs describe-services --cluster acontplus-{env}-ecs --services acontplus-{env}-{app-type}-{service}-svc

# View running tasks
aws ecs list-tasks --cluster acontplus-{env}-ecs --service-name acontplus-{env}-{app-type}-{service}-svc

# Stop a task
aws ecs stop-task --cluster acontplus-{env}-ecs --task {TASK_ARN}

# Scale service
aws ecs update-service --cluster acontplus-{env}-ecs --service acontplus-{env}-{app-type}-{service}-svc --desired-count 2

# View logs
aws logs tail /acontplus/{env}/{app-type}/{service} --follow
```

---

## Related Documentation

- [AWS Naming Convention](../../docs/AWS-Naming-Convention.md)
- [Load Balancer Configuration](./alb-configuration-guide.md)
- [AWS ECS Service Connect](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-service-connect.html)
