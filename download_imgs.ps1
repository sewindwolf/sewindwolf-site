# Download all 6 generated images locally for inspection
$base = 'C:\Users\Administrator\sewindwolf-site'
$tags = @('fengya','yufeng','tilion','foxlanz','aki','wolvol')
$outDir = Join-Path $base 'd32_morning_imgs'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

foreach ($t in $tags) {
    $urlFile = Join-Path $base ('url_'+$t+'.txt')
    if (-not (Test-Path $urlFile)) { Write-Host ($t + ': no url file'); continue }
    $url = ([IO.File]::ReadAllText($urlFile)).Trim()
    if (-not $url) { Write-Host ($t + ': empty url'); continue }
    $outPath = Join-Path $outDir ($t + '.png')
    try {
        Invoke-WebRequest -Uri $url -OutFile $outPath -TimeoutSec 60
        $size = (Get-Item $outPath).Length
        $hash = (Get-FileHash -Algorithm MD5 $outPath).Hash
        Write-Host ($t + ' | ' + $size + ' bytes | MD5=' + $hash.Substring(0,12))
    } catch {
        Write-Host ($t + ': download failed ' + $_.Exception.Message)
    }
}
Write-Host '--- Listing ---'
Get-ChildItem $outDir | Select-Object Name, Length
