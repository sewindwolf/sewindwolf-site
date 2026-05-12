$ErrorActionPreference = "Continue"
$officialKey = "sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp"
$pollUrl = "https://nanobananapro.cloud/api/v1/image/nano-banana/result"

$taskIds = @{
  tilion  = "3-b94a8710-71ed-4237-855f-29dd8f14063f"
  fengya  = "16-cbb78ae0-4d4f-417f-8534-670e07397577"
  yufeng  = "7-e80ef25e-040f-4f1f-afc6-b37974fafd74"
  foxlanz = "2-5f2d5c8c-b255-495d-8b49-c86739a88b60"
  aki     = "13-bef1e949-f241-4ef5-95d5-59a399956490"
  wolvol  = "16-33dc56b0-52a4-4f8b-ac17-0e59ba8c890e"
}

$results = @{}
$pending = @($taskIds.Keys)

Write-Host "=== 开始轮询（最长等待180秒） ==="
for ($round = 1; $round -le 36 -and $pending.Count -gt 0; $round++) {
  Start-Sleep -Seconds 5
  Write-Host "--- 第 $round 轮 (剩余 $($pending.Count)) ---"
  $stillPending = @()
  foreach ($name in $pending) {
    $tid = $taskIds[$name]
    try {
      $body = @{taskId=$tid} | ConvertTo-Json -Compress
      $resp = Invoke-RestMethod -Uri $pollUrl -Method POST -Headers @{"Authorization"="Bearer $officialKey"; "Content-Type"="application/json"} -Body $body -TimeoutSec 15
      $status = $resp.data.status
      if ($status -eq "succeeded") {
        $url = $resp.data.results[0].url
        $results[$name] = $url
        Write-Host "  [OK] $name => $url"
      } elseif ($status -eq "failed") {
        $results[$name] = $null
        Write-Host "  [FAIL] $name"
      } else {
        $stillPending += $name
      }
    } catch {
      $stillPending += $name
    }
  }
  $pending = $stillPending
}

foreach ($name in $pending) { $results[$name] = $null }

$results | ConvertTo-Json | Out-File -FilePath "C:\Users\Administrator\sewindwolf-site\d29_eve_results.json" -Encoding utf8
Write-Host "=== 最终结果 ==="
$results
