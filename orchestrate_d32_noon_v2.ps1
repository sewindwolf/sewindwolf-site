# D32 Noon orchestrator v2 - use Node.js to avoid PowerShell array param issues
$base = 'C:\Users\Administrator\sewindwolf-site'
Set-Location $base

# Clean old task/url files
foreach ($tag in @('fengya','yufeng','tilion','foxlanz','aki','wolvol')) {
    Remove-Item -Force -ErrorAction SilentlyContinue (Join-Path $base "task_$tag.txt")
    Remove-Item -Force -ErrorAction SilentlyContinue (Join-Path $base "url_$tag.txt")
}

$fengya_ref  = 'https://sewindwolf.art/images/refs/fengya_ref.png'
$yufeng_ref  = 'https://sewindwolf.art/images/refs/yufeng_ref.png'
$tilion_ref  = 'https://sewindwolf.art/images/refs/tilion_ref.png'
$foxlanz_ref = 'https://sewindwolf.art/images/refs/foxlanz_ref.png'
$aki_ref     = 'https://sewindwolf.art/images/refs/aki_ref.png'
$wolvol_ref  = 'https://sewindwolf.art/images/refs/wolvol_ref.png'

$tasks = @(
    @{tag='fengya';  prompt='p_fengya.txt';  refs=@($fengya_ref)},
    @{tag='yufeng';  prompt='p_yufeng.txt';  refs=@($yufeng_ref, $tilion_ref, $foxlanz_ref)},
    @{tag='tilion';  prompt='p_tilion.txt';  refs=@($tilion_ref, $fengya_ref, $yufeng_ref, $wolvol_ref)},
    @{tag='foxlanz'; prompt='p_foxlanz.txt'; refs=@($foxlanz_ref)},
    @{tag='aki';     prompt='p_aki.txt';     refs=@($aki_ref, $wolvol_ref)},
    @{tag='wolvol';  prompt='p_wolvol.txt';  refs=@($wolvol_ref, $fengya_ref, $yufeng_ref, $tilion_ref, $foxlanz_ref, $aki_ref)}
)

Write-Host '=== Phase 1: Submit all 6 in parallel via node ===' -ForegroundColor Cyan
$submitJobs = @()
foreach ($t in $tasks) {
    $tag = $t.tag
    $prompt = $t.prompt
    # Build command as single string, node supports multiple CLI args naturally
    $refsStr = ($t.refs -join ' ')
    $cmd = "node submit_noon.js $tag $prompt $refsStr"
    $submitJobs += Start-Job -Name "sub_$tag" -ArgumentList $base, $cmd -ScriptBlock {
        param($b, $c)
        Set-Location $b
        $result = Invoke-Expression $c 2>&1
        $result | Out-String
    }
}
$submitJobs | Wait-Job -Timeout 90 | Out-Null
foreach ($j in $submitJobs) {
    Write-Host ("--- " + $j.Name + " ---") -ForegroundColor Yellow
    Receive-Job -Job $j
}
$submitJobs | Remove-Job -Force

Write-Host '=== Phase 2: Poll all 6 in parallel via node ===' -ForegroundColor Cyan
$pollJobs = @()
foreach ($t in $tasks) {
    $tag = $t.tag
    $cmd = "node poll_noon.js $tag"
    $pollJobs += Start-Job -Name "poll_$tag" -ArgumentList $base, $cmd -ScriptBlock {
        param($b, $c)
        Set-Location $b
        Invoke-Expression $c 2>&1 | Out-String
    }
}
$pollJobs | Wait-Job -Timeout 280 | Out-Null
foreach ($j in $pollJobs) {
    Write-Host ("--- " + $j.Name + " ---") -ForegroundColor Yellow
    Receive-Job -Job $j
}
$pollJobs | Remove-Job -Force

Write-Host '=== Final URLs ===' -ForegroundColor Green
foreach ($t in $tasks) {
    $tag = $t.tag
    $f = Join-Path $base "url_$tag.txt"
    if (Test-Path $f) {
        $u = ([IO.File]::ReadAllText($f)).Trim()
        Write-Host ("$tag : $u")
    } else {
        Write-Host ("$tag : <NO FILE>")
    }
}
