# Generic nano-banana-pro submit+poll script
# Usage: .\submit_and_poll.ps1 -PromptFile <path> -RefUrls <url1,url2,...> -OutFile <path>
param(
    [Parameter(Mandatory=$true)][string]$PromptFile,
    [Parameter(Mandatory=$true)][string[]]$RefUrls,
    [Parameter(Mandatory=$true)][string]$OutFile,
    [string]$Tag = ""
)

$officialKey = "sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp"
$submitUrl = "https://nanobananapro.cloud/api/v1/image/nano-banana"
$pollUrl = "https://nanobananapro.cloud/api/v1/image/nano-banana/result"

$prompt = [IO.File]::ReadAllText($PromptFile)
Write-Host "[$Tag] Prompt loaded from $PromptFile ($($prompt.Length) chars)"
Write-Host "[$Tag] Ref URLs count: $($RefUrls.Count)"

$imgUrl = $null
$lastError = ""

# Stage 1: Official API, retry 3 times
for ($i = 1; $i -le 3; $i++) {
    Write-Host "[$Tag] Stage1 Attempt $i/3 - official nano-banana-pro"
    try {
        $boundary = [System.Guid]::NewGuid().ToString()
        $ct = "multipart/form-data; boundary=$boundary"
        $bodyLines = @()
        $bodyLines += "--$boundary"
        $bodyLines += 'Content-Disposition: form-data; name="prompt"'
        $bodyLines += ""
        $bodyLines += $prompt
        $bodyLines += "--$boundary"
        $bodyLines += 'Content-Disposition: form-data; name="model"'
        $bodyLines += ""
        $bodyLines += "nano-banana-pro"
        $bodyLines += "--$boundary"
        $bodyLines += 'Content-Disposition: form-data; name="mode"'
        $bodyLines += ""
        $bodyLines += "image-to-image"
        $bodyLines += "--$boundary"
        $bodyLines += 'Content-Disposition: form-data; name="aspectRatio"'
        $bodyLines += ""
        $bodyLines += "16:9"
        $bodyLines += "--$boundary"
        $bodyLines += 'Content-Disposition: form-data; name="imageSize"'
        $bodyLines += ""
        $bodyLines += "1K"
        foreach ($u in $RefUrls) {
            $bodyLines += "--$boundary"
            $bodyLines += 'Content-Disposition: form-data; name="imageUrl"'
            $bodyLines += ""
            $bodyLines += $u
        }
        $bodyLines += "--$boundary--"
        $bodyStr = ($bodyLines -join "`r`n")
        $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($bodyStr)
        $submitResp = Invoke-RestMethod -Uri $submitUrl -Method POST -Headers @{"Authorization"="Bearer $officialKey"} -Body $bodyBytes -ContentType $ct -TimeoutSec 45
        $taskId = $submitResp.data.id
        Write-Host "[$Tag] Stage1 Attempt $i: submitted, taskId=$taskId"
        # Poll up to 30 times * 5s = 150s
        for ($j = 1; $j -le 30; $j++) {
            Start-Sleep -Seconds 5
            try {
                $pollBody = @{taskId=$taskId} | ConvertTo-Json -Compress
                $pollResp = Invoke-RestMethod -Uri $pollUrl -Method POST -Headers @{"Authorization"="Bearer $officialKey"; "Content-Type"="application/json"} -Body $pollBody -TimeoutSec 15
                $status = $pollResp.data.status
                if ($j % 3 -eq 0) { Write-Host "[$Tag] Poll $j: status=$status" }
                if ($status -eq "succeeded") {
                    $imgUrl = $pollResp.data.results[0].url
                    Write-Host "[$Tag] SUCCESS url=$imgUrl"
                    break
                }
                if ($status -eq "failed") {
                    $lastError = "task failed"
                    break
                }
            } catch {
                $lastError = $_.Exception.Message
            }
        }
        if ($imgUrl) { break }
    } catch {
        $lastError = $_.Exception.Message
        Write-Host "[$Tag] Stage1 attempt $i failed: $lastError"
        if ($i -lt 3) { Start-Sleep -Seconds 10 }
    }
}

# Output
if ($imgUrl) {
    [IO.File]::WriteAllText($OutFile, $imgUrl)
    Write-Host "[$Tag] Wrote url to $OutFile"
    exit 0
} else {
    [IO.File]::WriteAllText($OutFile, "")
    Write-Host "[$Tag] FAILED. lastError=$lastError"
    exit 1
}
