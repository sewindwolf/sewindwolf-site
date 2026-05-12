# Poll a taskId until done, output image URL to file
param(
    [Parameter(Mandatory=$true)][string]$TaskIdFile,
    [Parameter(Mandatory=$true)][string]$OutFile,
    [string]$Tag = "",
    [int]$MaxPoll = 40
)

$officialKey = "sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp"
$pollUrl = "https://nanobananapro.cloud/api/v1/image/nano-banana/result"

$taskId = ([IO.File]::ReadAllText($TaskIdFile)).Trim()
if (-not $taskId) {
    Write-Host "[$Tag] empty taskId"
    [IO.File]::WriteAllText($OutFile, "")
    exit 1
}
Write-Host "[$Tag] polling taskId=$taskId"

for ($j = 1; $j -le $MaxPoll; $j++) {
    Start-Sleep -Seconds 5
    try {
        $body = @{taskId=$taskId} | ConvertTo-Json -Compress
        $resp = Invoke-RestMethod -Uri $pollUrl -Method POST -Headers @{"Authorization"="Bearer $officialKey"; "Content-Type"="application/json"} -Body $body -TimeoutSec 15
        $status = $resp.data.status
        if ($j % 4 -eq 0) { Write-Host "[$Tag] poll $j: status=$status" }
        if ($status -eq "succeeded") {
            $url = $resp.data.results[0].url
            Write-Host "[$Tag] SUCCESS $url"
            [IO.File]::WriteAllText($OutFile, $url)
            exit 0
        }
        if ($status -eq "failed") {
            Write-Host "[$Tag] FAILED task failed"
            [IO.File]::WriteAllText($OutFile, "")
            exit 1
        }
    } catch {
        Write-Host "[$Tag] poll error: $($_.Exception.Message)"
    }
}
Write-Host "[$Tag] TIMEOUT"
[IO.File]::WriteAllText($OutFile, "")
exit 1
