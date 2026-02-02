#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Deploy script for EC2 Start/Stop Lambda functions
.DESCRIPTION
    Deploys 4 Lambda functions with IAM roles, EventBridge rules, and API Gateway endpoints
    Following naming convention: {prefix}-{env}-{app-type}-{service-name}-{aws-service}
.NOTES
    VPC Dev: vpc-0ac480897a4843766
    VPC Stg: vpc-06138fbf0eb6b9820
    Region: us-east-1
    Created: 2026-02-01
#>

$ErrorActionPreference = "Stop"

# Configuration
$Region = "us-east-1"
$AccountId = "866150703026"
$Prefix = "acontplus"

# Lambda function names (following naming convention)
$LambdaFunctions = @{
    DevStart = "acontplus-dev-wrk-ec2-start-lmb"
    DevStop  = "acontplus-dev-wrk-ec2-stop-lmb"
    StgStart = "acontplus-stg-wrk-ec2-start-lmb"
    StgStop  = "acontplus-stg-wrk-ec2-stop-lmb"
}

# IAM Role name for Lambda execution
$LambdaRoleName = "acontplus-wrk-ec2-mgmt-role"

# EventBridge rule names
$EventBridgeRules = @{
    DevStart = "acontplus-dev-wrk-ec2-start-rule"   # 9am Ecuador (14:00 UTC)
    AllStop  = "acontplus-wrk-ec2-stop-rule"        # 6pm Ecuador (23:00 UTC)
}

# API Gateway names
$ApiGatewayNames = @{
    Dev = "acontplus-dev-wrk-ec2-apigw"
    Stg = "acontplus-stg-wrk-ec2-apigw"
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EC2 Lambda Functions Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# STEP 1: Create IAM Role for Lambda
# ============================================================================
Write-Host "[1/5] Creating IAM Role: $LambdaRoleName" -ForegroundColor Yellow

$TrustPolicy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
"@

$TrustPolicyFile = "trust-policy-lambda.json"
$TrustPolicy | Out-File -FilePath $TrustPolicyFile -Encoding utf8

# Create role
try {
    aws iam create-role `
        --role-name $LambdaRoleName `
        --assume-role-policy-document file://$TrustPolicyFile `
        --description "IAM role for EC2 start/stop Lambda functions" `
        --tags Key=Project,Value=AcontPlus Key=ManagedBy,Value=script Key=CreatedDate,Value=2026-02-01 `
        --region $Region
    Write-Host "  ✓ Role created: $LambdaRoleName" -ForegroundColor Green
}
catch {
    if ($_.Exception.Message -like "*EntityAlreadyExists*") {
        Write-Host "  ℹ Role already exists: $LambdaRoleName" -ForegroundColor Blue
    }
    else {
        throw
    }
}

# Create inline policy for EC2 and CloudWatch Logs
$Ec2Policy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "EC2StartStop",
            "Effect": "Allow",
            "Action": [
                "ec2:StartInstances",
                "ec2:StopInstances",
                "ec2:DescribeInstances",
                "ec2:DescribeInstanceStatus"
            ],
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "ec2:ResourceTag/Project": "AcontPlus"
                }
            }
        },
        {
            "Sid": "EC2DescribeAll",
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeInstanceStatus"
            ],
            "Resource": "*"
        },
        {
            "Sid": "CloudWatchLogs",
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:${Region}:${AccountId}:log-group:/aws/lambda/acontplus-*"
        }
    ]
}
"@

$Ec2PolicyFile = "ec2-policy-lambda.json"
$Ec2Policy | Out-File -FilePath $Ec2PolicyFile -Encoding utf8

aws iam put-role-policy `
    --role-name $LambdaRoleName `
    --policy-name "acontplus-policy-ec2-mgmt" `
    --policy-document file://$Ec2PolicyFile `
    --region $Region

Write-Host "  ✓ Policy attached to role" -ForegroundColor Green

# Wait for role to propagate
Write-Host "  ⏳ Waiting 10 seconds for IAM role propagation..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# ============================================================================
# STEP 2: Package and Deploy Lambda Functions
# ============================================================================
Write-Host ""
Write-Host "[2/5] Deploying Lambda Functions" -ForegroundColor Yellow

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$LambdaFiles = @{
    DevStart = Join-Path $ScriptDir "acontplus-dev-wrk-ec2-start-lmb.py"
    DevStop  = Join-Path $ScriptDir "acontplus-dev-wrk-ec2-stop-lmb.py"
    StgStart = Join-Path $ScriptDir "acontplus-stg-wrk-ec2-start-lmb.py"
    StgStop  = Join-Path $ScriptDir "acontplus-stg-wrk-ec2-stop-lmb.py"
}

$RoleArn = "arn:aws:iam::${AccountId}:role/${LambdaRoleName}"

foreach ($key in $LambdaFunctions.Keys) {
    $FunctionName = $LambdaFunctions[$key]
    $SourceFile = $LambdaFiles[$key]
    $ZipFile = "${FunctionName}.zip"

    Write-Host "  Deploying: $FunctionName" -ForegroundColor White

    # Create zip package
    if (Test-Path $ZipFile) { Remove-Item $ZipFile }

    # Copy to lambda_function.py (AWS Lambda default handler)
    Copy-Item $SourceFile "lambda_function.py"
    Compress-Archive -Path "lambda_function.py" -DestinationPath $ZipFile -Force
    Remove-Item "lambda_function.py"

    # Check if function exists
    $functionExists = $false
    try {
        aws lambda get-function --function-name $FunctionName --region $Region 2>$null
        $functionExists = $true
    }
    catch {
        $functionExists = $false
    }

    if ($functionExists) {
        # Update existing function
        aws lambda update-function-code `
            --function-name $FunctionName `
            --zip-file fileb://$ZipFile `
            --region $Region | Out-Null
        Write-Host "    ✓ Updated: $FunctionName" -ForegroundColor Green
    }
    else {
        # Create new function
        aws lambda create-function `
            --function-name $FunctionName `
            --runtime python3.12 `
            --role $RoleArn `
            --handler lambda_function.lambda_handler `
            --zip-file fileb://$ZipFile `
            --timeout 120 `
            --memory-size 128 `
            --description "EC2 instance management for AcontPlus" `
            --tags Project=AcontPlus,Environment=$($key -replace '(Start|Stop)',''),ManagedBy=script `
            --region $Region | Out-Null
        Write-Host "    ✓ Created: $FunctionName" -ForegroundColor Green
    }

    # Cleanup zip
    Remove-Item $ZipFile
}

# ============================================================================
# STEP 3: Create EventBridge Rules
# ============================================================================
Write-Host ""
Write-Host "[3/5] Creating EventBridge Rules" -ForegroundColor Yellow

# Rule 1: Start Dev instances at 9am Ecuador (14:00 UTC)
$DevStartRuleName = $EventBridgeRules.DevStart
Write-Host "  Creating rule: $DevStartRuleName (9am Ecuador / 14:00 UTC)" -ForegroundColor White

aws events put-rule `
    --name $DevStartRuleName `
    --schedule-expression "cron(0 14 ? * MON-FRI *)" `
    --state ENABLED `
    --description "Start dev EC2 instances at 9am Ecuador time (Mon-Fri)" `
    --tags Key=Project,Value=AcontPlus Key=Environment,Value=dev Key=ManagedBy,Value=script `
    --region $Region | Out-Null

# Add target for dev start Lambda
$DevStartLambdaArn = "arn:aws:lambda:${Region}:${AccountId}:function:$($LambdaFunctions.DevStart)"
aws events put-targets `
    --rule $DevStartRuleName `
    --targets "Id=DevStartTarget,Arn=$DevStartLambdaArn" `
    --region $Region | Out-Null

# Add Lambda permission for EventBridge
aws lambda add-permission `
    --function-name $($LambdaFunctions.DevStart) `
    --statement-id "EventBridge-$DevStartRuleName" `
    --action "lambda:InvokeFunction" `
    --principal events.amazonaws.com `
    --source-arn "arn:aws:events:${Region}:${AccountId}:rule/$DevStartRuleName" `
    --region $Region 2>$null

Write-Host "    ✓ Created: $DevStartRuleName" -ForegroundColor Green

# Rule 2: Stop Dev and Stg instances at 6pm Ecuador (23:00 UTC)
$AllStopRuleName = $EventBridgeRules.AllStop
Write-Host "  Creating rule: $AllStopRuleName (6pm Ecuador / 23:00 UTC)" -ForegroundColor White

aws events put-rule `
    --name $AllStopRuleName `
    --schedule-expression "cron(0 23 ? * MON-FRI *)" `
    --state ENABLED `
    --description "Stop dev and stg EC2 instances at 6pm Ecuador time (Mon-Fri)" `
    --tags Key=Project,Value=AcontPlus Key=ManagedBy,Value=script `
    --region $Region | Out-Null

# Add targets for both dev and stg stop Lambdas
$DevStopLambdaArn = "arn:aws:lambda:${Region}:${AccountId}:function:$($LambdaFunctions.DevStop)"
$StgStopLambdaArn = "arn:aws:lambda:${Region}:${AccountId}:function:$($LambdaFunctions.StgStop)"

aws events put-targets `
    --rule $AllStopRuleName `
    --targets "Id=DevStopTarget,Arn=$DevStopLambdaArn" "Id=StgStopTarget,Arn=$StgStopLambdaArn" `
    --region $Region | Out-Null

# Add Lambda permissions for EventBridge
aws lambda add-permission `
    --function-name $($LambdaFunctions.DevStop) `
    --statement-id "EventBridge-$AllStopRuleName" `
    --action "lambda:InvokeFunction" `
    --principal events.amazonaws.com `
    --source-arn "arn:aws:events:${Region}:${AccountId}:rule/$AllStopRuleName" `
    --region $Region 2>$null

aws lambda add-permission `
    --function-name $($LambdaFunctions.StgStop) `
    --statement-id "EventBridge-$AllStopRuleName" `
    --action "lambda:InvokeFunction" `
    --principal events.amazonaws.com `
    --source-arn "arn:aws:events:${Region}:${AccountId}:rule/$AllStopRuleName" `
    --region $Region 2>$null

Write-Host "    ✓ Created: $AllStopRuleName" -ForegroundColor Green

# ============================================================================
# STEP 4: Create API Gateway for Dev
# ============================================================================
Write-Host ""
Write-Host "[4/5] Creating API Gateway: $($ApiGatewayNames.Dev)" -ForegroundColor Yellow

# Create REST API for Dev
$DevApiResult = aws apigateway create-rest-api `
    --name $($ApiGatewayNames.Dev) `
    --description "API Gateway for Dev EC2 start/stop operations" `
    --endpoint-configuration types=REGIONAL `
    --tags Project=AcontPlus,Environment=dev,ManagedBy=script `
    --region $Region | ConvertFrom-Json

$DevApiId = $DevApiResult.id
Write-Host "  ✓ API created with ID: $DevApiId" -ForegroundColor Green

# Get root resource ID
$DevResources = aws apigateway get-resources --rest-api-id $DevApiId --region $Region | ConvertFrom-Json
$DevRootId = $DevResources.items[0].id

# Create /ec2 resource
$DevEc2Resource = aws apigateway create-resource `
    --rest-api-id $DevApiId `
    --parent-id $DevRootId `
    --path-part "ec2" `
    --region $Region | ConvertFrom-Json

# Create /ec2/start resource and method
$DevStartResource = aws apigateway create-resource `
    --rest-api-id $DevApiId `
    --parent-id $DevEc2Resource.id `
    --path-part "start" `
    --region $Region | ConvertFrom-Json

aws apigateway put-method `
    --rest-api-id $DevApiId `
    --resource-id $DevStartResource.id `
    --http-method POST `
    --authorization-type NONE `
    --region $Region | Out-Null

aws apigateway put-method `
    --rest-api-id $DevApiId `
    --resource-id $DevStartResource.id `
    --http-method OPTIONS `
    --authorization-type NONE `
    --region $Region | Out-Null

$DevStartLambdaUri = "arn:aws:apigateway:${Region}:lambda:path/2015-03-31/functions/${DevStartLambdaArn}/invocations"
aws apigateway put-integration `
    --rest-api-id $DevApiId `
    --resource-id $DevStartResource.id `
    --http-method POST `
    --type AWS_PROXY `
    --integration-http-method POST `
    --uri $DevStartLambdaUri `
    --region $Region | Out-Null

# Add Lambda permission for API Gateway (dev start)
aws lambda add-permission `
    --function-name $($LambdaFunctions.DevStart) `
    --statement-id "APIGateway-$DevApiId-start" `
    --action "lambda:InvokeFunction" `
    --principal apigateway.amazonaws.com `
    --source-arn "arn:aws:execute-api:${Region}:${AccountId}:${DevApiId}/*/*" `
    --region $Region 2>$null

Write-Host "  ✓ Created /ec2/start endpoint" -ForegroundColor Green

# Create /ec2/stop resource and method
$DevStopResource = aws apigateway create-resource `
    --rest-api-id $DevApiId `
    --parent-id $DevEc2Resource.id `
    --path-part "stop" `
    --region $Region | ConvertFrom-Json

aws apigateway put-method `
    --rest-api-id $DevApiId `
    --resource-id $DevStopResource.id `
    --http-method POST `
    --authorization-type NONE `
    --region $Region | Out-Null

aws apigateway put-method `
    --rest-api-id $DevApiId `
    --resource-id $DevStopResource.id `
    --http-method OPTIONS `
    --authorization-type NONE `
    --region $Region | Out-Null

$DevStopLambdaUri = "arn:aws:apigateway:${Region}:lambda:path/2015-03-31/functions/${DevStopLambdaArn}/invocations"
aws apigateway put-integration `
    --rest-api-id $DevApiId `
    --resource-id $DevStopResource.id `
    --http-method POST `
    --type AWS_PROXY `
    --integration-http-method POST `
    --uri $DevStopLambdaUri `
    --region $Region | Out-Null

# Add Lambda permission for API Gateway (dev stop)
aws lambda add-permission `
    --function-name $($LambdaFunctions.DevStop) `
    --statement-id "APIGateway-$DevApiId-stop" `
    --action "lambda:InvokeFunction" `
    --principal apigateway.amazonaws.com `
    --source-arn "arn:aws:execute-api:${Region}:${AccountId}:${DevApiId}/*/*" `
    --region $Region 2>$null

Write-Host "  ✓ Created /ec2/stop endpoint" -ForegroundColor Green

# Deploy Dev API
aws apigateway create-deployment `
    --rest-api-id $DevApiId `
    --stage-name "v1" `
    --description "Initial deployment" `
    --region $Region | Out-Null

Write-Host "  ✓ Deployed to stage: v1" -ForegroundColor Green

# ============================================================================
# STEP 5: Create API Gateway for Stg
# ============================================================================
Write-Host ""
Write-Host "[5/5] Creating API Gateway: $($ApiGatewayNames.Stg)" -ForegroundColor Yellow

# Create REST API for Stg
$StgApiResult = aws apigateway create-rest-api `
    --name $($ApiGatewayNames.Stg) `
    --description "API Gateway for Stg EC2 start/stop operations" `
    --endpoint-configuration types=REGIONAL `
    --tags Project=AcontPlus,Environment=stg,ManagedBy=script `
    --region $Region | ConvertFrom-Json

$StgApiId = $StgApiResult.id
Write-Host "  ✓ API created with ID: $StgApiId" -ForegroundColor Green

# Get root resource ID
$StgResources = aws apigateway get-resources --rest-api-id $StgApiId --region $Region | ConvertFrom-Json
$StgRootId = $StgResources.items[0].id

# Create /ec2 resource
$StgEc2Resource = aws apigateway create-resource `
    --rest-api-id $StgApiId `
    --parent-id $StgRootId `
    --path-part "ec2" `
    --region $Region | ConvertFrom-Json

# Create /ec2/start resource and method
$StgStartResource = aws apigateway create-resource `
    --rest-api-id $StgApiId `
    --parent-id $StgEc2Resource.id `
    --path-part "start" `
    --region $Region | ConvertFrom-Json

$StgStartLambdaArn = "arn:aws:lambda:${Region}:${AccountId}:function:$($LambdaFunctions.StgStart)"

aws apigateway put-method `
    --rest-api-id $StgApiId `
    --resource-id $StgStartResource.id `
    --http-method POST `
    --authorization-type NONE `
    --region $Region | Out-Null

aws apigateway put-method `
    --rest-api-id $StgApiId `
    --resource-id $StgStartResource.id `
    --http-method OPTIONS `
    --authorization-type NONE `
    --region $Region | Out-Null

$StgStartLambdaUri = "arn:aws:apigateway:${Region}:lambda:path/2015-03-31/functions/${StgStartLambdaArn}/invocations"
aws apigateway put-integration `
    --rest-api-id $StgApiId `
    --resource-id $StgStartResource.id `
    --http-method POST `
    --type AWS_PROXY `
    --integration-http-method POST `
    --uri $StgStartLambdaUri `
    --region $Region | Out-Null

# Add Lambda permission for API Gateway (stg start)
aws lambda add-permission `
    --function-name $($LambdaFunctions.StgStart) `
    --statement-id "APIGateway-$StgApiId-start" `
    --action "lambda:InvokeFunction" `
    --principal apigateway.amazonaws.com `
    --source-arn "arn:aws:execute-api:${Region}:${AccountId}:${StgApiId}/*/*" `
    --region $Region 2>$null

Write-Host "  ✓ Created /ec2/start endpoint" -ForegroundColor Green

# Create /ec2/stop resource and method
$StgStopResource = aws apigateway create-resource `
    --rest-api-id $StgApiId `
    --parent-id $StgEc2Resource.id `
    --path-part "stop" `
    --region $Region | ConvertFrom-Json

aws apigateway put-method `
    --rest-api-id $StgApiId `
    --resource-id $StgStopResource.id `
    --http-method POST `
    --authorization-type NONE `
    --region $Region | Out-Null

aws apigateway put-method `
    --rest-api-id $StgApiId `
    --resource-id $StgStopResource.id `
    --http-method OPTIONS `
    --authorization-type NONE `
    --region $Region | Out-Null

$StgStopLambdaUri = "arn:aws:apigateway:${Region}:lambda:path/2015-03-31/functions/${StgStopLambdaArn}/invocations"
aws apigateway put-integration `
    --rest-api-id $StgApiId `
    --resource-id $StgStopResource.id `
    --http-method POST `
    --type AWS_PROXY `
    --integration-http-method POST `
    --uri $StgStopLambdaUri `
    --region $Region | Out-Null

# Add Lambda permission for API Gateway (stg stop)
aws lambda add-permission `
    --function-name $($LambdaFunctions.StgStop) `
    --statement-id "APIGateway-$StgApiId-stop" `
    --action "lambda:InvokeFunction" `
    --principal apigateway.amazonaws.com `
    --source-arn "arn:aws:execute-api:${Region}:${AccountId}:${StgApiId}/*/*" `
    --region $Region 2>$null

Write-Host "  ✓ Created /ec2/stop endpoint" -ForegroundColor Green

# Deploy Stg API
aws apigateway create-deployment `
    --rest-api-id $StgApiId `
    --stage-name "v1" `
    --description "Initial deployment" `
    --region $Region | Out-Null

Write-Host "  ✓ Deployed to stage: v1" -ForegroundColor Green

# ============================================================================
# Cleanup temp files
# ============================================================================
Remove-Item $TrustPolicyFile -ErrorAction SilentlyContinue
Remove-Item $Ec2PolicyFile -ErrorAction SilentlyContinue

# ============================================================================
# Summary
# ============================================================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Lambda Functions:" -ForegroundColor White
Write-Host "  - $($LambdaFunctions.DevStart)" -ForegroundColor Gray
Write-Host "  - $($LambdaFunctions.DevStop)" -ForegroundColor Gray
Write-Host "  - $($LambdaFunctions.StgStart)" -ForegroundColor Gray
Write-Host "  - $($LambdaFunctions.StgStop)" -ForegroundColor Gray
Write-Host ""
Write-Host "IAM Role:" -ForegroundColor White
Write-Host "  - $LambdaRoleName" -ForegroundColor Gray
Write-Host ""
Write-Host "EventBridge Rules:" -ForegroundColor White
Write-Host "  - $($EventBridgeRules.DevStart) (Mon-Fri 9am EC / 14:00 UTC)" -ForegroundColor Gray
Write-Host "  - $($EventBridgeRules.AllStop) (Mon-Fri 6pm EC / 23:00 UTC)" -ForegroundColor Gray
Write-Host ""
Write-Host "API Gateway Endpoints:" -ForegroundColor White
Write-Host "  Dev:" -ForegroundColor Yellow
Write-Host "    POST https://${DevApiId}.execute-api.${Region}.amazonaws.com/v1/ec2/start" -ForegroundColor Gray
Write-Host "    POST https://${DevApiId}.execute-api.${Region}.amazonaws.com/v1/ec2/stop" -ForegroundColor Gray
Write-Host "  Stg:" -ForegroundColor Yellow
Write-Host "    POST https://${StgApiId}.execute-api.${Region}.amazonaws.com/v1/ec2/start" -ForegroundColor Gray
Write-Host "    POST https://${StgApiId}.execute-api.${Region}.amazonaws.com/v1/ec2/stop" -ForegroundColor Gray
Write-Host ""
