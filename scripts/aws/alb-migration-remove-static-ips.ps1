# ============================================================================
# ALB Migration Script: Remove Static EIPs
# ============================================================================
#
# PROBLEMA: El ALB 'acontplus-erp' tiene EIPs ServiceManaged que no se pueden
# liberar manualmente. AWS sigue creando nuevas EIPs automáticamente.
#
# SOLUCIÓN: Recrear el ALB sin EIPs estáticas (usando IPs dinámicas gratuitas)
#
# COSTO ACTUAL: ~$11/mes en EIPs (3 EIPs ServiceManaged)
# COSTO DESPUÉS: $0 (IPs dinámicas son gratuitas)
#
# ============================================================================

$ErrorActionPreference = "Stop"
$REGION = "us-east-1"

# Colores para output
function Write-Step { param($msg) Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Write-Info { param($msg) Write-Host "  $msg" -ForegroundColor Gray }
function Write-Success { param($msg) Write-Host "  ✅ $msg" -ForegroundColor Green }
function Write-Warning { param($msg) Write-Host "  ⚠️ $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "  ❌ $msg" -ForegroundColor Red }

# ============================================================================
# CONFIGURACIÓN ACTUAL DEL ALB
# ============================================================================

$ALB_CONFIG = @{
    # ALB Actual (será eliminado)
    OldName = "acontplus-erp"
    OldArn = "arn:aws:elasticloadbalancing:us-east-1:866150703026:loadbalancer/app/acontplus-erp/9913a9e479417d7a"

    # Nuevo ALB (sin EIPs estáticas) - Naming Convention: acontplus-{env}-alb
    NewName = "acontplus-prd-alb"

    # Configuración
    VpcId = "vpc-02176c456642a9383"
    SecurityGroups = @("sg-0b97cddbc968046e6")
    Subnets = @(
        "subnet-07500f3abec27f804",  # us-east-1a
        "subnet-0b9c5c1185466f2c8"   # us-east-1b
    )
    Scheme = "internet-facing"
    Type = "application"

    # Certificate
    CertificateArn = "arn:aws:acm:us-east-1:866150703026:certificate/14b76c70-a87e-4f75-bb48-5b68b58e00e7"
}

# Listener Rules (del ALB actual)
$LISTENER_RULES = @(
    @{ Priority = 10; Host = "admin.acontplus.com"; TargetGroup = "acontplus-admin-prd-tg" }
    @{ Priority = 12; Host = "documentos.acontplus.com"; TargetGroup = "acontplus-invoice-prd-tg" }
    @{ Priority = 13; Host = "app.acontplus.com"; TargetGroup = "acontplus-app-prd-tg" }
    @{ Priority = 14; Host = "restaurant.acontplus.com"; TargetGroup = "acontplus-restaurant-prd-tg" }
    @{ Priority = 15; Host = "client.acontplus.com"; TargetGroup = "acontplus-client-prd-tg" }
    @{ Priority = 16; Host = "api.acontplus.com"; TargetGroup = "acontplus-ocelot-api-prd-tg" }
    @{ Priority = 20; Host = "acontplus.com"; TargetGroup = "acontplus-ocelot-api-prd-tg" }
)

# Target Groups ARNs
$TARGET_GROUPS = @{
    "acontplus-admin-prd-tg" = "arn:aws:elasticloadbalancing:us-east-1:866150703026:targetgroup/acontplus-admin-prd-tg/f80d782ac0a9f2d6"
    "acontplus-app-prd-tg" = "arn:aws:elasticloadbalancing:us-east-1:866150703026:targetgroup/acontplus-app-prd-tg/733dbb8ebdcd85b1"
    "acontplus-client-prd-tg" = "arn:aws:elasticloadbalancing:us-east-1:866150703026:targetgroup/acontplus-client-prd-tg/caa6b7dea97f502f"
    "acontplus-invoice-prd-tg" = "arn:aws:elasticloadbalancing:us-east-1:866150703026:targetgroup/acontplus-invoice-prd-tg/6acb3684427301ad"
    "acontplus-ocelot-api-prd-tg" = "arn:aws:elasticloadbalancing:us-east-1:866150703026:targetgroup/acontplus-ocelot-api-prd-tg/cb8b4918b1c067ca"
    "acontplus-restaurant-prd-tg" = "arn:aws:elasticloadbalancing:us-east-1:866150703026:targetgroup/acontplus-restaurant-prd-tg/992c70cf547a3a8b"
}

# ============================================================================
# PASO 1: Verificar estado actual
# ============================================================================

function Step1-VerifyCurrentState {
    Write-Step "PASO 1: Verificando estado actual"

    # Verificar ALB existe
    Write-Info "Verificando ALB actual..."
    $alb = aws elbv2 describe-load-balancers --names $ALB_CONFIG.OldName --region $REGION 2>$null | ConvertFrom-Json
    if (-not $alb.LoadBalancers) {
        Write-Error "ALB '$($ALB_CONFIG.OldName)' no encontrado!"
        return $false
    }
    Write-Success "ALB encontrado: $($alb.LoadBalancers[0].DNSName)"

    # Verificar EIPs
    Write-Info "Verificando EIPs ServiceManaged..."
    $eips = aws ec2 describe-addresses --region $REGION --query "Addresses[?ServiceManaged=='alb']" | ConvertFrom-Json
    Write-Warning "EIPs ServiceManaged encontradas: $($eips.Count)"
    foreach ($eip in $eips) {
        Write-Info "  - $($eip.PublicIp) ($($eip.AllocationId))"
    }

    # Verificar Target Groups
    Write-Info "Verificando Target Groups..."
    foreach ($tg in $TARGET_GROUPS.Keys) {
        $health = aws elbv2 describe-target-health --target-group-arn $TARGET_GROUPS[$tg] --region $REGION 2>$null | ConvertFrom-Json
        $healthy = ($health.TargetHealthDescriptions | Where-Object { $_.TargetHealth.State -eq "healthy" }).Count
        $total = $health.TargetHealthDescriptions.Count
        Write-Info "  $tg : $healthy/$total healthy"
    }

    return $true
}

# ============================================================================
# PASO 2: Crear nuevo ALB (temporal con nombre diferente)
# ============================================================================

function Step2-CreateNewALB {
    Write-Step "PASO 2: Creando nuevo ALB (temporal)"

    $tempName = "acontplus-erp-new"

    Write-Info "Creando ALB '$tempName' sin EIPs estáticas..."

    $subnetsParam = $ALB_CONFIG.Subnets -join " "
    $sgParam = $ALB_CONFIG.SecurityGroups -join " "

    $newAlb = aws elbv2 create-load-balancer `
        --name $tempName `
        --subnets $ALB_CONFIG.Subnets `
        --security-groups $ALB_CONFIG.SecurityGroups `
        --scheme $ALB_CONFIG.Scheme `
        --type $ALB_CONFIG.Type `
        --region $REGION | ConvertFrom-Json

    if (-not $newAlb.LoadBalancers) {
        Write-Error "Error creando ALB!"
        return $null
    }

    $newArn = $newAlb.LoadBalancers[0].LoadBalancerArn
    $newDns = $newAlb.LoadBalancers[0].DNSName

    Write-Success "Nuevo ALB creado!"
    Write-Info "  ARN: $newArn"
    Write-Info "  DNS: $newDns"

    # Esperar a que esté activo
    Write-Info "Esperando a que el ALB esté activo..."
    aws elbv2 wait load-balancer-available --load-balancer-arns $newArn --region $REGION
    Write-Success "ALB activo!"

    return @{
        Arn = $newArn
        Dns = $newDns
        Name = $tempName
    }
}

# ============================================================================
# PASO 3: Crear Listeners
# ============================================================================

function Step3-CreateListeners {
    param($NewAlbArn)

    Write-Step "PASO 3: Creando Listeners"

    # Crear HTTPS Listener con default action fixed-response
    Write-Info "Creando HTTPS:443 listener..."

    $httpsListener = aws elbv2 create-listener `
        --load-balancer-arn $NewAlbArn `
        --protocol HTTPS `
        --port 443 `
        --certificates CertificateArn=$($ALB_CONFIG.CertificateArn) `
        --default-actions 'Type=fixed-response,FixedResponseConfig={StatusCode=404,ContentType=text/plain,MessageBody="Not Found"}' `
        --region $REGION | ConvertFrom-Json

    if (-not $httpsListener.Listeners) {
        Write-Error "Error creando HTTPS listener!"
        return $null
    }

    $listenerArn = $httpsListener.Listeners[0].ListenerArn
    Write-Success "HTTPS Listener creado: $listenerArn"

    return $listenerArn
}

# ============================================================================
# PASO 4: Crear Rules
# ============================================================================

function Step4-CreateRules {
    param($ListenerArn)

    Write-Step "PASO 4: Creando Listener Rules"

    foreach ($rule in $LISTENER_RULES) {
        Write-Info "Creando rule: $($rule.Host) -> $($rule.TargetGroup)"

        $tgArn = $TARGET_GROUPS[$rule.TargetGroup]

        aws elbv2 create-rule `
            --listener-arn $ListenerArn `
            --priority $rule.Priority `
            --conditions "Field=host-header,Values=$($rule.Host)" `
            --actions "Type=forward,TargetGroupArn=$tgArn" `
            --region $REGION | Out-Null

        Write-Success "  Rule creada: Priority $($rule.Priority)"
    }
}

# ============================================================================
# PASO 5: Actualizar Route53
# ============================================================================

function Step5-UpdateDNS {
    param($NewAlbDns)

    Write-Step "PASO 5: Instrucciones para actualizar DNS"

    Write-Warning "ACCIÓN MANUAL REQUERIDA:"
    Write-Host ""
    Write-Host "  1. Ve a Route53 -> Hosted Zones -> acontplus.com" -ForegroundColor Yellow
    Write-Host "  2. Actualiza los registros ALIAS que apuntan al ALB viejo" -ForegroundColor Yellow
    Write-Host "  3. Cambiar el target a: $NewAlbDns" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Registros a actualizar:" -ForegroundColor Cyan
    Write-Host "    - acontplus.com" -ForegroundColor White
    Write-Host "    - api.acontplus.com" -ForegroundColor White
    Write-Host "    - app.acontplus.com" -ForegroundColor White
    Write-Host "    - admin.acontplus.com" -ForegroundColor White
    Write-Host "    - client.acontplus.com" -ForegroundColor White
    Write-Host "    - restaurant.acontplus.com" -ForegroundColor White
    Write-Host "    - documentos.acontplus.com" -ForegroundColor White
    Write-Host ""
}

# ============================================================================
# PASO 6: Eliminar ALB viejo y liberar EIPs
# ============================================================================

function Step6-CleanupOldResources {
    Write-Step "PASO 6: Limpieza de recursos viejos"

    Write-Warning "Este paso eliminará el ALB viejo y liberará las EIPs."
    Write-Warning "Solo ejecutar DESPUÉS de verificar que el nuevo ALB funciona!"

    $confirm = Read-Host "¿Desea continuar? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Info "Cancelado por el usuario."
        return
    }

    # Eliminar listeners del ALB viejo primero
    Write-Info "Eliminando listeners del ALB viejo..."
    $oldListeners = aws elbv2 describe-listeners --load-balancer-arn $ALB_CONFIG.OldArn --region $REGION | ConvertFrom-Json
    foreach ($listener in $oldListeners.Listeners) {
        aws elbv2 delete-listener --listener-arn $listener.ListenerArn --region $REGION
        Write-Success "  Listener eliminado: $($listener.Port)"
    }

    # Eliminar ALB viejo
    Write-Info "Eliminando ALB viejo..."
    aws elbv2 delete-load-balancer --load-balancer-arn $ALB_CONFIG.OldArn --region $REGION
    Write-Success "ALB eliminado!"

    # Esperar a que se elimine completamente
    Write-Info "Esperando a que el ALB se elimine completamente (puede tomar unos minutos)..."
    Start-Sleep -Seconds 60

    # Intentar liberar EIPs
    Write-Info "Intentando liberar EIPs ServiceManaged..."
    $eips = aws ec2 describe-addresses --region $REGION --query "Addresses[?ServiceManaged=='alb']" | ConvertFrom-Json
    foreach ($eip in $eips) {
        Write-Info "  Liberando $($eip.PublicIp)..."
        try {
            aws ec2 release-address --allocation-id $eip.AllocationId --region $REGION 2>$null
            Write-Success "    EIP liberada!"
        } catch {
            Write-Warning "    No se pudo liberar automáticamente. AWS la liberará después."
        }
    }

    # Eliminar ENIs huérfanas
    Write-Info "Buscando ENIs huérfanas del ALB..."
    $enis = aws ec2 describe-network-interfaces --filters "Name=description,Values=ELB app/acontplus-erp/*" --region $REGION | ConvertFrom-Json
    foreach ($eni in $enis.NetworkInterfaces) {
        if ($eni.Status -eq "available") {
            Write-Info "  Eliminando ENI $($eni.NetworkInterfaceId)..."
            aws ec2 delete-network-interface --network-interface-id $eni.NetworkInterfaceId --region $REGION
            Write-Success "    ENI eliminada!"
        }
    }
}

# ============================================================================
# MENÚ PRINCIPAL
# ============================================================================

function Show-Menu {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║     ALB Migration Script - Remove Static EIPs                  ║" -ForegroundColor Cyan
    Write-Host "╠════════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
    Write-Host "║  1. Verificar estado actual                                    ║" -ForegroundColor White
    Write-Host "║  2. Ejecutar migración completa (Pasos 2-4)                    ║" -ForegroundColor White
    Write-Host "║  3. Mostrar instrucciones DNS (Paso 5)                         ║" -ForegroundColor White
    Write-Host "║  4. Limpiar recursos viejos (Paso 6) - ¡CUIDADO!              ║" -ForegroundColor Yellow
    Write-Host "║  5. Ver configuración actual                                   ║" -ForegroundColor White
    Write-Host "║  Q. Salir                                                      ║" -ForegroundColor White
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Show-CurrentConfig {
    Write-Step "CONFIGURACIÓN ACTUAL"
    Write-Host ""
    Write-Host "ALB Viejo:" -ForegroundColor Yellow
    Write-Host "  Name: $($ALB_CONFIG.OldName)"
    Write-Host "  ARN: $($ALB_CONFIG.OldArn)"
    Write-Host ""
    Write-Host "Subnets:" -ForegroundColor Yellow
    $ALB_CONFIG.Subnets | ForEach-Object { Write-Host "  - $_" }
    Write-Host ""
    Write-Host "Security Groups:" -ForegroundColor Yellow
    $ALB_CONFIG.SecurityGroups | ForEach-Object { Write-Host "  - $_" }
    Write-Host ""
    Write-Host "Listener Rules:" -ForegroundColor Yellow
    $LISTENER_RULES | ForEach-Object { Write-Host "  Priority $($_.Priority): $($_.Host) -> $($_.TargetGroup)" }
}

# Main
Write-Host ""
Write-Host "🚀 ALB Migration Script - Remove Static EIPs" -ForegroundColor Cyan
Write-Host "   Ahorro estimado: ~" -NoNewline; Write-Host '$11/mes' -ForegroundColor Green
Write-Host ""

while ($true) {
    Show-Menu
    $choice = Read-Host "Seleccione una opción"

    switch ($choice) {
        "1" { Step1-VerifyCurrentState }
        "2" {
            Write-Warning "ADVERTENCIA: Esto creará un nuevo ALB."
            Write-Warning "El sitio tendrá ~2-5 minutos de inactividad durante el cambio de DNS."
            $confirm = Read-Host "¿Continuar? (yes/no)"
            if ($confirm -eq "yes") {
                $newAlb = Step2-CreateNewALB
                if ($newAlb) {
                    $listenerArn = Step3-CreateListeners -NewAlbArn $newAlb.Arn
                    if ($listenerArn) {
                        Step4-CreateRules -ListenerArn $listenerArn
                        Step5-UpdateDNS -NewAlbDns $newAlb.Dns

                        Write-Host ""
                        Write-Success "Nuevo ALB creado exitosamente!"
                        Write-Host ""
                        Write-Host "NUEVO ALB DNS: $($newAlb.Dns)" -ForegroundColor Green
                        Write-Host ""
                        Write-Warning "PRÓXIMOS PASOS:"
                        Write-Host "  1. Actualiza Route53 para apuntar al nuevo DNS" -ForegroundColor Yellow
                        Write-Host "  2. Verifica que todo funcione correctamente" -ForegroundColor Yellow
                        Write-Host "  3. Ejecuta la opción 4 para limpiar el ALB viejo" -ForegroundColor Yellow
                    }
                }
            }
        }
        "3" { Step5-UpdateDNS -NewAlbDns "(ejecuta migración primero)" }
        "4" { Step6-CleanupOldResources }
        "5" { Show-CurrentConfig }
        "Q" { break }
        "q" { break }
        default { Write-Host "Opción no válida" -ForegroundColor Red }
    }
}

Write-Host ""
Write-Host "Script finalizado." -ForegroundColor Gray
