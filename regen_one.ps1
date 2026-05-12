# Regenerate single char in background
param(
    [string]$Tag = 'wolvol',
    [string]$RefUrl = 'https://sewindwolf.art/images/refs/wolvol_ref.png'
)
$base = 'C:\Users\Administrator\sewindwolf-site'
$officialKey = "sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp"
$submitUrl = "https://nanobananapro.cloud/api/v1/image/nano-banana"
$pollUrl = "https://nanobananapro.cloud/api/v1/image/nano-banana/result"
$logFile = Join-Path $base ("regen_"+$Tag+".log")
function Log($m) { $t=Get-Date -Format HH:mm:ss; $l="[$t] $m"; Write-Host $l; Add-Content $logFile $l }

Set-Content $logFile ("=== Regen "+$Tag+" start ===")

$prompt = [IO.File]::ReadAllText((Join-Path $base ('p_'+$Tag+'.txt')))
Log ("prompt len=" + $prompt.Length)

$tid = $null
for ($i=1; $i -le 3; $i++) {
    try {
        $b = [System.Guid]::NewGuid().ToString()
        $ct = "multipart/form-data; boundary=$b"
        $p = @()
        $p += "--$b"; $p += 'Content-Disposition: form-data; name="prompt"'; $p += ""; $p += $prompt
        $p += "--$b"; $p += 'Content-Disposition: form-data; name="model"'; $p += ""; $p += "nano-banana-pro"
        $p += "--$b"; $p += 'Content-Disposition: form-data; name="mode"'; $p += ""; $p += "image-to-image"
        $p += "--$b"; $p += 'Content-Disposition: form-data; name="aspectRatio"'; $p += ""; $p += "16:9"
        $p += "--$b"; $p += 'Content-Disposition: form-data; name="imageSize"'; $p += ""; $p += "1K"
        $p += "--$b"; $p += 'Content-Disposition: form-data; name="imageUrl"'; $p += ""; $p += $RefUrl
        $p += "--$b--"
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($p -join "`r`n")
        $r = Invoke-RestMethod -Uri $submitUrl -Method POST -Headers @{"Authorization"="Bearer $officialKey"} -Body $bytes -ContentType $ct -TimeoutSec 45
        $tid = $r.data.id
        Log ("submitted tid=" + $tid)
        break
    } catch {
        Log ("submit attempt $i err: " + $_.Exception.Message)
        Start-Sleep 5
    }
}

if (-not $tid) { Log "submit failed"; exit 1 }

$u = $null
for ($j=1; $j -le 40; $j++) {
    Start-Sleep 5
    try {
        $body = @{taskId=$tid} | ConvertTo-Json -Compress
        $r = Invoke-RestMethod -Uri $pollUrl -Method POST -Headers @{"Authorization"="Bearer $officialKey"; "Content-Type"="application/json"} -Body $body -TimeoutSec 15
        if ($j % 3 -eq 0) { Log ("poll $j : " + $r.data.status) }
        if ($r.data.status -eq "succeeded") { $u = $r.data.results[0].url; Log ("SUCCESS " + $u); break }
        if ($r.data.status -eq "failed") { Log "task failed"; break }
    } catch {
        Log ("poll err: " + $_.Exception.Message)
    }
}

if ($u) {
    [IO.File]::WriteAllText((Join-Path $base ("url_"+$Tag+".txt")), $u)
    Log ("written url_"+$Tag+".txt")
}
