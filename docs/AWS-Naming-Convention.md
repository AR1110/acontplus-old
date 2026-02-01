# AWS Naming Convention Guide

This document defines the standard naming conventions for AWS resources in the AcontPlus infrastructure.

## General Format

```
{prefix}-{environment}-{app-type}-{service-name}-{aws-service}[-{qualifier}]
```

| Component       | Description                                      | Required |
|-----------------|--------------------------------------------------|----------|
| `prefix`        | Company identifier: `acontplus`                  | Yes      |
| `environment`   | Deployment environment                           | Yes      |
| `app-type`      | Type of application                              | Yes      |
| `service-name`  | Microservice or component name                   | Yes      |
| `aws-service`   | AWS service abbreviation                         | Yes      |
| `qualifier`     | Additional identifier (number, region, purpose)  | No       |

---

## Environment Identifiers

| Environment | Identifier | Description                          |
|-------------|------------|--------------------------------------|
| Production  | `prd`      | Live production environment          |
| Staging     | `stg`      | Pre-production/QA environment        |
| Development | `dev`      | Development and testing              |

---

## Application Type Identifiers

| App Type       | Identifier | Description                              |
|----------------|------------|------------------------------------------|
| Web Frontend   | `web`      | Angular, Razor Pages, static sites       |
| API Backend    | `api`      | REST APIs, microservices                 |
| Worker         | `wrk`      | Background jobs, scheduled tasks         |
| Gateway        | `gtw`      | API Gateways (Ocelot)                    |
| Database       | `db`       | Database instances                       |
| Cache          | `cch`      | Redis, ElastiCache                       |
| Storage        | `str`      | S3 buckets, file storage                 |
| Queue          | `que`      | SQS, message queues                      |
| Notification   | `ntf`      | SNS, notification services               |

---

## AWS Service Abbreviations

| AWS Service                  | Abbreviation | Example Usage                          |
|------------------------------|--------------|----------------------------------------|
| EC2 Instance                 | `ec2`        | Virtual servers                        |
| Elastic Load Balancer (ALB)  | `alb`        | Application Load Balancer              |
| Elastic Load Balancer (NLB)  | `nlb`        | Network Load Balancer                  |
| ECS Cluster                  | `ecs`        | Container orchestration cluster        |
| ECS Service                  | `svc`        | ECS service definition                 |
| ECS Task Definition          | `task`       | Task definitions                       |
| ECR Repository               | `ecr`        | Container image registry               |
| RDS Instance                 | `rds`        | Relational Database Service            |
| S3 Bucket                    | `s3`         | Object storage                         |
| Lambda Function              | `lmb`        | Serverless functions                   |
| API Gateway                  | `apigw`      | AWS API Gateway                        |
| CloudFront                   | `cf`         | CDN distribution                       |
| Route 53                     | `r53`        | DNS records                            |
| VPC                          | `vpc`        | Virtual Private Cloud                  |
| Subnet                       | `snet`       | VPC Subnets                            |
| Security Group               | `sg`         | Security groups                        |
| IAM Role                     | `role`       | IAM roles                              |
| IAM Policy                   | `pol`        | IAM policies                           |
| CloudWatch Log Group         | `cwlg`       | Log groups                             |
| CloudWatch Alarm             | `cwa`        | Monitoring alarms                      |
| Secrets Manager              | `sm`         | Secrets storage                        |
| Parameter Store              | `ssm`        | Systems Manager Parameter Store        |
| SQS Queue                    | `sqs`        | Simple Queue Service                   |
| SNS Topic                    | `sns`        | Simple Notification Service            |
| ElastiCache                  | `ec`         | Redis/Memcached clusters               |
| Target Group                 | `tg`         | ALB/NLB Target Groups                  |
| NAT Gateway                  | `nat`        | NAT Gateways                           |
| Internet Gateway             | `igw`        | Internet Gateways                      |
| Elastic IP                   | `eip`        | Elastic IP addresses                   |

---

## Microservice Names

Based on the AcontPlus architecture:

| Service            | Identifier         |
|--------------------|-------------------|
| Accounting         | `accounting`      |
| Billing            | `billing`         |
| Sales              | `sales`           |
| Inventory          | `inventory`       |
| Restaurant         | `restaurant`      |
| Veterinary         | `vet`             |
| Mechanical         | `mechanical`      |
| Loyalty            | `loyalty`         |
| Identity           | `identity`        |
| Configuration      | `configuration`   |
| Common             | `common`          |
| Purchases          | `purchases`       |
| Technical Support  | `techsupport`     |
| Barbershop         | `barbershop`      |
| Ocelot Gateway     | `ocelot`          |
| Web UI (Razor)     | `webui`           |
| Client (Angular)   | `client`          |
| Backoffice         | `backoffice`      |

---

## Naming Examples by AWS Service

### EC2 Instances

```
acontplus-prd-api-billing-ec2-01
acontplus-stg-api-sales-ec2-01
acontplus-dev-web-client-ec2-01
acontplus-prd-wrk-inventory-ec2-01
```

### Elastic Load Balancers (ALB/NLB)

```
acontplus-prd-api-alb
acontplus-prd-web-alb
acontplus-stg-api-alb
acontplus-dev-gtw-ocelot-alb
```

### Target Groups

```
acontplus-prd-api-billing-tg
acontplus-prd-api-sales-tg
acontplus-stg-web-client-tg
```

### ECS Clusters

```
acontplus-prd-ecs
acontplus-stg-ecs
acontplus-dev-ecs
```

### ECS Services

```
acontplus-prd-api-billing-svc
acontplus-prd-api-sales-svc
acontplus-stg-gtw-ocelot-svc
acontplus-dev-api-inventory-svc
```

### ECS Task Definitions

```
acontplus-prd-api-billing-task
acontplus-stg-api-accounting-task
acontplus-dev-wrk-notifications-task
```

### ECR Repositories

```
acontplus-api-billing
acontplus-api-sales
acontplus-api-accounting
acontplus-gtw-ocelot
acontplus-web-client
acontplus-web-webui
```

> **Note:** ECR repositories are environment-agnostic. Images are tagged with environment/version:
> - `acontplus-api-billing:prd-1.0.0`
> - `acontplus-api-billing:stg-latest`
> - `acontplus-api-billing:dev-feature-xyz`

### RDS Instances

```
acontplus-prd-db-main-rds
acontplus-stg-db-main-rds
acontplus-dev-db-main-rds
```

### S3 Buckets

```
acontplus-prd-str-documents-s3
acontplus-prd-str-backups-s3
acontplus-stg-str-uploads-s3
acontplus-dev-str-logs-s3
```

> **Note:** S3 bucket names must be globally unique. Consider adding region or account ID if needed:
> - `acontplus-prd-str-documents-s3-us-east-1`

### Security Groups

```
acontplus-prd-api-sg
acontplus-prd-db-sg
acontplus-prd-alb-sg
acontplus-stg-ecs-sg
```

### IAM Roles

```
acontplus-prd-api-billing-role
acontplus-prd-ecs-task-role
acontplus-stg-lambda-role
acontplus-dev-ci-deploy-role
```

### IAM Policies

```
acontplus-prd-s3-access-pol
acontplus-prd-secrets-read-pol
acontplus-stg-ecs-exec-pol
```

### CloudWatch Log Groups

```
/acontplus/prd/api/billing
/acontplus/prd/api/sales
/acontplus/stg/gtw/ocelot
/acontplus/dev/wrk/notifications
```

### CloudWatch Alarms

```
acontplus-prd-api-billing-cpu-cwa
acontplus-prd-api-billing-memory-cwa
acontplus-prd-rds-connections-cwa
acontplus-stg-alb-5xx-cwa
```

### Secrets Manager

```
acontplus/prd/db/main/credentials
acontplus/prd/api/billing/secrets
acontplus/stg/api/identity/jwt-key
acontplus/dev/external/stripe-key
```

### Parameter Store (SSM)

```
/acontplus/prd/api/billing/config
/acontplus/prd/common/connection-string
/acontplus/stg/api/sales/feature-flags
```

### SQS Queues

```
acontplus-prd-que-billing-notifications-sqs
acontplus-prd-que-inventory-updates-sqs
acontplus-stg-que-email-sqs
acontplus-prd-que-billing-notifications-sqs-dlq  # Dead Letter Queue
```

### SNS Topics

```
acontplus-prd-ntf-order-created-sns
acontplus-prd-ntf-payment-received-sns
acontplus-stg-ntf-alerts-sns
```

### Lambda Functions

```
acontplus-prd-api-billing-webhook-lmb
acontplus-prd-wrk-report-generator-lmb
acontplus-stg-api-inventory-sync-lmb
```

### VPC Resources

```
acontplus-prd-vpc
acontplus-prd-snet-public-a
acontplus-prd-snet-public-b
acontplus-prd-snet-private-a
acontplus-prd-snet-private-b
acontplus-prd-igw
acontplus-prd-nat-a
acontplus-prd-nat-b
acontplus-prd-rtb-public
acontplus-prd-rtb-private
```

### Elastic IPs

EIPs should include the associated resource name to identify their purpose:

```
acontplus-prd-eip-nat-a              # EIP for NAT Gateway in AZ-a
acontplus-prd-eip-nat-b              # EIP for NAT Gateway in AZ-b
acontplus-prd-eip-ec2-bastion        # EIP for Bastion EC2 instance
acontplus-prd-eip-ec2-legacy-01      # EIP for Legacy EC2 instance
acontplus-prd-eip-ec2-legacy-02      # EIP for Legacy EC2 instance
acontplus-prd-eip-nlb                # EIP for Network Load Balancer
```

> **Pattern:** `{prefix}-{env}-eip-{resource-type}-{resource-name}[-{qualifier}]`

### CloudFront Distributions

```
acontplus-prd-web-client-cf
acontplus-prd-str-static-cf
acontplus-stg-web-backoffice-cf
```

### Route 53 Records

DNS records follow domain naming conventions:
```
api.acontplus.com           → Production API Gateway
api-stg.acontplus.com       → Staging API Gateway
api-dev.acontplus.com       → Development API Gateway
app.acontplus.com           → Production Web Client
app-stg.acontplus.com       → Staging Web Client
```

---

## Tags Convention

All AWS resources must include the following tags:

| Tag Key       | Description                    | Example Value       |
|---------------|--------------------------------|---------------------|
| `Project`     | Project name                   | `AcontPlus`         |
| `Environment` | Deployment environment         | `prd`, `stg`, `dev` |
| `Service`     | Microservice name              | `billing`, `sales`  |
| `AppType`     | Application type               | `api`, `web`, `wrk` |
| `Owner`       | Team or person responsible     | `backend-team`      |
| `CostCenter`  | Cost allocation identifier     | `engineering`       |
| `ManagedBy`   | How resource is managed        | `terraform`, `manual` |
| `CreatedDate` | Resource creation date         | `2026-02-01`        |

### Example Tag Set

```json
{
  "Project": "AcontPlus",
  "Environment": "prd",
  "Service": "billing",
  "AppType": "api",
  "Owner": "backend-team",
  "CostCenter": "engineering",
  "ManagedBy": "terraform",
  "CreatedDate": "2026-02-01"
}
```

---

## Best Practices

### General Rules

1. **Lowercase Only**: Use lowercase letters for all resource names
2. **Hyphens for Separators**: Use hyphens (`-`) not underscores (`_`) for separating components
3. **No Special Characters**: Avoid special characters except hyphens
4. **Keep It Short**: Stay within AWS character limits (varies by service)
5. **Be Consistent**: Follow the convention strictly across all resources
6. **Be Descriptive**: Names should be self-explanatory

### Character Limits by Service

| Service              | Max Length | Notes                              |
|----------------------|------------|------------------------------------|
| EC2 Name Tag         | 255        | Effectively unlimited              |
| S3 Bucket            | 63         | Must be globally unique            |
| ECS Cluster          | 255        | -                                  |
| ECS Service          | 255        | -                                  |
| ECR Repository       | 256        | -                                  |
| RDS Instance         | 63         | Must start with a letter           |
| Lambda Function      | 64         | -                                  |
| IAM Role             | 64         | -                                  |
| Security Group       | 255        | Name, not Group Name               |
| ALB                  | 32         | Limited!                           |
| Target Group         | 32         | Limited!                           |
| SQS Queue            | 80         | -                                  |
| SNS Topic            | 256        | -                                  |

### Handling Short Character Limits (ALB/Target Groups)

For services with 32-character limits, use abbreviated format:

```
# Standard format (may exceed limit):
acontplus-prd-api-techsupport-alb  # 33 chars - TOO LONG

# Abbreviated format:
acp-prd-api-techsup-alb            # 23 chars - OK
acp-prd-api-billing-tg             # 22 chars - OK
```

**Abbreviated Prefix**: `acp` instead of `acontplus` when needed.

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ACONTPLUS AWS NAMING CONVENTION                  │
├─────────────────────────────────────────────────────────────────────┤
│  Format: {prefix}-{env}-{app}-{service}-{aws}[-{qualifier}]        │
├─────────────────────────────────────────────────────────────────────┤
│  Prefix:    acontplus (or acp for short names)                     │
│  Env:       prd | stg | dev                                        │
│  App:       web | api | wrk | gtw | db | cch | str | que | ntf     │
│  Service:   billing | sales | accounting | inventory | etc.        │
│  AWS:       ec2 | alb | ecs | svc | task | ecr | rds | s3 | lmb   │
├─────────────────────────────────────────────────────────────────────┤
│  Examples:                                                          │
│    acontplus-prd-api-billing-ec2-01                                │
│    acontplus-prd-api-alb                                           │
│    acontplus-prd-api-billing-svc                                   │
│    acontplus-api-billing:prd-1.0.0  (ECR image tag)               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Changelog

| Date       | Version | Description            |
|------------|---------|------------------------|
| 2026-02-01 | 1.0.0   | Initial documentation  |
