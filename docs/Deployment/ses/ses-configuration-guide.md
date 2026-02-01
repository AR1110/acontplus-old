# AWS SES Configuration Guide

This guide provides AWS CLI commands for configuring Amazon Simple Email Service (SES) following the AcontPlus naming conventions.

> **Reference:** See [AWS-Naming-Convention.md](../../../docs/AWS-Naming-Convention.md) for full naming standards.

---

## 1. Email Identity Setup

### Create Domain Identity

```bash
# Create email identity for your domain
aws sesv2 create-email-identity --email-identity acontplus.com
```

### Verify Identity Status

```bash
aws sesv2 get-email-identity --email-identity acontplus.com
```

---

## 2. DKIM Configuration

After creating the email identity, you'll receive DKIM tokens. Add these as CNAME records in Route 53.

### Add DKIM Records to Route 53

```bash
# Template for DKIM CNAME records
# Replace {TOKEN} with actual DKIM tokens from create-email-identity response

aws route53 change-resource-record-sets \
  --hosted-zone-id {HOSTED_ZONE_ID} \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "{TOKEN}._domainkey.acontplus.com.",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{ "Value": "{TOKEN}.dkim.amazonses.com." }]
      }
    }]
  }'
```

### Verify DKIM Status

```bash
aws sesv2 get-email-identity --email-identity acontplus.com \
  --query "DkimAttributes.{Status:Status,SigningEnabled:SigningEnabled}"
```

---

## 3. DMARC Configuration

### Create DMARC Record

Create a file `dmarc-change-batch.json`:

```json
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "_dmarc.acontplus.com",
        "Type": "TXT",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "\"v=DMARC1; p=quarantine; rua=mailto:dmarc@acontplus.com\""
          }
        ]
      }
    }
  ]
}
```

Apply the DMARC record:

```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id {HOSTED_ZONE_ID} \
  --change-batch file://dmarc-change-batch.json
```

---

## 4. IAM User for SMTP

### Create SMTP User

```bash
# Create IAM user for SES SMTP
# Naming: acontplus-{env}-ses-smtp-user
aws iam create-user --user-name acontplus-prd-ses-smtp-user

# Attach SES policy
aws iam attach-user-policy \
  --user-name acontplus-prd-ses-smtp-user \
  --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess
```

### Create SMTP Credentials

```bash
# Create access key for SMTP
aws iam create-access-key --user-name acontplus-prd-ses-smtp-user
```

> **Note:** Store the credentials securely in AWS Secrets Manager:
> ```bash
> aws secretsmanager create-secret \
>   --name "acontplus/prd/ses/smtp-credentials" \
>   --secret-string '{"username":"ACCESS_KEY","password":"SECRET_KEY"}'
> ```

---

## 5. Email Configuration Sets

### Create Configuration Set

```bash
# Naming: acontplus-{env}-ses-config
aws sesv2 create-configuration-set \
  --configuration-set-name acontplus-prd-ses-config
```

### Add Event Destination (CloudWatch)

```bash
aws sesv2 create-configuration-set-event-destination \
  --configuration-set-name acontplus-prd-ses-config \
  --event-destination-name acontplus-prd-ses-cloudwatch \
  --event-destination '{
    "Enabled": true,
    "MatchingEventTypes": ["SEND", "REJECT", "BOUNCE", "COMPLAINT", "DELIVERY"],
    "CloudWatchDestination": {
      "DimensionConfigurations": [
        {
          "DimensionName": "Environment",
          "DimensionValueSource": "MESSAGE_TAG",
          "DefaultDimensionValue": "prd"
        }
      ]
    }
  }'
```

---

## 6. Sending Limits

### Check Current Limits

```bash
aws sesv2 get-account
```

### Request Production Access

When ready to move out of sandbox:

```bash
aws sesv2 put-account-details \
  --mail-type TRANSACTIONAL \
  --website-url "https://acontplus.com" \
  --use-case-description "Transactional emails for ERP system notifications, invoices, and user authentication" \
  --additional-contact-email-addresses "admin@acontplus.com" \
  --production-access-enabled
```

---

## 7. Suppression List Management

### Add Email to Suppression List

```bash
aws sesv2 put-suppressed-destination \
  --email-address "bounce@example.com" \
  --reason BOUNCE
```

### List Suppressed Emails

```bash
aws sesv2 list-suppressed-destinations
```

### Remove from Suppression List

```bash
aws sesv2 delete-suppressed-destination \
  --email-address "recovered@example.com"
```

---

## 8. Email Templates

### Create Email Template

```bash
# Naming: acontplus-{env}-{template-name}
aws sesv2 create-email-template \
  --template-name acontplus-prd-invoice-notification \
  --template-content '{
    "Subject": "Invoice #{{invoice_number}} from AcontPlus",
    "Html": "<h1>Invoice</h1><p>Dear {{customer_name}},</p><p>Your invoice #{{invoice_number}} is ready.</p>",
    "Text": "Invoice #{{invoice_number}} for {{customer_name}}"
  }'
```

### List Templates

```bash
aws sesv2 list-email-templates
```

---

## Quick Reference: SES Resource Naming

| Resource Type | Format | Example |
|---------------|--------|---------|
| SMTP User | `acontplus-{env}-ses-smtp-user` | `acontplus-prd-ses-smtp-user` |
| Configuration Set | `acontplus-{env}-ses-config` | `acontplus-prd-ses-config` |
| Email Template | `acontplus-{env}-{template}` | `acontplus-prd-invoice-notification` |
| Secrets | `acontplus/{env}/ses/{name}` | `acontplus/prd/ses/smtp-credentials` |

---

## SMTP Settings

| Setting | Value |
|---------|-------|
| SMTP Endpoint | `email-smtp.us-east-1.amazonaws.com` |
| Port (TLS) | 587 |
| Port (SSL) | 465 |
| Authentication | SMTP credentials from IAM |

---

## Troubleshooting

### Check Sending Statistics

```bash
aws sesv2 get-account --query "SendQuota"
```

### Check Bounce/Complaint Rates

```bash
aws sesv2 get-account --query "ReputationOptions"
```

### Verify Domain Status

```bash
aws sesv2 get-email-identity --email-identity acontplus.com
```

---

## Related Documentation

- [AWS Naming Convention](../../../docs/AWS-Naming-Convention.md)
- [ECS Deployment Guide](../../../scripts/aws/ecs-deployment-guide.md)
