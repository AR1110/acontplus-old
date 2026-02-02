# S3 + CloudFront Deployment Guide for Angular Client

## Overview

This guide documents the S3 + CloudFront deployment strategy for the AcontPlus Angular client application. The frontend is hosted on AWS S3 as a static website and distributed globally via CloudFront CDN.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────────┐
│   Azure DevOps  │────▶│  S3 Bucket       │────▶│  CloudFront       │
│   Pipeline      │     │  (Static Files)  │     │  Distribution     │
└─────────────────┘     └──────────────────┘     └─────────┬─────────┘
                                                          │
                                                          ▼
                                                ┌───────────────────┐
                                                │  client.acontplus │
                                                │       .com        │
                                                └───────────────────┘
```

## AWS Resources (Following Naming Convention)

| Resource Type | Resource Name | Description |
|---------------|---------------|-------------|
| S3 Bucket | `acontplus-prd-web-client-s3` | Hosts Angular build artifacts |
| CloudFront Distribution | `acp-prd-web-client-cf` | CDN distribution |
| Origin Access Control | `acontplus-prd-web-client-oac` | Secure S3 access |
| CloudFront Function | `acontplus-prd-web-client-spa-rewrite` | SPA route handling |

## S3 Bucket Configuration

### Create S3 Bucket

```bash
# Create bucket
aws s3api create-bucket \
  --bucket acontplus-prd-web-client-s3 \
  --region us-east-1

# Block all public access (CloudFront will handle access)
aws s3api put-public-access-block \
  --bucket acontplus-prd-web-client-s3 \
  --public-access-block-configuration \
    BlockPublicAcls=true,\
    IgnorePublicAcls=true,\
    BlockPublicPolicy=true,\
    RestrictPublicBuckets=true

# Enable versioning (optional but recommended)
aws s3api put-bucket-versioning \
  --bucket acontplus-prd-web-client-s3 \
  --versioning-configuration Status=Enabled

# Add bucket tags
aws s3api put-bucket-tagging \
  --bucket acontplus-prd-web-client-s3 \
  --tagging 'TagSet=[{Key=Environment,Value=production},{Key=Application,Value=acontplus},{Key=Service,Value=client},{Key=Type,Value=web}]'
```

### S3 Bucket Policy

After creating the CloudFront distribution, add this bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::acontplus-prd-web-client-s3/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

## CloudFront Configuration

### Create Origin Access Control (OAC)

```bash
aws cloudfront create-origin-access-control \
  --origin-access-control-config \
    Name=acontplus-prd-web-client-oac,\
    Description="OAC for AcontPlus Angular Client",\
    SigningProtocol=sigv4,\
    SigningBehavior=always,\
    OriginAccessControlOriginType=s3
```

### CloudFront Distribution Configuration

Create a file `cloudfront-distribution.json`:

```json
{
  "CallerReference": "acontplus-client-distribution",
  "Comment": "AcontPlus Angular Client - Production",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "acontplus-prd-web-client-s3",
        "DomainName": "acontplus-prd-web-client-s3.s3.us-east-1.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        },
        "OriginAccessControlId": "OAC_ID_HERE"
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "acontplus-prd-web-client-s3",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "ResponseHeadersPolicyId": "RESPONSE_HEADERS_POLICY_ID",
    "Compress": true,
    "FunctionAssociations": {
      "Quantity": 1,
      "Items": [
        {
          "EventType": "viewer-request",
          "FunctionARN": "arn:aws:cloudfront::ACCOUNT_ID:function/acontplus-prd-web-client-spa-rewrite"
        }
      ]
    }
  },
  "Aliases": {
    "Quantity": 1,
    "Items": ["client.acontplus.com"]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERTIFICATE_ID",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
      },
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
      }
    ]
  },
  "PriceClass": "PriceClass_100",
  "Enabled": true,
  "HttpVersion": "http2and3"
}
```

### Create Distribution

```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-distribution.json
```

### CloudFront Function for SPA Routing

Create function `spa-rewrite.js`:

```javascript
function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Check if the URI is missing a file extension
    // and doesn't end with a slash
    if (!uri.includes('.') && !uri.endsWith('/')) {
        request.uri = '/index.html';
    }

    // Check if the URI ends with a slash but isn't the root
    if (uri.endsWith('/') && uri !== '/') {
        request.uri = '/index.html';
    }

    return request;
}
```

```bash
# Create CloudFront Function
aws cloudfront create-function \
  --name acontplus-prd-web-client-spa-rewrite \
  --function-config Comment="SPA routing for Angular",Runtime=cloudfront-js-2.0 \
  --function-code fileb://spa-rewrite.js

# Publish the function
aws cloudfront publish-function \
  --name acontplus-prd-web-client-spa-rewrite \
  --if-match ETAG_FROM_CREATE
```

## Response Headers Policy

Create a custom response headers policy for security:

```bash
aws cloudfront create-response-headers-policy \
  --response-headers-policy-config '{
    "Name": "acontplus-security-headers",
    "Comment": "Security headers for AcontPlus",
    "SecurityHeadersConfig": {
      "XSSProtection": {
        "Override": true,
        "Protection": true,
        "ModeBlock": true
      },
      "FrameOptions": {
        "Override": true,
        "FrameOption": "SAMEORIGIN"
      },
      "ContentTypeOptions": {
        "Override": true
      },
      "ReferrerPolicy": {
        "Override": true,
        "ReferrerPolicy": "strict-origin-when-cross-origin"
      },
      "StrictTransportSecurity": {
        "Override": true,
        "IncludeSubdomains": true,
        "Preload": false,
        "AccessControlMaxAgeSec": 31536000
      },
      "ContentSecurityPolicy": {
        "Override": true,
        "ContentSecurityPolicy": "default-src https: data: '\''unsafe-inline'\'' '\''unsafe-eval'\''; frame-src '\''self'\'' https://app.acontplus.com https://client.acontplus.com;"
      }
    }
  }'
```

## SSL Certificate (ACM)

The SSL certificate must be created in `us-east-1` for CloudFront:

```bash
# Request certificate
aws acm request-certificate \
  --domain-name client.acontplus.com \
  --validation-method DNS \
  --region us-east-1 \
  --tags Key=Name,Value=acontplus-prd-web-client-cert

# After DNS validation, the certificate will be issued
```

## DNS Configuration (Route 53)

```bash
# Create ALIAS record pointing to CloudFront
aws route53 change-resource-record-sets \
  --hosted-zone-id ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "client.acontplus.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "CLOUDFRONT_DOMAIN.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
```

## Deployment Commands

### Manual Deployment

```bash
# Build Angular application
cd src/WebApps/client
pnpm install
pnpm run production

# Sync to S3
aws s3 sync dist/client s3://acontplus-prd-web-client-s3 \
  --delete \
  --cache-control "max-age=31536000,public" \
  --exclude "index.html" \
  --exclude "*.json"

# Upload index.html with no-cache
aws s3 cp dist/client/index.html s3://acontplus-prd-web-client-s3/index.html \
  --cache-control "no-cache,no-store,must-revalidate"

# Upload config files with short cache
aws s3 sync dist/client s3://acontplus-prd-web-client-s3 \
  --include "*.json" \
  --cache-control "max-age=300,public"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

### Cache Strategy

| File Type | Cache Control | TTL |
|-----------|---------------|-----|
| `index.html` | no-cache, no-store, must-revalidate | 0 |
| `*.js`, `*.css` | max-age=31536000, public | 1 year |
| `*.json` (config) | max-age=300, public | 5 minutes |
| `*.woff2`, `*.ttf` | max-age=31536000, public | 1 year |
| `*.png`, `*.jpg`, `*.svg` | max-age=31536000, public | 1 year |

## Monitoring

### CloudWatch Metrics

Key metrics to monitor:

- **CloudFront**: Requests, BytesDownloaded, 4xxErrorRate, 5xxErrorRate
- **S3**: NumberOfObjects, BucketSizeBytes

### CloudWatch Alarms

```bash
# High error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name acontplus-prd-web-client-high-error-rate \
  --metric-name 5xxErrorRate \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=DistributionId,Value=DISTRIBUTION_ID \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:acontplus-alerts
```

## Cost Optimization

1. **Use PriceClass_100**: Limits edge locations to NA and Europe (cheaper)
2. **Enable Compression**: Reduces data transfer costs
3. **S3 Intelligent-Tiering**: For versioned files
4. **CloudFront Reserved Capacity**: For predictable traffic

## Rollback Procedure

If a deployment causes issues:

```bash
# Option 1: Deploy previous version from CI/CD
# Trigger previous successful pipeline run

# Option 2: Restore from S3 versioning
aws s3api list-object-versions \
  --bucket acontplus-prd-web-client-s3 \
  --prefix index.html

# Restore specific version
aws s3api copy-object \
  --bucket acontplus-prd-web-client-s3 \
  --copy-source acontplus-prd-web-client-s3/index.html?versionId=VERSION_ID \
  --key index.html

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/index.html"
```

## Security Considerations

1. **Block Public S3 Access**: All access goes through CloudFront
2. **OAC (Origin Access Control)**: Modern replacement for OAI
3. **HTTPS Only**: Redirect HTTP to HTTPS
4. **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
5. **TLS 1.2+**: Minimum protocol version

## Troubleshooting

### Common Issues

1. **403 Forbidden**
   - Check S3 bucket policy allows CloudFront
   - Verify OAC is correctly configured

2. **Routes not working (404)**
   - Ensure CloudFront Function is attached
   - Check custom error responses redirect to index.html

3. **Stale content after deploy**
   - Create CloudFront invalidation
   - Check browser cache

4. **Mixed content warnings**
   - Ensure all API calls use HTTPS
   - Check environment configuration
