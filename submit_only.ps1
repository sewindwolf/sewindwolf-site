# Submit a single nano-banana-pro task, output taskId to file
param(
    [Parameter(Mandatory=$true)][string]$PromptFile,
    [Parameter(Mandatory=$true)][string[]]$RefUrls,
    [Parameter(Mandatory=$true)][string]$TaskIdFile,
    [string]$Tag = ""
)

$officialKey = "sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp"
$submitUrl = "https://nanobananapro.cloud/api/v1/image/nano-banana"

$prompt = [IO.File]::ReadAllText($PromptFile)
Write-Host "[$Tag] prompt len=$($prompt.Length), refs=$($RefUrls.Count)"

for ($i = 1; $i -le 3; $i++) {
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
        $resp = Invoke-RestMethod -Uri $submitUrl -Method POST -Headers @{"Authorization"="Bearer $officialKey"} -Body $bodyBytes -ContentType $ct -TimeoutSec 45
        $taskId = $resp.data.id
        Write-Host "[$Tag] submitted taskId=$taskId"
        [IO.File]::WriteAllText($TaskIdFile, $taskId)
        exit 0
    } catch {
        Write-Host "[$Tag] submit attempt $i failed: $($_.Exception.Message)"
        if ($i -lt 3) { Start-Sleep -Seconds 5 }
    }
}
[IO.File]::WriteAllText($TaskIdFile, "")
exit 1
