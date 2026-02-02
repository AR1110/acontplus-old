# Azure DevOps Setup for Angular Client Deployment

## Overview

This guide documents the Azure DevOps configuration required for the Angular client CI/CD pipeline that deploys to AWS S3 + CloudFront.

## Prerequisites

1. Azure DevOps organization and project
2. AWS account with appropriate IAM permissions
3. CloudFront distribution and S3 bucket already created (see [S3 + CloudFront Deployment Guide](../../Deployment/s3-cloudfront/s3-cloudfront-deployment-guide.md))

## Pipeline Configuration

### 1. Create Variable Group

Create a variable group named `acontplus-aws-credentials`:

1. Go to **Pipelines** → **Library** → **+ Variable group**
2. Name: `acontplus-aws-credentials`
3. Add these variables:

| Variable Name | Value | Secret |
|---------------|-------|--------|
| `AWS_ACCESS_KEY_ID` | Your AWS Access Key | Yes |
| `AWS_SECRET_ACCESS_KEY` | Your AWS Secret Key | Yes |
| `CLOUDFRONT_DISTRIBUTION_ID` | E1XXXXXXXXXX | No |

### 2. Create AWS Service Connection

1. Go to **Project Settings** → **Service connections**
2. Click **New service connection** → **AWS**
3. Configure:
   - **Connection name**: `acontplus-aws-service-connection`
   - **Access Key ID**: From IAM user
   - **Secret Access Key**: From IAM user
   - **Region**: `us-east-1`

### 3. Create IAM User for Pipeline

Create an IAM user with minimal permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3Access",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::acontplus-prd-web-client-s3",
        "arn:aws:s3:::acontplus-prd-web-client-s3/*"
      ]
    },
    {
      "Sid": "CloudFrontInvalidation",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListInvalidations"
      ],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
    }
  ]
}
```

### 4. Create Environment

1. Go to **Pipelines** → **Environments**
2. Click **New environment**
3. Name: `production-frontend`
4. Resource: **None**
5. Add approvals if needed (optional)

### 5. Create Pipeline

1. Go to **Pipelines** → **New pipeline**
2. Select **Azure Repos Git** (or GitHub if applicable)
3. Select repository
4. Configure pipeline:
   - Select **Existing Azure Pipelines YAML file**
   - Path: `/azure-pipelines-client.yml`
5. Save and run

## Pipeline Behavior

### Triggers

- **Automatic**: On push to `main` branch when changes occur in `src/WebApps/client/**`
- **Excluded**: Changes to `docs/` folder and `*.md` files don't trigger deployment
- **PR**: Pull requests do NOT trigger deployment

### Stages

1. **Build**
   - Install Node.js 22.x
   - Setup pnpm with caching
   - Install dependencies
   - Run linting
   - Build production bundle
   - Publish artifacts

2. **Deploy** (only on main branch)
   - Download build artifacts
   - Sync static assets to S3 (with 1-year cache)
   - Upload index.html (no cache)
   - Upload config files (5-minute cache)
   - Invalidate CloudFront cache

## Manual Trigger

To manually trigger a deployment:

1. Go to **Pipelines**
2. Select the Angular client pipeline
3. Click **Run pipeline**
4. Select `main` branch
5. Click **Run**

## Monitoring Deployments

### View Deployment Status

1. Go to **Pipelines** → **Environments** → `production-frontend`
2. View deployment history and status

### View Pipeline Runs

1. Go to **Pipelines**
2. Select the Angular client pipeline
3. View runs history

## Rollback

To rollback to a previous version:

### Option 1: Re-run Previous Pipeline

1. Go to **Pipelines**
2. Find the last successful run with the desired version
3. Click **Rerun**

### Option 2: S3 Versioning

If S3 versioning is enabled, restore previous version via AWS CLI:

```bash
# List versions
aws s3api list-object-versions \
  --bucket acontplus-prd-web-client-s3 \
  --prefix index.html

# Restore specific version
aws s3api copy-object \
  --bucket acontplus-prd-web-client-s3 \
  --copy-source "acontplus-prd-web-client-s3/index.html?versionId=VERSION_ID" \
  --key index.html

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/index.html"
```

## Troubleshooting

### Pipeline Fails: AWS Credentials

```
Error: The security token included in the request is invalid
```

**Solution**: Update AWS credentials in variable group or service connection.

### Pipeline Fails: S3 Access Denied

```
Error: AccessDenied when calling the PutObject operation
```

**Solution**: Verify IAM user has correct S3 permissions.

### Pipeline Fails: CloudFront Invalidation

```
Error: AccessDenied when calling the CreateInvalidation operation
```

**Solution**: Verify IAM user has CloudFront permissions for the specific distribution.

### Build Fails: Dependencies

```
Error: pnpm install failed
```

**Solution**: 
1. Clear pipeline cache
2. Check pnpm-lock.yaml is committed
3. Verify registry access

### Deployment Doesn't Trigger

**Possible causes**:
1. Changes are not in `src/WebApps/client/**` path
2. Branch is not `main`
3. Only documentation files changed

## Best Practices

1. **Never commit secrets** to repository
2. **Use environments** for approvals on production
3. **Monitor deployment** after each release
4. **Keep pnpm-lock.yaml** up to date
5. **Test locally** before pushing to main
