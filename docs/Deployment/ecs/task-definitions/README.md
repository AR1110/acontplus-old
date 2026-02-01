# ECS Task Definition Templates

This directory contains ECS task definition templates following the AcontPlus naming conventions.

## Naming Convention

```
acontplus-{env}-{app-type}-{service}-task.json
```

Examples:
- `acontplus-prd-gtw-ocelot-task.json` → Gateway (Ocelot)
- `acontplus-prd-api-identity-task.json` → Identity API
- `acontplus-prd-api-billing-task.json` → Billing API
- `acontplus-prd-web-client-task.json` → Web Client

## Available Templates

| File | Service | Description |
|------|---------|-------------|
| `acontplus-prd-web-client-task.json` | Web Client | Angular frontend |
| `acontplus-prd-gtw-ocelot-task.json` | Gateway | Ocelot API Gateway |
| `acontplus-prd-api-identity-task.json` | Identity | Authentication service |
| `acontplus-prd-api-common-task.json` | Common | Shared API service |
| `acontplus-prd-api-restaurant-task.json` | Restaurant | Restaurant module |
| `acontplus-prd-api-mechanical-task.json` | Mechanical | Mechanical service |
| `acontplus-prd-api-vet-task.json` | Vet | Veterinary service |
| `acontplus-prd-api-techsupport-task.json` | TechSupport | Technical support |
| `acontplus-prd-api-combined-task.json` | Combined | Multi-container (Mech+Tech+Vet) |

## Template Variables

Replace these placeholders before deployment:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{ACCOUNT_ID}` | AWS Account ID | `123456789012` |
| `{ENV}` | Environment | `prd`, `stg`, `dev` |
| `{ENVIRONMENT}` | Full environment name | `Production`, `Staging` |
| `{REGION}` | AWS Region | `us-east-1` |

## Usage

### Register Task Definition

```bash
aws ecs register-task-definition --cli-input-json file://acontplus-prd-api-{service}-task.json
```

### List Task Definitions

```bash
aws ecs list-task-definitions --family-prefix acontplus-prd
```

## Secrets Manager References

All task definitions use the following naming convention for secrets:

```
arn:aws:secretsmanager:{REGION}:{ACCOUNT_ID}:secret:acontplus/{env}/{category}/{name}
```

Examples:
- `acontplus/prd/auth/jwt-secret`
- `acontplus/prd/db/main/connection-string`
- `acontplus/prd/aws/access-key`

## CloudWatch Log Groups

Log groups follow this pattern:

```
/acontplus/{env}/{app-type}/{service}
```

Examples:
- `/acontplus/prd/gtw/ocelot`
- `/acontplus/prd/api/identity`
- `/acontplus/prd/api/billing`

## Reference

- [AWS Naming Convention](../../../../docs/AWS-Naming-Convention.md)
- [ECS Deployment Guide](../../../../scripts/aws/ecs-deployment-guide.md)
