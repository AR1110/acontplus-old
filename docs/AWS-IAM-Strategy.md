# AWS IAM Strategy Guide - AcontPlus

## Resumen Ejecutivo

Este documento define la estrategia de Identity and Access Management (IAM) para AcontPlus, siguiendo las mejores prácticas de AWS Well-Architected Framework.

---

## 1. IAM vs IAM Identity Center (SSO)

### ¿Cuál usar?

| Característica | IAM (Clásico) | IAM Identity Center (SSO) |
|----------------|---------------|---------------------------|
| **Caso de uso** | Acceso programático, servicios AWS | Usuarios humanos, consola, multi-cuenta |
| **Autenticación** | Access Keys (largo plazo) | Credenciales temporales (STS) |
| **MFA** | Configuración manual por usuario | Centralizado, obligatorio |
| **Multi-cuenta** | Complejo (cross-account roles) | Nativo, simple |
| **Integración IdP** | SAML/OIDC manual | Nativo (Okta, Azure AD, Google) |
| **Auditoría** | CloudTrail por cuenta | Centralizado |
| **Costo** | Gratis | Gratis |

### Recomendación para AcontPlus

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTRATEGIA HÍBRIDA                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   IAM Identity Center (SSO)     │     IAM Clásico              │
│   ─────────────────────────     │     ───────────              │
│   • Desarrolladores (consola)   │     • CI/CD Pipelines        │
│   • Administradores             │     • Service Accounts       │
│   • Soporte técnico             │     • Aplicaciones externas  │
│   • Acceso temporal             │     • AWS CLI automatizado   │
│                                 │                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Jerarquía Organizacional

### AWS Organizations (Recomendado para producción)

```
Root (Management Account)
│
├── 📁 Core OU
│   ├── 🔐 Security Account (logs, auditoría)
│   └── 🌐 Networking Account (VPCs compartidas)
│
├── 📁 Workloads OU
│   ├── 📁 Development OU
│   │   └── 💻 acontplus-dev (866150703026 o nueva)
│   │
│   ├── 📁 Staging OU
│   │   └── 🧪 acontplus-stg
│   │
│   └── 📁 Production OU
│       └── 🚀 acontplus-prd
│
└── 📁 Sandbox OU
    └── 🎮 acontplus-sandbox (experimentación)
```

### Para Single Account (Tu caso actual)

```
Account: 866150703026
│
├── 🏷️ Resource Tags para separación lógica
│   ├── Environment: dev | stg | prd
│   └── Project: AcontPlus
│
├── 👥 IAM Groups (por función)
├── 👤 IAM Users (mínimos, solo programático)
├── 🎭 IAM Roles (para servicios y asumibles)
└── 📜 IAM Policies (granulares, reutilizables)
```

---

## 3. Estructura de IAM Groups

### Nomenclatura
```
acontplus-group-{función}-{nivel-acceso}
```

### Grupos Recomendados

```
┌─────────────────────────────────────────────────────────────────┐
│                      IAM GROUPS                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ADMINISTRATIVOS                                                │
│  ├── acontplus-group-admin-full        → PowerUserAccess        │
│  ├── acontplus-group-admin-billing     → Billing + Cost Explorer│
│  └── acontplus-group-admin-security    → IAM + Security Hub     │
│                                                                 │
│  DESARROLLO                                                     │
│  ├── acontplus-group-dev-full          → Dev completo           │
│  ├── acontplus-group-dev-backend       → ECS, RDS, ECR          │
│  ├── acontplus-group-dev-frontend      → S3, CloudFront         │
│  └── acontplus-group-dev-readonly      → Solo lectura           │
│                                                                 │
│  OPERACIONES                                                    │
│  ├── acontplus-group-ops-deploy        → CI/CD deployments      │
│  ├── acontplus-group-ops-monitoring    → CloudWatch, X-Ray      │
│  └── acontplus-group-ops-support       → Logs, troubleshooting  │
│                                                                 │
│  INFRAESTRUCTURA                                                │
│  ├── acontplus-group-infra-network     → VPC, Route53, ALB      │
│  ├── acontplus-group-infra-compute     → ECS, EC2, Lambda       │
│  └── acontplus-group-infra-database    → RDS, ElastiCache       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Estructura de IAM Users

### Principio: Mínimos Usuarios IAM

> ⚠️ **Best Practice**: Usar IAM Users solo para acceso programático.
> Humanos deben usar IAM Identity Center.

### Nomenclatura
```
acontplus-user-{propósito}-{identificador}
```

### Usuarios Recomendados

| Usuario | Propósito | Grupo(s) |
|---------|-----------|----------|
| `acontplus-user-cicd-github` | GitHub Actions | `acontplus-group-ops-deploy` |
| `acontplus-user-cicd-azure` | Azure DevOps | `acontplus-group-ops-deploy` |
| `acontplus-user-svc-monitoring` | Datadog/NewRelic | `acontplus-group-ops-monitoring` |
| `acontplus-user-svc-backup` | Backup externo | Política específica |

### Usuario Actual (Migración)

```
ACTUAL                          MIGRAR A
───────                         ─────────
iferpaz7 (usuario personal)  →  IAM Identity Center (SSO)
                             +  acontplus-user-cicd-* (para automatización)
```

---

## 5. Estructura de IAM Roles

### Nomenclatura
```
acontplus-{env}-role-{servicio}-{propósito}
```

### Roles por Categoría

```
┌─────────────────────────────────────────────────────────────────┐
│                       IAM ROLES                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔧 SERVICE ROLES (AWS Services)                                │
│  ├── acontplus-stg-role-ecs-task        → ECS Task Role         │
│  ├── acontplus-stg-role-ecs-execution   → ECS Execution Role    │
│  ├── acontplus-stg-role-lambda-exec     → Lambda Execution      │
│  ├── acontplus-stg-role-rds-monitoring  → RDS Enhanced Monitor  │
│  ├── acontplus-stg-role-vpc-flowlogs    → VPC Flow Logs         │
│  └── acontplus-stg-role-cloudwatch-events→ EventBridge          │
│                                                                 │
│  🔄 CROSS-ACCOUNT ROLES (Future multi-account)                  │
│  ├── acontplus-role-assume-dev          → Asumir en cuenta dev  │
│  ├── acontplus-role-assume-stg          → Asumir en cuenta stg  │
│  └── acontplus-role-assume-prd          → Asumir en cuenta prd  │
│                                                                 │
│  👤 FEDERATED ROLES (SSO/SAML)                                  │
│  ├── acontplus-role-sso-admin           → Admins federados      │
│  ├── acontplus-role-sso-developer       → Devs federados        │
│  └── acontplus-role-sso-readonly        → Solo lectura federado │
│                                                                 │
│  🤖 AUTOMATION ROLES                                            │
│  ├── acontplus-role-cicd-deploy         → Pipeline deployments  │
│  ├── acontplus-role-cloudformation      → CFN Stack operations  │
│  └── acontplus-role-terraform           → Terraform state       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Trust Policies por Tipo

**ECS Task Role:**
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ecs-tasks.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}
```

**GitHub Actions (OIDC - Recomendado):**
```json
{
  "Version": "2012-10-17",
  "Statement": [{
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
        "token.actions.githubusercontent.com:sub": "repo:tu-org/AcontPlus:*"
      }
    }
  }]
}
```

---

## 6. Estructura de IAM Policies

### Nomenclatura
```
acontplus-policy-{categoría}-{recurso/acción}
```

### Jerarquía de Políticas

```
┌─────────────────────────────────────────────────────────────────┐
│                    POLICY HIERARCHY                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📋 AWS MANAGED POLICIES (usar cuando aplique)                  │
│  ├── ReadOnlyAccess                                             │
│  ├── PowerUserAccess                                            │
│  ├── AmazonECS_FullAccess                                       │
│  └── AmazonRDSFullAccess                                        │
│                                                                 │
│  📋 CUSTOMER MANAGED - BASE (reutilizables)                     │
│  ├── acontplus-policy-base-readonly     → Lectura general       │
│  ├── acontplus-policy-base-ec2-readonly → EC2 describe          │
│  ├── acontplus-policy-base-s3-readonly  → S3 get/list           │
│  └── acontplus-policy-base-logs-write   → CloudWatch logs       │
│                                                                 │
│  📋 CUSTOMER MANAGED - SERVICIOS                                │
│  ├── acontplus-policy-svc-ecs           → ECS operations        │
│  ├── acontplus-policy-svc-ecr           → ECR push/pull         │
│  ├── acontplus-policy-svc-rds           → RDS management        │
│  ├── acontplus-policy-svc-s3            → S3 buckets proyecto   │
│  ├── acontplus-policy-svc-secrets       → Secrets Manager       │
│  └── acontplus-policy-svc-ssm           → Parameter Store       │
│                                                                 │
│  📋 CUSTOMER MANAGED - INFRAESTRUCTURA                          │
│  ├── acontplus-policy-infra-vpc         → VPC completo          │
│  ├── acontplus-policy-infra-cloudformation → CFN stacks         │
│  ├── acontplus-policy-infra-iam         → IAM (con límites)     │
│  └── acontplus-policy-infra-route53     → DNS management        │
│                                                                 │
│  📋 CUSTOMER MANAGED - AMBIENTE ESPECÍFICO                      │
│  ├── acontplus-policy-env-dev           → Solo recursos dev     │
│  ├── acontplus-policy-env-stg           → Solo recursos stg     │
│  └── acontplus-policy-env-prd           → Solo recursos prd     │
│                                                                 │
│  📋 PERMISSION BOUNDARIES (límites máximos)                     │
│  ├── acontplus-boundary-developer       → Límite para devs      │
│  ├── acontplus-boundary-admin           → Límite para admins    │
│  └── acontplus-boundary-service         → Límite para servicios │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Políticas Detalladas

### 7.1 Policy: Infraestructura VPC
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CloudFormationAcontPlus",
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStack",
        "cloudformation:UpdateStack",
        "cloudformation:DeleteStack",
        "cloudformation:DescribeStacks",
        "cloudformation:DescribeStackEvents",
        "cloudformation:DescribeStackResources",
        "cloudformation:GetTemplate",
        "cloudformation:GetTemplateSummary",
        "cloudformation:CreateChangeSet",
        "cloudformation:DescribeChangeSet",
        "cloudformation:ExecuteChangeSet",
        "cloudformation:DeleteChangeSet",
        "cloudformation:ListStacks"
      ],
      "Resource": [
        "arn:aws:cloudformation:*:866150703026:stack/acontplus-*/*",
        "arn:aws:cloudformation:*:866150703026:stackset/acontplus-*:*"
      ]
    },
    {
      "Sid": "CloudFormationGlobal",
      "Effect": "Allow",
      "Action": [
        "cloudformation:ValidateTemplate",
        "cloudformation:ListExports"
      ],
      "Resource": "*"
    },
    {
      "Sid": "VPCFullAccess",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateVpc",
        "ec2:DeleteVpc",
        "ec2:ModifyVpcAttribute",
        "ec2:AssociateVpcCidrBlock",
        "ec2:DisassociateVpcCidrBlock",
        "ec2:CreateSubnet",
        "ec2:DeleteSubnet",
        "ec2:ModifySubnetAttribute",
        "ec2:CreateInternetGateway",
        "ec2:DeleteInternetGateway",
        "ec2:AttachInternetGateway",
        "ec2:DetachInternetGateway",
        "ec2:CreateEgressOnlyInternetGateway",
        "ec2:DeleteEgressOnlyInternetGateway",
        "ec2:CreateNatGateway",
        "ec2:DeleteNatGateway",
        "ec2:CreateRouteTable",
        "ec2:DeleteRouteTable",
        "ec2:CreateRoute",
        "ec2:DeleteRoute",
        "ec2:ReplaceRoute",
        "ec2:AssociateRouteTable",
        "ec2:DisassociateRouteTable",
        "ec2:CreateSecurityGroup",
        "ec2:DeleteSecurityGroup",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:AuthorizeSecurityGroupEgress",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:RevokeSecurityGroupEgress",
        "ec2:UpdateSecurityGroupRuleDescriptionsIngress",
        "ec2:UpdateSecurityGroupRuleDescriptionsEgress",
        "ec2:CreateVpcEndpoint",
        "ec2:DeleteVpcEndpoints",
        "ec2:ModifyVpcEndpoint",
        "ec2:AllocateAddress",
        "ec2:ReleaseAddress",
        "ec2:AssociateAddress",
        "ec2:DisassociateAddress",
        "ec2:CreateFlowLogs",
        "ec2:DeleteFlowLogs",
        "ec2:CreateTags",
        "ec2:DeleteTags"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": ["us-east-1", "us-east-2"]
        }
      }
    },
    {
      "Sid": "VPCReadOnly",
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "ec2:GetSecurityGroupsForVpc"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMForVPCFlowLogs",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:GetRole",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:GetRolePolicy",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:ListAttachedRolePolicies",
        "iam:ListRolePolicies",
        "iam:PassRole",
        "iam:TagRole",
        "iam:UntagRole"
      ],
      "Resource": "arn:aws:iam::866150703026:role/acontplus-*"
    },
    {
      "Sid": "CloudWatchLogsForVPC",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:DeleteLogGroup",
        "logs:PutRetentionPolicy",
        "logs:TagLogGroup",
        "logs:UntagLogGroup",
        "logs:DescribeLogGroups",
        "logs:ListTagsLogGroup"
      ],
      "Resource": [
        "arn:aws:logs:*:866150703026:log-group:/aws/vpc/acontplus-*",
        "arn:aws:logs:*:866150703026:log-group:/acontplus/*"
      ]
    },
    {
      "Sid": "RDSSubnetGroups",
      "Effect": "Allow",
      "Action": [
        "rds:CreateDBSubnetGroup",
        "rds:DeleteDBSubnetGroup",
        "rds:ModifyDBSubnetGroup",
        "rds:DescribeDBSubnetGroups",
        "rds:AddTagsToResource",
        "rds:RemoveTagsFromResource",
        "rds:ListTagsForResource"
      ],
      "Resource": [
        "arn:aws:rds:*:866150703026:subgrp:acontplus-*"
      ]
    },
    {
      "Sid": "RDSDescribe",
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBSubnetGroups"
      ],
      "Resource": "*"
    }
  ]
}
```

### 7.2 Policy: ECS Operations
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECSClusters",
      "Effect": "Allow",
      "Action": [
        "ecs:CreateCluster",
        "ecs:DeleteCluster",
        "ecs:UpdateCluster",
        "ecs:UpdateClusterSettings",
        "ecs:PutClusterCapacityProviders"
      ],
      "Resource": "arn:aws:ecs:*:866150703026:cluster/acontplus-*"
    },
    {
      "Sid": "ECSServices",
      "Effect": "Allow",
      "Action": [
        "ecs:CreateService",
        "ecs:UpdateService",
        "ecs:DeleteService",
        "ecs:DescribeServices"
      ],
      "Resource": "arn:aws:ecs:*:866150703026:service/acontplus-*/*"
    },
    {
      "Sid": "ECSTaskDefinitions",
      "Effect": "Allow",
      "Action": [
        "ecs:RegisterTaskDefinition",
        "ecs:DeregisterTaskDefinition",
        "ecs:DescribeTaskDefinition"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECSTasks",
      "Effect": "Allow",
      "Action": [
        "ecs:RunTask",
        "ecs:StopTask",
        "ecs:DescribeTasks",
        "ecs:ListTasks",
        "ecs:ExecuteCommand"
      ],
      "Resource": [
        "arn:aws:ecs:*:866150703026:task/acontplus-*/*",
        "arn:aws:ecs:*:866150703026:task-definition/acontplus-*:*"
      ]
    },
    {
      "Sid": "ECSReadOnly",
      "Effect": "Allow",
      "Action": [
        "ecs:Describe*",
        "ecs:List*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECRAccess",
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECRRepositories",
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage",
        "ecr:DescribeRepositories",
        "ecr:DescribeImages",
        "ecr:ListImages"
      ],
      "Resource": "arn:aws:ecr:*:866150703026:repository/acontplus-*"
    }
  ]
}
```

### 7.3 Policy: Environment Boundary (dev/stg/prd)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyProdResourcesModification",
      "Effect": "Deny",
      "Action": [
        "ec2:TerminateInstances",
        "ec2:DeleteVpc",
        "ec2:DeleteSubnet",
        "rds:DeleteDBInstance",
        "rds:DeleteDBCluster",
        "ecs:DeleteCluster",
        "ecs:DeleteService"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:ResourceTag/Environment": "prd"
        }
      }
    },
    {
      "Sid": "RequireEnvironmentTag",
      "Effect": "Deny",
      "Action": [
        "ec2:CreateVpc",
        "ec2:CreateSubnet",
        "ecs:CreateCluster",
        "rds:CreateDBInstance"
      ],
      "Resource": "*",
      "Condition": {
        "Null": {
          "aws:RequestTag/Environment": "true"
        }
      }
    }
  ]
}
```

---

## 8. Permission Boundaries

### ¿Qué son?
Límites máximos de permisos que un rol/usuario puede tener, independiente de las políticas asignadas.

### Boundary para Desarrolladores
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowedServices",
      "Effect": "Allow",
      "Action": [
        "ecs:*",
        "ecr:*",
        "logs:*",
        "s3:*",
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret",
        "ssm:GetParameter*",
        "rds:Describe*",
        "elasticache:Describe*",
        "cloudwatch:*",
        "xray:*",
        "lambda:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyIAMChanges",
      "Effect": "Deny",
      "Action": [
        "iam:CreateUser",
        "iam:DeleteUser",
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:AttachUserPolicy",
        "iam:DetachUserPolicy",
        "iam:PutUserPolicy",
        "iam:DeleteUserPolicy",
        "iam:CreatePolicy",
        "iam:DeletePolicy"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyNetworkChanges",
      "Effect": "Deny",
      "Action": [
        "ec2:CreateVpc",
        "ec2:DeleteVpc",
        "ec2:CreateSubnet",
        "ec2:DeleteSubnet",
        "ec2:CreateInternetGateway",
        "ec2:DeleteInternetGateway"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyBillingAccess",
      "Effect": "Deny",
      "Action": [
        "aws-portal:*",
        "budgets:*",
        "ce:*",
        "cur:*"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 9. Plan de Implementación (Sin afectar configuración actual)

### Fase 1: Auditoría (Semana 1)
```bash
# Ejecutar estos comandos para auditar estado actual
aws iam list-users --query 'Users[*].UserName'
aws iam list-groups --query 'Groups[*].GroupName'
aws iam list-roles --query 'Roles[*].RoleName'
aws iam list-policies --scope Local --query 'Policies[*].PolicyName'
```

### Fase 2: Crear Políticas Base (Semana 1-2)
1. ✅ Crear políticas nuevas (no afecta nada existente)
2. ✅ Probar en cuenta sandbox o con usuario de prueba
3. ✅ Documentar cada política

**Orden de creación:**
```
1. acontplus-policy-base-readonly
2. acontplus-policy-infra-vpc
3. acontplus-policy-svc-ecs
4. acontplus-policy-svc-ecr
5. acontplus-boundary-developer
```

### Fase 3: Crear Grupos (Semana 2)
1. ✅ Crear grupos vacíos (no afecta usuarios actuales)
2. ✅ Asignar políticas a grupos
3. ✅ Documentar matriz grupo-política

### Fase 4: Crear Roles de Servicio (Semana 2-3)
1. ✅ Crear roles para ECS, Lambda, etc.
2. ✅ No afecta servicios existentes hasta que se configuren

### Fase 5: Migración de Usuarios (Semana 3-4)
1. ⚠️ Agregar usuario existente a grupos nuevos
2. ⚠️ Verificar acceso funciona
3. ⚠️ Remover políticas directas del usuario
4. ⚠️ Monitorear CloudTrail por errores de acceso

### Fase 6: IAM Identity Center (Opcional, Semana 4+)
1. Habilitar IAM Identity Center
2. Crear usuarios SSO
3. Migrar acceso humano a SSO
4. Mantener usuarios IAM solo para programático

---

## 10. Matriz de Asignación

### Grupos ↔ Políticas

| Grupo | Políticas |
|-------|-----------|
| `acontplus-group-admin-full` | PowerUserAccess, acontplus-policy-infra-* |
| `acontplus-group-dev-backend` | acontplus-policy-svc-ecs, acontplus-policy-svc-ecr, acontplus-policy-svc-secrets |
| `acontplus-group-ops-deploy` | acontplus-policy-svc-ecs (update), acontplus-policy-svc-ecr (push) |
| `acontplus-group-infra-network` | acontplus-policy-infra-vpc, acontplus-policy-infra-cloudformation |

### Usuarios ↔ Grupos

| Usuario | Grupos | Notas |
|---------|--------|-------|
| `iferpaz7` | `acontplus-group-admin-full`, `acontplus-group-infra-network` | Migrar a SSO eventualmente |
| `acontplus-user-cicd-github` | `acontplus-group-ops-deploy` | Solo acceso programático |

---

## 11. Comandos de Implementación

### Crear Política
```bash
aws iam create-policy \
  --policy-name acontplus-policy-infra-vpc \
  --policy-document file://policies/acontplus-policy-infra-vpc.json \
  --description "VPC infrastructure management for AcontPlus" \
  --tags Key=Project,Value=AcontPlus Key=ManagedBy,Value=cli
```

### Crear Grupo
```bash
aws iam create-group --group-name acontplus-group-infra-network

aws iam attach-group-policy \
  --group-name acontplus-group-infra-network \
  --policy-arn arn:aws:iam::866150703026:policy/acontplus-policy-infra-vpc
```

### Agregar Usuario a Grupo (sin quitar permisos actuales)
```bash
aws iam add-user-to-group \
  --user-name iferpaz7 \
  --group-name acontplus-group-infra-network
```

### Crear Rol
```bash
aws iam create-role \
  --role-name acontplus-stg-role-ecs-task \
  --assume-role-policy-document file://trust-policies/ecs-trust.json \
  --description "ECS Task Role for AcontPlus staging" \
  --tags Key=Project,Value=AcontPlus Key=Environment,Value=stg
```

---

## 12. Monitoreo y Auditoría

### CloudTrail Queries Útiles
```sql
-- Accesos denegados
SELECT eventTime, userIdentity.userName, eventName, errorCode, errorMessage
FROM cloudtrail_logs
WHERE errorCode = 'AccessDenied'
AND eventTime > date_add('day', -7, current_date)

-- Cambios IAM
SELECT eventTime, userIdentity.userName, eventName, requestParameters
FROM cloudtrail_logs
WHERE eventSource = 'iam.amazonaws.com'
AND eventName LIKE '%Create%' OR eventName LIKE '%Delete%' OR eventName LIKE '%Attach%'
```

### IAM Access Analyzer
```bash
# Habilitar Access Analyzer
aws accessanalyzer create-analyzer \
  --analyzer-name acontplus-access-analyzer \
  --type ACCOUNT \
  --tags Project=AcontPlus
```

---

## Changelog

| Fecha | Versión | Descripción |
|-------|---------|-------------|
| 2026-02-01 | 1.0.0 | Documento inicial |
