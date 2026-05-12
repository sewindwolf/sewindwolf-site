# 第29天暮色推送 · 6张图并行提交
$ErrorActionPreference = "Continue"
$officialKey = "sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp"
$submitUrl = "https://nanobananapro.cloud/api/v1/image/nano-banana"

$refs = @{
  fengya  = "https://sewindwolf.art/images/refs/fengya_ref.png"
  tilion  = "https://sewindwolf.art/images/refs/tilion_ref.png"
  foxlanz = "https://sewindwolf.art/images/refs/foxlanz_ref.png"
  yufeng  = "https://sewindwolf.art/images/refs/yufeng_ref.png"
  aki     = "https://sewindwolf.art/images/refs/aki_ref.png"
  wolvol  = "https://sewindwolf.art/images/refs/wolvol_ref.png"
}

$tasks = @(
  @{ name="tilion"; mainRef=$refs.tilion; extraRefs=@($refs.fengya,$refs.yufeng,$refs.foxlanz); promptFile="C:\Users\Administrator\sewindwolf-site\tmp_prompt_tilion.txt" },
  @{ name="fengya"; mainRef=$refs.fengya; extraRefs=@(); promptFile="C:\Users\Administrator\sewindwolf-site\tmp_prompt_fengya.txt" },
  @{ name="yufeng"; mainRef=$refs.yufeng; extraRefs=@(); promptFile="C:\Users\Administrator\sewindwolf-site\tmp_prompt_yufeng.txt" },
  @{ name="foxlanz"; mainRef=$refs.foxlanz; extraRefs=@(); promptFile="C:\Users\Administrator\sewindwolf-site\tmp_prompt_foxlanz.txt" },
  @{ name="aki"; mainRef=$refs.aki; extraRefs=@(); promptFile="C:\Users\Administrator\sewindwolf-site\tmp_prompt_aki.txt" },
  @{ name="wolvol"; mainRef=$refs.wolvol; extraRefs=@(); promptFile="C:\Users\Administrator\sewindwolf-site\tmp_prompt_wolvol.txt" }
)

$taskIds = @{}
foreach ($t in $tasks) {
  Write-Host "=== 提交: $($t.name) ==="
  $prompt = Get-Content -Path $t.promptFile -Raw -Encoding UTF8
  $submitted = $false
  for ($retry = 1; $retry -le 3 -and -not $submitted; $retry++) {
    try {
      $boundary = [System.Guid]::NewGuid().ToString()
      $ct = "multipart/form-data; boundary=$boundary"
      $bodyLines = @(
        "--$boundary", 'Content-Disposition: form-data; name="prompt"', "", $prompt,
        "--$boundary", 'Content-Disposition: form-data; name="model"', "", "nano-banana-pro",
        "--$boundary", 'Content-Disposition: form-data; name="mode"', "", "image-to-image",
        "--$boundary", 'Content-Disposition: form-data; name="aspectRatio"', "", "16:9",
        "--$boundary", 'Content-Disposition: form-data; name="imageSize"', "", "1K",
        "--$boundary", 'Content-Disposition: form-data; name="imageUrl"', "", $t.mainRef
      )
      foreach ($extra in $t.extraRefs) {
        $bodyLines += @("--$boundary", 'Content-Disposition: form-data; name="imageUrl"', "", $extra)
      }
      $bodyLines += "--$boundary--"
      $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes(($bodyLines -join "`r`n"))
      $resp = Invoke-RestMethod -Uri $submitUrl -Method POST -Headers @{"Authorization"="Bearer $officialKey"} -Body $bodyBytes -ContentType $ct -TimeoutSec 45
      $taskIds[$t.name] = $resp.data.id
      Write-Host "  taskId: $($resp.data.id)"
      $submitted = $true
    } catch {
      Write-Host "  提交失败(第$retry次): $($_.Exception.Message)"
      if ($retry -lt 3) { Start-Sleep -Seconds 5 }
    }
  }
  if (-not $submitted) { $taskIds[$t.name] = $null }
  Start-Sleep -Milliseconds 500
}

$taskIds | ConvertTo-Json | Out-File -FilePath "C:\Users\Administrator\sewindwolf-site\d29_eve_taskids.json" -Encoding utf8
Write-Host "=== 已保存 taskIds ==="
$taskIds
