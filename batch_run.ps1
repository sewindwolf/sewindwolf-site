# Run all 6 submissions and polls serially inside ONE background process
$base = 'C:\Users\Administrator\sewindwolf-site'
$chars = @(
    @{tag='fengya'; prompt='p_fengya.txt'; ref='https://sewindwolf.art/images/refs/fengya_ref.png'},
    @{tag='yufeng'; prompt='p_yufeng.txt'; ref='https://sewindwolf.art/images/refs/yufeng_ref.png'},
    @{tag='tilion'; prompt='p_tilion.txt'; ref='https://sewindwolf.art/images/refs/tilion_ref.png'},
    @{tag='foxlanz'; prompt='p_foxlanz.txt'; ref='https://sewindwolf.art/images/refs/foxlanz_ref.png'},
    @{tag='aki'; prompt='p_aki.txt'; ref='https://sewindwolf.art/images/refs/aki_ref.png'},
    @{tag='wolvol'; prompt='p_wolvol.txt'; ref='https://sewindwolf.art/images/refs/wolvol_ref.png'}
)

$officialKey = "sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp"
$submitUrl = "https://nanobananapro.cloud/api/v1/image/nano-banana"
$pollUrl = "https://nanobananapro.cloud/api/v1/image/nano-banana/result"

$logFile = Join-Path $base 'batch_run.log'
function Write-Log($msg) {
    $ts = Get-Date -Format 'HH:mm:ss'
    $line = "[$ts] $msg"
    Write-Host $line
    Add-Content -Path $logFile -Value $line
}

Set-Content -Path $logFile -Value ("=== Batch run started at " + (Get-Date) + " ===")

# Phase 1: Submit all
$taskIds = @{}
foreach ($c in $chars) {
    $tag = $c.tag
    $prompt = [IO.File]::ReadAllText((Join-Path $base $c.prompt))
    $refUrl = $c.ref
    Write-Log ("[$tag] Submitting, prompt len=" + $prompt.Length)
    $ok = $false
    for ($i = 1; $i -le 3; $i++) {
        try {
            $boundary = [System.Guid]::NewGuid().ToString()
            $ct = "multipart/form-data; boundary=$boundary"
            $parts = @()
            $parts += "--$boundary"
            $parts += 'Content-Disposition: form-data; name="prompt"'
            $parts += ""
            $parts += $prompt
            $parts += "--$boundary"
            $parts += 'Content-Disposition: form-data; name="model"'
            $parts += ""
            $parts += "nano-banana-pro"
            $parts += "--$boundary"
            $parts += 'Content-Disposition: form-data; name="mode"'
            $parts += ""
            $parts += "image-to-image"
            $parts += "--$boundary"
            $parts += 'Content-Disposition: form-data; name="aspectRatio"'
            $parts += ""
            $parts += "16:9"
            $parts += "--$boundary"
            $parts += 'Content-Disposition: form-data; name="imageSize"'
            $parts += ""
            $parts += "1K"
            $parts += "--$boundary"
            $parts += 'Content-Disposition: form-data; name="imageUrl"'
            $parts += ""
            $parts += $refUrl
            $parts += "--$boundary--"
            $bodyStr = ($parts -join "`r`n")
            $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($bodyStr)
            $resp = Invoke-RestMethod -Uri $submitUrl -Method POST -Headers @{"Authorization"="Bearer $officialKey"} -Body $bodyBytes -ContentType $ct -TimeoutSec 45
            $tid = $resp.data.id
            $taskIds[$tag] = $tid
            [IO.File]::WriteAllText((Join-Path $base ("task_"+$tag+".txt")), $tid)
            Write-Log ("[$tag] OK taskId=" + $tid)
            $ok = $true
            break
        } catch {
            Write-Log ("[$tag] submit attempt " + $i + " failed: " + $_.Exception.Message)
            if ($i -lt 3) { Start-Sleep -Seconds 5 }
        }
    }
    if (-not $ok) {
        $taskIds[$tag] = ""
        Write-Log ("[$tag] SUBMIT FAILED after 3 retries")
    }
    Start-Sleep -Seconds 2
}

# Phase 2: Poll all (sequentially, but each poll is fast; in practice all 6 are being generated in parallel on server)
$urls = @{}
foreach ($c in $chars) {
    $tag = $c.tag
    $tid = $taskIds[$tag]
    if (-not $tid) {
        $urls[$tag] = ""
        [IO.File]::WriteAllText((Join-Path $base ("url_"+$tag+".txt")), "")
        continue
    }
    Write-Log ("[$tag] Polling taskId=" + $tid)
    $u = $null
    for ($j = 1; $j -le 36; $j++) {
        Start-Sleep -Seconds 5
        try {
            $body = @{taskId=$tid} | ConvertTo-Json -Compress
            $resp = Invoke-RestMethod -Uri $pollUrl -Method POST -Headers @{"Authorization"="Bearer $officialKey"; "Content-Type"="application/json"} -Body $body -TimeoutSec 15
            $status = $resp.data.status
            if ($j % 3 -eq 0) { Write-Log ("[$tag] poll " + $j + ": " + $status) }
            if ($status -eq "succeeded") {
                $u = $resp.data.results[0].url
                Write-Log ("[$tag] SUCCESS " + $u)
                break
            }
            if ($status -eq "failed") {
                Write-Log ("[$tag] task failed")
                break
            }
        } catch {
            Write-Log ("[$tag] poll error: " + $_.Exception.Message)
        }
    }
    if ($u) {
        $urls[$tag] = $u
        [IO.File]::WriteAllText((Join-Path $base ("url_"+$tag+".txt")), $u)
    } else {
        $urls[$tag] = ""
        [IO.File]::WriteAllText((Join-Path $base ("url_"+$tag+".txt")), "")
        Write-Log ("[$tag] POLL TIMEOUT")
    }
}

Write-Log "=== All done ==="
[IO.File]::WriteAllText((Join-Path $base 'batch_done.flag'), (Get-Date).ToString('o'))
