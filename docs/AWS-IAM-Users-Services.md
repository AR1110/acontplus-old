# AWS IAM - Usuarios y Servicios AcontPlus

## Resumen de Implementación

Este documento define los usuarios IAM Identity Center (personas) y usuarios IAM clásico (servicios) para AcontPlus.

---

## 1. Usuarios Humanos → IAM Identity Center (SSO)

### Nomenclatura
```
Formato email: {nombre}.{apellido}@acontplus.com
Username SSO:  {primera-letra-nombre}{apellido}
```

### Equipo AcontPlus

| Persona | Username SSO | Email | Grupo | Permission Set |
|---------|--------------|-------|-------|----------------|
| Ivan Fernando Paz | `ipaz` | ivan.paz@acontplus.com | acontplus-grp-admins | acontplus-ps-admin |
| Emilio Senguana | `esenguana` | emilio.senguana@acontplus.com | acontplus-grp-developers | acontplus-ps-developer |
| Danis Manchu | `dmanchu` | danis.manchu@acontplus.com | acontplus-grp-developers | acontplus-ps-developer |
| Alexis Ramirez | `aramirez` | alexis.ramirez@acontplus.com | acontplus-grp-developers | acontplus-ps-developer |
| Alex Davila | `adavila` | alex.davila@acontplus.com | acontplus-grp-support | acontplus-ps-support |
| Christian Zarate | `czarate` | christian.zarate@acontplus.com | acontplus-grp-finance | acontplus-ps-finance |

### Grupos en Identity Center

```
┌─────────────────────────────────────────────────────────────────┐
│                  IDENTITY CENTER GROUPS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  👥 acontplus-grp-admins                                        │
│     └── ipaz                                                    │
│     └── Permission Set: acontplus-ps-admin                      │
│                                                                  │
│  👥 acontplus-grp-developers                                    │
│     └── esenguana, dmanchu, aramirez                            │
│     └── Permission Set: acontplus-ps-developer                  │
│                                                                  │
│  👥 acontplus-grp-support                                       │
│     └── adavila                                                  │
│     └── Permission Set: acontplus-ps-support                    │
│                                                                  │
│  👥 acontplus-grp-finance                                       │
│     └── czarate                                                  │
│     └── Permission Set: acontplus-ps-finance                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Permission Sets (Identity Center)

#### acontplus-ps-admin
```
Permisos:
├── AWS Managed: AdministratorAccess
└── Session Duration: 8 horas
```

#### acontplus-ps-developer
```
Permisos:
├── AWS Managed: PowerUserAccess
├── Custom: acontplus-policy-deny-iam-dangerous
├── Custom: acontplus-policy-deny-prod-delete
└── Session Duration: 8 horas

Acceso a:
✅ ECS, ECR, Lambda, S3, RDS (read), CloudWatch, X-Ray
✅ Secrets Manager (solo lectura)
✅ CloudFormation (stacks acontplus-dev-*, acontplus-stg-*)
❌ IAM Users/Roles/Policies
❌ VPC creation/deletion
❌ Billing
❌ Eliminar recursos de producción
```

#### acontplus-ps-support
```
Permisos:
├── AWS Managed: ViewOnlyAccess
├── Custom: acontplus-policy-support-logs
└── Session Duration: 4 horas

Acceso a:
✅ CloudWatch Logs (lectura)
✅ ECS (describe, list)
✅ RDS (describe)
✅ S3 (list, get)
❌ Modificar cualquier recurso
❌ Secrets Manager
❌ IAM
```

#### acontplus-ps-finance
```
Permisos:
├── AWS Managed: Billing
├── AWS Managed: AWSBudgetsReadOnlyAccess
├── Custom: acontplus-policy-cost-explorer
└── Session Duration: 4 horas

Acceso a:
✅ Billing Dashboard
✅ Cost Explorer
✅ Budgets
✅ Cost and Usage Reports
❌ Cualquier servicio técnico
```

---

## 2. Usuarios de Servicio → IAM Clásico

### Estrategia: Un Usuario de Servicio + Roles

> **Recomendación**: Usar UN solo usuario IAM para CI/CD que asume diferentes roles según la tarea.

```
┌─────────────────────────────────────────────────────────────────┐
│              ESTRATEGIA DE SERVICIO RECOMENDADA                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   👤 acontplus-svc-cicd (IAM User)                              │
│       │                                                          │
│       ├──► AssumeRole ──► acontplus-role-cicd-ecr-push          │
│       │                   (push imágenes a ECR)                  │
│       │                                                          │
│       ├──► AssumeRole ──► acontplus-role-cicd-ecs-deploy        │
│       │                   (deploy a ECS)                         │
│       │                                                          │
│       ├──► AssumeRole ──► acontplus-role-cicd-s3-deploy         │
│       │                   (deploy frontend a S3)                 │
│       │                                                          │
│       └──► AssumeRole ──► acontplus-role-cicd-cloudformation    │
│                           (ejecutar stacks CFN)                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Nomenclatura Usuarios de Servicio

```
acontplus-svc-{propósito}
```

### Usuarios de Servicio

| Usuario IAM | Propósito | Access Keys | Roles que puede asumir |
|-------------|-----------|-------------|------------------------|
| `acontplus-svc-cicd` | GitHub Actions / Azure DevOps | Sí | Todos los roles cicd-* |
| `acontplus-svc-monitoring` | Datadog / Grafana (si aplica) | Sí | acontplus-role-monitoring-readonly |
| `acontplus-svc-backup` | Backup externo (si aplica) | Sí | acontplus-role-backup-s3 |

### Alternativa Preferida: OIDC (Sin Access Keys)

Para GitHub Actions, usar **OIDC Federation** en lugar de Access Keys:

```
GitHub Actions ──► OIDC ──► AssumeRoleWithWebIdentity ──► acontplus-role-github-actions
                           (Sin access keys permanentes)
```

---

## 3. Roles IAM para Servicios

### Nomenclatura
```
acontplus-{env}-role-{servicio}-{propósito}
```

### Roles de Servicio (AWS Services)

| Rol | Servicio | Propósito |
|-----|----------|-----------|
| `acontplus-stg-role-ecs-task` | ECS | Permisos de la aplicación en runtime |
| `acontplus-stg-role-ecs-execution` | ECS | Pull de ECR, logs, secrets |
| `acontplus-stg-role-lambda-exec` | Lambda | Ejecución de funciones |
| `acontplus-stg-role-rds-monitoring` | RDS | Enhanced Monitoring |
| `acontplus-stg-role-vpc-flowlogs` | VPC | Escribir Flow Logs |
| `acontplus-stg-role-eventbridge` | EventBridge | Ejecutar targets |

### Roles de CI/CD (AssumeRole)

| Rol | Quién lo asume | Propósito |
|-----|----------------|-----------|
| `acontplus-role-cicd-ecr-push` | acontplus-svc-cicd | Push imágenes a ECR |
| `acontplus-role-cicd-ecs-deploy` | acontplus-svc-cicd | Update ECS services |
| `acontplus-role-cicd-s3-deploy` | acontplus-svc-cicd | Sync a S3 (frontend) |
| `acontplus-role-cicd-cloudformation` | acontplus-svc-cicd | Deploy stacks CFN |
| `acontplus-role-github-actions` | GitHub OIDC | CI/CD completo desde GitHub |

---

## 4. Políticas IAM

### Nomenclatura
```
acontplus-policy-{categoría}-{descripción}
```

### Catálogo de Políticas

#### Políticas Base
| Política | Descripción |
|----------|-------------|
| `acontplus-policy-base-readonly` | Lectura general de recursos |
| `acontplus-policy-base-tagging` | Crear/modificar tags |

#### Políticas de Servicio
| Política | Descripción |
|----------|-------------|
| `acontplus-policy-svc-ecr-push` | Push imágenes a ECR |
| `acontplus-policy-svc-ecr-pull` | Pull imágenes de ECR |
| `acontplus-policy-svc-ecs-deploy` | Deploy a ECS (update service) |
| `acontplus-policy-svc-ecs-exec` | ECS Exec (SSH a containers) |
| `acontplus-policy-svc-s3-app` | Acceso a buckets de aplicación |
| `acontplus-policy-svc-s3-deploy` | Sync frontend a S3 |
| `acontplus-policy-svc-secrets-read` | Leer secrets |
| `acontplus-policy-svc-ssm-read` | Leer parámetros SSM |
| `acontplus-policy-svc-kms-encrypt` | Encrypt/Decrypt con KMS |
| `acontplus-policy-svc-logs-write` | Escribir a CloudWatch Logs |

#### Políticas de Infraestructura
| Política | Descripción |
|----------|-------------|
| `acontplus-policy-infra-vpc` | Gestión completa de VPC |
| `acontplus-policy-infra-cloudformation` | Deploy de stacks CFN |
| `acontplus-policy-infra-route53` | Gestión de DNS |

#### Políticas de Denegación (Seguridad)
| Política | Descripción |
|----------|-------------|
| `acontplus-policy-deny-iam-dangerous` | Denegar crear usuarios/políticas |
| `acontplus-policy-deny-prod-delete` | Denegar eliminar recursos prd |
| `acontplus-policy-deny-regions` | Solo permitir us-east-1 |

---

## 5. Matriz de Asignación

### Permission Sets ↔ Políticas

```
acontplus-ps-admin
├── AdministratorAccess (AWS Managed)
└── Sin restricciones

acontplus-ps-developer
├── PowerUserAccess (AWS Managed)
├── acontplus-policy-deny-iam-dangerous
├── acontplus-policy-deny-prod-delete
└── acontplus-policy-svc-ecs-exec

acontplus-ps-support
├── ViewOnlyAccess (AWS Managed)
├── acontplus-policy-svc-logs-read
└── acontplus-policy-svc-ecs-describe

acontplus-ps-finance
├── Billing (AWS Managed)
├── AWSBudgetsReadOnlyAccess (AWS Managed)
└── CostExplorerReadOnlyAccess (AWS Managed)
```

### Roles CI/CD ↔ Políticas

```
acontplus-role-cicd-ecr-push
├── acontplus-policy-svc-ecr-push
└── acontplus-policy-base-tagging

acontplus-role-cicd-ecs-deploy
├── acontplus-policy-svc-ecs-deploy
├── acontplus-policy-svc-ecr-pull
└── acontplus-policy-svc-secrets-read

acontplus-role-cicd-s3-deploy
├── acontplus-policy-svc-s3-deploy
└── acontplus-policy-svc-cloudfront-invalidate

acontplus-role-github-actions
├── acontplus-policy-svc-ecr-push
├── acontplus-policy-svc-ecs-deploy
├── acontplus-policy-svc-s3-deploy
└── acontplus-policy-infra-cloudformation
```

### Roles ECS ↔ Políticas

```
acontplus-stg-role-ecs-task (lo que la APP puede hacer)
├── acontplus-policy-svc-s3-app
├── acontplus-policy-svc-secrets-read
├── acontplus-policy-svc-ssm-read
├── acontplus-policy-svc-kms-encrypt
└── acontplus-policy-svc-logs-write

acontplus-stg-role-ecs-execution (lo que ECS necesita)
├── acontplus-policy-svc-ecr-pull
├── acontplus-policy-svc-secrets-read
└── acontplus-policy-svc-logs-write
```

---

## 6. Implementación Paso a Paso

### Fase 1: Crear Políticas IAM (Admin)

```bash
# Crear directorio para políticas
mkdir -p infrastructure/aws/iam/policies

# Las políticas JSON están en la sección 7
```

### Fase 2: Crear Roles IAM (Admin)

```bash
# Crear directorio para trust policies
mkdir -p infrastructure/aws/iam/trust-policies

# Crear rol ECS Task
aws iam create-role \
  --role-name acontplus-stg-role-ecs-task \
  --assume-role-policy-document file://trust-policies/ecs-task-trust.json

# Adjuntar políticas
aws iam attach-role-policy \
  --role-name acontplus-stg-role-ecs-task \
  --policy-arn arn:aws:iam::866150703026:policy/acontplus-policy-svc-s3-app
```

### Fase 3: Crear Usuario de Servicio (Admin)

```bash
# Crear usuario CI/CD
aws iam create-user --user-name acontplus-svc-cicd

# Adjuntar política para asumir roles
aws iam put-user-policy \
  --user-name acontplus-svc-cicd \
  --policy-name AssumeRolePolicy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::866150703026:role/acontplus-role-cicd-*"
    }]
  }'

# Crear access keys
aws iam create-access-key --user-name acontplus-svc-cicd
```

### Fase 4: Configurar Identity Center (Admin)

1. Ir a **IAM Identity Center** en la consola
2. Crear **Grupos**:
   - `AcontPlus-Admins`
   - `AcontPlus-Developers`
   - `AcontPlus-Support`
   - `AcontPlus-Finance`
3. Crear **Usuarios** y asignar a grupos
4. Crear **Permission Sets** con las políticas definidas
5. Asignar Permission Sets a Grupos + Cuenta

---

## 7. Archivos de Políticas JSON

### Trust Policy: ECS Task
**Archivo:** `trust-policies/ecs-task-trust.json`
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### Trust Policy: CI/CD User AssumeRole
**Archivo:** `trust-policies/cicd-assume-trust.json`
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::866150703026:user/acontplus-svc-cicd"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### Trust Policy: GitHub Actions OIDC
**Archivo:** `trust-policies/github-oidc-trust.json`
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::866150703026:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR-ORG/AcontPlus:*"
        }
      }
    }
  ]
}
```

### Policy: ECR Push
**Archivo:** `policies/acontplus-policy-svc-ecr-push.json`
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAuth",
      "Effect": "Allow",
      "Action": "ecr:GetAuthorizationToken",
      "Resource": "*"
    },
    {
      "Sid": "ECRPush",
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage"
      ],
      "Resource": "arn:aws:ecr:us-east-1:866150703026:repository/acontplus-*"
    }
  ]
}
```

### Policy: ECS Deploy
**Archivo:** `policies/acontplus-policy-svc-ecs-deploy.json`
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECSServiceUpdate",
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeTasks",
        "ecs:DescribeTaskDefinition",
        "ecs:RegisterTaskDefinition",
        "ecs:ListTasks"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECSPassRole",
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": [
        "arn:aws:iam::866150703026:role/acontplus-*-role-ecs-task",
        "arn:aws:iam::866150703026:role/acontplus-*-role-ecs-execution"
      ]
    }
  ]
}
```

### Policy: S3 App Access
**Archivo:** `policies/acontplus-policy-svc-s3-app.json`
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3AppBuckets",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::acontplus-*-str-*",
        "arn:aws:s3:::acontplus-*-str-*/*"
      ]
    }
  ]
}
```

### Policy: Secrets Read
**Archivo:** `policies/acontplus-policy-svc-secrets-read.json`
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SecretsRead",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:866150703026:secret:acontplus/*"
    },
    {
      "Sid": "SSMRead",
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:GetParametersByPath"
      ],
      "Resource": "arn:aws:ssm:us-east-1:866150703026:parameter/acontplus/*"
    }
  ]
}
```

### Policy: KMS Encrypt/Decrypt
**Archivo:** `policies/acontplus-policy-svc-kms-encrypt.json`
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "KMSUsage",
      "Effect": "Allow",
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:GenerateDataKey",
        "kms:DescribeKey"
      ],
      "Resource": "arn:aws:kms:us-east-1:866150703026:key/*",
      "Condition": {
        "StringEquals": {
          "kms:RequestAlias": "alias/acontplus-*"
        }
      }
    }
  ]
}
```

### Policy: Deny IAM Dangerous
**Archivo:** `policies/acontplus-policy-deny-iam-dangerous.json`
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyIAMDangerous",
      "Effect": "Deny",
      "Action": [
        "iam:CreateUser",
        "iam:DeleteUser",
        "iam:CreateAccessKey",
        "iam:DeleteAccessKey",
        "iam:CreatePolicy",
        "iam:DeletePolicy",
        "iam:CreatePolicyVersion",
        "iam:DeletePolicyVersion",
        "iam:AttachUserPolicy",
        "iam:DetachUserPolicy",
        "iam:PutUserPolicy",
        "iam:DeleteUserPolicy",
        "iam:CreateGroup",
        "iam:DeleteGroup",
        "iam:AttachGroupPolicy",
        "iam:DetachGroupPolicy"
      ],
      "Resource": "*"
    }
  ]
}
```

### Policy: Deny Prod Delete
**Archivo:** `policies/acontplus-policy-deny-prod-delete.json`
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyProdDelete",
      "Effect": "Deny",
      "Action": [
        "ec2:TerminateInstances",
        "ec2:DeleteVpc",
        "ec2:DeleteSubnet",
        "ec2:DeleteSecurityGroup",
        "rds:DeleteDBInstance",
        "rds:DeleteDBCluster",
        "ecs:DeleteCluster",
        "ecs:DeleteService",
        "s3:DeleteBucket",
        "elasticache:DeleteCacheCluster"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:ResourceTag/Environment": "prd"
        }
      }
    }
  ]
}
```

---

## 8. Resumen Visual

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA IAM ACONTPLUS                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                   IAM IDENTITY CENTER (SSO)                      │    │
│  │                         PERSONAS                                 │    │
│  ├─────────────────────────────────────────────────────────────────┤    │
│  │                                                                  │    │
│  │  👥 acontplus-grp-admins    👥 acontplus-grp-developers         │    │
│  │     └── ipaz                  └── esenguana, dmanchu,          │    │
│  │     └── acontplus-ps-admin        aramirez                      │    │
│  │                                └── acontplus-ps-developer        │    │
│  │                                                                  │    │
│  │  👥 acontplus-grp-support   👥 acontplus-grp-finance            │    │
│  │     └── adavila                └── czarate                       │    │
│  │     └── acontplus-ps-support   └── acontplus-ps-finance         │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      IAM CLÁSICO                                 │    │
│  │                      SERVICIOS                                   │    │
│  ├─────────────────────────────────────────────────────────────────┤    │
│  │                                                                  │    │
│  │  👤 acontplus-svc-cicd ──► AssumeRole ──► 🎭 Roles CI/CD        │    │
│  │                                                                  │    │
│  │  🎭 acontplus-stg-role-ecs-task      (Apps en ECS)              │    │
│  │  🎭 acontplus-stg-role-ecs-execution (ECS pull/logs)            │    │
│  │  🎭 acontplus-role-github-actions    (GitHub OIDC)              │    │
│  │                                                                  │    │
│  │  📜 acontplus-policy-svc-*           (Permisos granulares)      │    │
│  │  📜 acontplus-policy-deny-*          (Guardrails)               │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Changelog

| Fecha | Versión | Descripción |
|-------|---------|-------------|
| 2026-02-01 | 1.0.0 | Documento inicial |
