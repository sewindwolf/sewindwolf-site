# Orchestrator for Day 32 NOON push (六人地下海穹顶汇合)
# Each character scene has customized reference image list
$base = 'C:\Users\Administrator\sewindwolf-site'

$fengya_ref  = 'https://sewindwolf.art/images/refs/fengya_ref.png'
$yufeng_ref  = 'https://sewindwolf.art/images/refs/yufeng_ref.png'
$tilion_ref  = 'https://sewindwolf.art/images/refs/tilion_ref.png'
$foxlanz_ref = 'https://sewindwolf.art/images/refs/foxlanz_ref.png'
$aki_ref     = 'https://sewindwolf.art/images/refs/aki_ref.png'
$wolvol_ref  = 'https://sewindwolf.art/images/refs/wolvol_ref.png'

$chars = @(
    @{tag='fengya';  prompt='p_fengya.txt';  refs=@($fengya_ref)},
    @{tag='yufeng';  prompt='p_yufeng.txt';  refs=@($yufeng_ref, $tilion_ref, $foxlanz_ref)},
    @{tag='tilion';  prompt='p_tilion.txt';  refs=@($tilion_ref, $fengya_ref, $yufeng_ref, $wolvol_ref)},
    @{tag='foxlanz'; prompt='p_foxlanz.txt'; refs=@($foxlanz_ref)},
    @{tag='aki';     prompt='p_aki.txt';     refs=@($aki_ref, $wolvol_ref)},
    @{tag='wolvol';  prompt='p_wolvol.txt';  refs=@($wolvol_ref, $fengya_ref, $yufeng_ref, $tilion_ref, $foxlanz_ref, $aki_ref)}
)

# Phase 1: Submit all
Write-Host '=== Phase 1: Submit all 6 tasks (D32 NOON) ===' -ForegroundColor Cyan
$submitJobs = @()
foreach ($c in $chars) {
    $tag = $c.tag
    $prompt = $c.prompt
    $refs = $c.refs
    $submitJobs += Start-Job -Name "sub_$tag" -ArgumentList $base, $prompt, $tag, (,$refs) -ScriptBlock {
        param($b, $p, $tag, $refs)
        $refsArr = [string[]]$refs
        & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $b 'submit_only.ps1') -PromptFile (Join-Path $b $p) -RefUrls ([string[]]$refsArr) -TaskIdFile (Join-Path $b ("task_"+$tag+".txt")) -Tag $tag
    }
}
Write-Host ('Submitted ' + $submitJobs.Count + ' jobs, waiting for completion...')
$submitJobs | Wait-Job -Timeout 120 | Out-Null
foreach ($j in $submitJobs) {
    Write-Host ("--- " + $j.Name + " ---") -ForegroundColor Yellow
    Receive-Job -Job $j
}
$submitJobs | Remove-Job -Force

# Phase 2: Poll all in parallel
Write-Host '=== Phase 2: Poll all 6 tasks ===' -ForegroundColor Cyan
$pollJobs = @()
foreach ($c in $chars) {
    $tag = $c.tag
    $pollJobs += Start-Job -Name "poll_$tag" -ArgumentList $base, $tag -ScriptBlock {
        param($b, $tag)
        & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $b 'poll_only.ps1') -TaskIdFile (Join-Path $b ("task_"+$tag+".txt")) -OutFile (Join-Path $b ("url_"+$tag+".txt")) -Tag $tag -MaxPoll 40
    }
}
Write-Host ('Polling ' + $pollJobs.Count + ' jobs, up to 240s each...')
$pollJobs | Wait-Job -Timeout 300 | Out-Null
foreach ($j in $pollJobs) {
    Write-Host ("--- " + $j.Name + " ---") -ForegroundColor Yellow
    Receive-Job -Job $j
}
$pollJobs | Remove-Job -Force

# Print final URLs
Write-Host '=== Final URLs ===' -ForegroundColor Green
foreach ($c in $chars) {
    $tag = $c.tag
    $urlFile = Join-Path $base ("url_"+$tag+".txt")
    if (Test-Path $urlFile) {
        $u = ([IO.File]::ReadAllText($urlFile)).Trim()
        Write-Host ($tag + ': ' + $u)
    } else {
        Write-Host ($tag + ': <NO FILE>')
    }
}
