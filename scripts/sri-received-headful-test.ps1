$ErrorActionPreference = 'Stop'

$uri = 'https://localhost:7120/api/sri/documents/received'

$bodyObj = @{
  username = '1105246605001'
  password = '@09IfJf0618'
  additionalCi = '1105246605'
  year = 2025
  month = 12
  day = 0
  documentType = 1
  recaptchaToken = $null
  cookies = $null
  useBrowserAutomation = $true
  browserAutomationHeadless = $false
  browserAutomationTimeoutSeconds = 300
  useRecaptchaSolver = $true
  captureRecaptchaValues = $true
}

$body = $bodyObj | ConvertTo-Json -Depth 10

Write-Host "POST $uri" -ForegroundColor Cyan
Write-Host "Launching Playwright headful Chromium..." -ForegroundColor Yellow

$sw = [Diagnostics.Stopwatch]::StartNew()
try {
  $resp = Invoke-RestMethod -SkipCertificateCheck -Method Post -Uri $uri -ContentType 'application/json' -Body $body -TimeoutSec 420
  $sw.Stop()
  Write-Host ("Elapsed: " + $sw.Elapsed.ToString()) -ForegroundColor Green
  $resp | ConvertTo-Json -Depth 30
}
catch {
  $sw.Stop()
  Write-Host ("Elapsed: " + $sw.Elapsed.ToString()) -ForegroundColor DarkYellow
  Write-Host 'ERROR' -ForegroundColor Red
  Write-Host $_.Exception.Message
  if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message }
  throw
}
