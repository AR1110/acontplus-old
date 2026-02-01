# ECS Service Definition Template

This directory contains ECS service definition templates following the AcontPlus naming conventions.

## Naming Convention

```
acontplus-{env}-{app-type}-{service}-svc.json
```

Examples:
- `acontplus-prd-gtw-ocelot-svc.json`
- `acontplus-prd-api-identity-svc.json`
- `acontplus-prd-api-billing-svc.json`
- `acontplus-prd-web-client-svc.json`

## Template Structure

```json
{
  "cluster": "acontplus-{env}-ecs",
  "serviceName": "acontplus-{env}-{app-type}-{service}-svc",
  "taskDefinition": "acontplus-{env}-{app-type}-{service}-task",
  "desiredCount": 1,
  "launchType": "FARGATE",
  "networkConfiguration": {
    "awsvpcConfiguration": {
      "assignPublicIp": "ENABLED",
      "securityGroups": ["{SECURITY_GROUP_ID}"],
      "subnets": ["{SUBNET_ID_1}", "{SUBNET_ID_2}"]
    }
  }
}
```

## Usage

### Create Service from Definition

```bash
aws ecs create-service --cli-input-json file://acontplus-prd-api-{service}-svc.json
```

### Update Service

```bash
aws ecs update-service \
  --cluster acontplus-prd-ecs \
  --service acontplus-prd-api-{service}-svc \
  --task-definition acontplus-prd-api-{service}-task \
  --force-new-deployment
```

## Reference

- [AWS Naming Convention](../../../../docs/AWS-Naming-Convention.md)
- [ECS Deployment Guide](../../../../scripts/aws/ecs-deployment-guide.md)
