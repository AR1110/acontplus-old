#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Deploy script for EC2 Management Lambda functions
.DESCRIPTION
    Deploys Lambda functions for EC2 start/stop and scaling operations with:
    - IAM roles (Lambda execution + EventBridge Scheduler)
    - EventBridge Scheduler (NOT legacy rules)
    - API Gateway endpoints

    Following naming convention: {prefix}-{env}-{app-type}-{service-name}-{aws-service}
.PARAMETER Profile
    AWS CLI profile to use (default: acontplus-admin)
.PARAMETER SkipApiGateway
    Skip API Gateway creation/update
.PARAMETER SkipScheduler
    Skip EventBridge Scheduler creation/update
.EXAMPLE
    ./deploy-ec2-lambdas.ps1
    ./deploy-ec2-lambdas.ps1 -Profile myprofile
.NOTES
    VPC Dev: vpc-0ac480897a4843766 (i-06deac55680284806)
    VPC Stg: vpc-06138fbf0eb6b9820 (i-0062da774c359130d, i-0babc4241fc457a3d)
    VPC Prd: i-051e94df5bca54c9f (scaling)
    Region: us-east-1
    Updated: 2026-02-01
#>

param(
    [string]$Profile = "acontplus-admin",
    [switch]$SkipApiGateway,
    [switch]$SkipScheduler
)

$ErrorActionPreference = "Stop"

# Configuration
$Region = "us-east-1"
$AccountId = "866150703026"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Lambda functions configuration
$Lambdas = @(
    @{ Name = "acontplus-dev-wrk-ec2-start-lmb"; File = "acontplus-dev-wrk-ec2-start-lmb.py"; Env = "dev"; Action = "start" }
    @{ Name = "acontplus-dev-wrk-ec2-stop-lmb"; File = "acontplus-dev-wrk-ec2-stop-lmb.py"; Env = "dev"; Action = "stop" }
    @{ Name = "acontplus-stg-wrk-ec2-start-lmb"; File = "acontplus-stg-wrk-ec2-start-lmb.py"; Env = "stg"; Action = "start" }
    @{ Name = "acontplus-stg-wrk-ec2-stop-lmb"; File = "acontplus-stg-wrk-ec2-stop-lmb.py"; Env = "stg"; Action = "stop" }
    @{ Name = "acontplus-prd-wrk-ec2-scaleup-lmb"; File = "acontplus-prd-wrk-ec2-scaleup-lmb.py"; Env = "prd"; Action = "scaleup" }
    @{ Name = "acontplus-prd-wrk-ec2-scaledown-lmb"; File = "acontplus-prd-wrk-ec2-scaledown-lmb.py"; Env = "prd"; Action = "scaledown" }
)

# EventBridge Scheduler configuration (uses America/Guayaquil timezone)
$Schedules = @(
    @{ Name = "acontplus-dev-wrk-ec2-start-schedule"; Lambda = "acontplus-dev-wrk-ec2-start-lmb"; Cron = "cron(0 9 ? * MON-FRI *)"; Desc = "Start dev EC2 at 9am Ecuador Mon-Fri" }
    @{ Name = "acontplus-wrk-ec2-stop-schedule"; Lambda = "acontplus-dev-wrk-ec2-stop-lmb"; Cron = "cron(0 18 ? * * *)"; Desc = "Stop dev EC2 at 6pm Ecuador daily" }
    @{ Name = "acontplus-stg-wrk-ec2-stop-schedule"; Lambda = "acontplus-stg-wrk-ec2-stop-lmb"; Cron = "cron(0 18 ? * * *)"; Desc = "Stop stg EC2 at 6pm Ecuador daily" }
    @{ Name = "acontplus-prd-wrk-ec2-scaleup-schedule"; Lambda = "acontplus-prd-wrk-ec2-scaleup-lmb"; Cron = "cron(0 6 ? * * *)"; Desc = "Scale up prd EC2 to t3.medium at 6am Ecuador daily" }
    @{ Name = "acontplus-prd-wrk-ec2-scaledown-schedule"; Lambda = "acontplus-prd-wrk-ec2-scaledown-lmb"; Cron = "cron(0 23 ? * * *)"; Desc = "Scale down prd EC2 to t3.small at 11pm Ecuador daily" }
)

# API Gateways configuration
$ApiGateways = @(
    @{ Name = "acontplus-dev-wrk-ec2-apigw"; Env = "dev"; StartLambda = "acontplus-dev-wrk-ec2-start-lmb"; StopLambda = "acontplus-dev-wrk-ec2-stop-lmb" }
    @{ Name = "acontplus-stg-wrk-ec2-apigw"; Env = "stg"; StartLambda = "acontplus-stg-wrk-ec2-start-lmb"; StopLambda = "acontplus-stg-wrk-ec2-stop-lmb" }
)

# IAM Role names
$LambdaRoleName = "acontplus-wrk-ec2-mgmt-role"
$SchedulerRoleName = "acontplus-scheduler-role"
$ScheduleGroupName = "acontplus-ec2-management"

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "     EC2 Management Lambda Functions Deployment" -ForegroundColor Cyan
Write-Host "               Profile: $Profile" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# STEP 1: Create/Verify IAM Roles
# ============================================================================
Write-Host "[1/5] Setting up IAM Roles" -ForegroundColor Yellow

# Lambda execution role
$LambdaTrustPolicy = @'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": { "Service": "lambda.amazonaws.com" },
            "Action": "sts:AssumeRole"
        }
    ]
}
'@

try {
    aws iam get-role --role-name $LambdaRoleName --profile $Profile 2>$null | Out-Null
    Write-Host "  [OK] Lambda role exists: $LambdaRoleName" -ForegroundColor Green
}
catch {
    Write-Host "  Creating Lambda role: $LambdaRoleName" -ForegroundColor White
    aws iam create-role --role-name $LambdaRoleName --assume-role-policy-document $LambdaTrustPolicy --profile $Profile --no-cli-pager | Out-Null
    Write-Host "  [OK] Lambda role created" -ForegroundColor Green
}

# Lambda execution policy
$LambdaPolicy = @'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": ["ec2:StartInstances", "ec2:StopInstances", "ec2:DescribeInstances", "ec2:ModifyInstanceAttribute"],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
'@

aws iam put-role-policy --role-name $LambdaRoleName --policy-name "EC2ManagementPolicy" --policy-document $LambdaPolicy --profile $Profile
Write-Host "  [OK] Lambda policy attached" -ForegroundColor Green

# Scheduler role
$SchedulerTrustPolicy = @'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": { "Service": "scheduler.amazonaws.com" },
            "Action": "sts:AssumeRole"
        }
    ]
}
'@

try {
    aws iam get-role --role-name $SchedulerRoleName --profile $Profile 2>$null | Out-Null
    Write-Host "  [OK] Scheduler role exists: $SchedulerRoleName" -ForegroundColor Green
}
catch {
    Write-Host "  Creating Scheduler role: $SchedulerRoleName" -ForegroundColor White
    aws iam create-role --role-name $SchedulerRoleName --assume-role-policy-document $SchedulerTrustPolicy --profile $Profile --no-cli-pager | Out-Null
    Write-Host "  [OK] Scheduler role created" -ForegroundColor Green
}

# Scheduler invoke policy
$LambdaArns = ($Lambdas | ForEach-Object { "`"arn:aws:lambda:${Region}:${AccountId}:function:$($_.Name)`"" }) -join ","
$SchedulerPolicy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "lambda:InvokeFunction",
            "Resource": [$LambdaArns]
        }
    ]
}
"@

aws iam put-role-policy --role-name $SchedulerRoleName --policy-name "InvokeLambdaPolicy" --policy-document $SchedulerPolicy --profile $Profile
Write-Host "  [OK] Scheduler policy attached" -ForegroundColor Green

Write-Host "  Waiting 10s for IAM propagation..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# ============================================================================
# STEP 2: Deploy Lambda Functions
# ============================================================================
Write-Host ""
Write-Host "[2/5] Deploying Lambda Functions" -ForegroundColor Yellow

$LambdaRoleArn = "arn:aws:iam::${AccountId}:role/${LambdaRoleName}"

foreach ($lambda in $Lambdas) {
    $FunctionName = $lambda.Name
    $SourceFile = Join-Path $ScriptDir $lambda.File
    $ZipFile = Join-Path $ScriptDir "$FunctionName.zip"
    $Handler = "$FunctionName.lambda_handler"

    Write-Host "  Deploying: $FunctionName" -ForegroundColor White

    # Create zip package
    if (Test-Path $ZipFile) { Remove-Item $ZipFile -Force }
    Compress-Archive -Path $SourceFile -DestinationPath $ZipFile -Force

    # Check if function exists
    $functionExists = aws lambda list-functions --profile $Profile --query "Functions[?FunctionName=='$FunctionName'].FunctionName" --output text --no-cli-pager

    if ($functionExists -and $functionExists -ne "") {
        # Update existing function
        aws lambda update-function-code --function-name $FunctionName --zip-file "fileb://$ZipFile" --profile $Profile --no-cli-pager | Out-Null
        Start-Sleep -Seconds 2
        aws lambda update-function-configuration --function-name $FunctionName --handler $Handler --profile $Profile --no-cli-pager | Out-Null
        Write-Host "    [OK] Updated" -ForegroundColor Green
    }
    else {
        # Create new function
        $timeout = if ($lambda.Action -in @("scaleup", "scaledown")) { 180 } else { 120 }
        aws lambda create-function `
            --function-name $FunctionName `
            --runtime python3.12 `
            --role $LambdaRoleArn `
            --handler $Handler `
            --zip-file "fileb://$ZipFile" `
            --timeout $timeout `
            --memory-size 128 `
            --profile $Profile `
            --no-cli-pager | Out-Null
        Write-Host "    [OK] Created" -ForegroundColor Green
    }

    Remove-Item $ZipFile -Force
}

# ============================================================================
# STEP 3: Create EventBridge Scheduler (NOT legacy rules)
# ============================================================================
if (-not $SkipScheduler) {
    Write-Host ""
    Write-Host "[3/5] Creating EventBridge Schedules (Scheduler, not legacy)" -ForegroundColor Yellow

    $SchedulerRoleArn = "arn:aws:iam::${AccountId}:role/${SchedulerRoleName}"

    # Create schedule group
    $groupExists = aws scheduler list-schedule-groups --profile $Profile --query "ScheduleGroups[?Name=='$ScheduleGroupName'].Name" --output text --no-cli-pager
    if (-not $groupExists -or $groupExists -eq "") {
        aws scheduler create-schedule-group --name $ScheduleGroupName --profile $Profile --no-cli-pager | Out-Null
        Write-Host "  [OK] Schedule group created: $ScheduleGroupName" -ForegroundColor Green
    }
    else {
        Write-Host "  [OK] Schedule group exists: $ScheduleGroupName" -ForegroundColor Green
    }

    foreach ($schedule in $Schedules) {
        $ScheduleName = $schedule.Name
        $LambdaArn = "arn:aws:lambda:${Region}:${AccountId}:function:$($schedule.Lambda)"

        Write-Host "  Creating: $ScheduleName" -ForegroundColor White

        # Check if schedule exists
        $scheduleExists = aws scheduler list-schedules --group-name $ScheduleGroupName --profile $Profile --query "Schedules[?Name=='$ScheduleName'].Name" --output text --no-cli-pager

        if ($scheduleExists -and $scheduleExists -ne "") {
            # Update existing schedule
            aws scheduler update-schedule `
                --name $ScheduleName `
                --group-name $ScheduleGroupName `
                --schedule-expression $schedule.Cron `
                --schedule-expression-timezone "America/Guayaquil" `
                --flexible-time-window "Mode=OFF" `
                --target "Arn=$LambdaArn,RoleArn=$SchedulerRoleArn" `
                --state ENABLED `
                --profile $Profile `
                --no-cli-pager | Out-Null
            Write-Host "    [OK] Updated" -ForegroundColor Green
        }
        else {
            # Create new schedule
            aws scheduler create-schedule `
                --name $ScheduleName `
                --group-name $ScheduleGroupName `
                --schedule-expression $schedule.Cron `
                --schedule-expression-timezone "America/Guayaquil" `
                --flexible-time-window "Mode=OFF" `
                --target "Arn=$LambdaArn,RoleArn=$SchedulerRoleArn" `
                --state ENABLED `
                --description $schedule.Desc `
                --profile $Profile `
                --no-cli-pager | Out-Null
            Write-Host "    [OK] Created" -ForegroundColor Green
        }
    }
}
else {
    Write-Host ""
    Write-Host "[3/5] Skipping EventBridge Scheduler (--SkipScheduler)" -ForegroundColor Gray
}

# ============================================================================
# STEP 4: Create API Gateways
# ============================================================================
if (-not $SkipApiGateway) {
    Write-Host ""
    Write-Host "[4/5] Creating API Gateways" -ForegroundColor Yellow

    foreach ($api in $ApiGateways) {
        $ApiName = $api.Name
        $StartLambdaArn = "arn:aws:lambda:${Region}:${AccountId}:function:$($api.StartLambda)"
        $StopLambdaArn = "arn:aws:lambda:${Region}:${AccountId}:function:$($api.StopLambda)"

        Write-Host "  Setting up: $ApiName" -ForegroundColor White

        # Check if API exists
        $existingApi = aws apigateway get-rest-apis --profile $Profile --query "items[?name=='$ApiName'].id" --output text --no-cli-pager

        if ($existingApi -and $existingApi -ne "") {
            $ApiId = $existingApi
            Write-Host "    [OK] API exists: $ApiId" -ForegroundColor Green
        }
        else {
            # Create new API
            $apiResult = aws apigateway create-rest-api `
                --name $ApiName `
                --description "API Gateway for $($api.Env) EC2 start/stop operations" `
                --endpoint-configuration types=REGIONAL `
                --profile $Profile `
                --no-cli-pager | ConvertFrom-Json
            $ApiId = $apiResult.id
            Write-Host "    [OK] API created: $ApiId" -ForegroundColor Green

            # Get root resource
            $rootId = (aws apigateway get-resources --rest-api-id $ApiId --profile $Profile --no-cli-pager | ConvertFrom-Json).items[0].id

            # Create /ec2 resource
            $ec2Resource = aws apigateway create-resource --rest-api-id $ApiId --parent-id $rootId --path-part "ec2" --profile $Profile --no-cli-pager | ConvertFrom-Json

            # Create /ec2/start
            $startResource = aws apigateway create-resource --rest-api-id $ApiId --parent-id $ec2Resource.id --path-part "start" --profile $Profile --no-cli-pager | ConvertFrom-Json
            aws apigateway put-method --rest-api-id $ApiId --resource-id $startResource.id --http-method POST --authorization-type NONE --profile $Profile --no-cli-pager | Out-Null
            aws apigateway put-integration --rest-api-id $ApiId --resource-id $startResource.id --http-method POST --type AWS_PROXY --integration-http-method POST --uri "arn:aws:apigateway:${Region}:lambda:path/2015-03-31/functions/${StartLambdaArn}/invocations" --profile $Profile --no-cli-pager | Out-Null

            # Create /ec2/stop
            $stopResource = aws apigateway create-resource --rest-api-id $ApiId --parent-id $ec2Resource.id --path-part "stop" --profile $Profile --no-cli-pager | ConvertFrom-Json
            aws apigateway put-method --rest-api-id $ApiId --resource-id $stopResource.id --http-method POST --authorization-type NONE --profile $Profile --no-cli-pager | Out-Null
            aws apigateway put-integration --rest-api-id $ApiId --resource-id $stopResource.id --http-method POST --type AWS_PROXY --integration-http-method POST --uri "arn:aws:apigateway:${Region}:lambda:path/2015-03-31/functions/${StopLambdaArn}/invocations" --profile $Profile --no-cli-pager | Out-Null

            # Add Lambda permissions
            aws lambda add-permission --function-name $api.StartLambda --statement-id "APIGateway-$ApiId-start" --action "lambda:InvokeFunction" --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:${Region}:${AccountId}:${ApiId}/*/*" --profile $Profile 2>$null
            aws lambda add-permission --function-name $api.StopLambda --statement-id "APIGateway-$ApiId-stop" --action "lambda:InvokeFunction" --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:${Region}:${AccountId}:${ApiId}/*/*" --profile $Profile 2>$null

            # Deploy API
            aws apigateway create-deployment --rest-api-id $ApiId --stage-name "v1" --profile $Profile --no-cli-pager | Out-Null
            Write-Host "    [OK] Deployed to stage: v1" -ForegroundColor Green
        }

        Write-Host "    URL: https://$ApiId.execute-api.$Region.amazonaws.com/v1/ec2/" -ForegroundColor Cyan
    }
}
else {
    Write-Host ""
    Write-Host "[4/5] Skipping API Gateway (--SkipApiGateway)" -ForegroundColor Gray
}

# ============================================================================
# STEP 5: Summary
# ============================================================================
Write-Host ""
Write-Host "[5/5] Deployment Summary" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Lambda Functions:" -ForegroundColor White
foreach ($lambda in $Lambdas) {
    Write-Host "    - $($lambda.Name)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "  EventBridge Schedules (America/Guayaquil timezone):" -ForegroundColor White
foreach ($schedule in $Schedules) {
    Write-Host "    - $($schedule.Name)" -ForegroundColor Gray
    Write-Host "      $($schedule.Cron)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "  API Gateway Endpoints:" -ForegroundColor White
foreach ($api in $ApiGateways) {
    $existingApi = aws apigateway get-rest-apis --profile $Profile --query "items[?name=='$($api.Name)'].id" --output text --no-cli-pager
    if ($existingApi) {
        Write-Host "    - POST https://$existingApi.execute-api.$Region.amazonaws.com/v1/ec2/start" -ForegroundColor Gray
        Write-Host "    - POST https://$existingApi.execute-api.$Region.amazonaws.com/v1/ec2/stop" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "         Deployment completed successfully!" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host ""
