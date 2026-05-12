# Orchestrator: submit all 6 gen tasks in parallel, then poll all
$base = 'C:\Users\Administrator\sewindwolf-site'
$chars = @(
    @{tag='fengya'; prompt='p_fengya.txt'; refs=@('https://sewindwolf.art/images/refs/fengya_ref.png')},
    @{tag='yufeng'; prompt='p_yufeng.txt'; refs=@('https://sewindwolf.art/images/refs/yufeng_ref.png')},
    @{tag='tilion'; prompt='p_tilion.txt'; refs=@('https://sewindwolf.art/images/refs/tilion_ref.png')},
    @{tag='foxlanz'; prompt='p_foxlanz.txt'; refs=@('https://sewindwolf.art/images/refs/foxlanz_ref.png')},
    @{tag='aki'; prompt='p_aki.txt'; refs=@('https://sewindwolf.art/images/refs/aki_ref.png')},
    @{tag='wolvol'; prompt='p_wolvol.txt'; refs=@('https://sewindwolf.art/images/refs/wolvol_ref.png')}
)

# Phase 1: Submit all
Write-Host '=== Phase 1: Submit all 6 tasks ===' -ForegroundColor Cyan
$submitJobs = @()
foreach ($c in $chars) {
    $tag = $c.tag
    $prompt = $c.prompt
    $refs = $c.refs
    $submitJobs += Start-Job -Name "sub_$tag" -ArgumentList $base, $prompt, $tag, $refs -ScriptBlock {
        param($b, $p, $tag, $refs)
        & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $b 'submit_only.ps1') -PromptFile (Join-Path $b $p) -RefUrls $refs -TaskIdFile (Join-Path $b ("task_"+$tag+".txt")) -Tag $tag
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
Write-Host ('Polling ' + $pollJobs.Count + ' jobs, up to 200s each...')
$pollJobs | Wait-Job -Timeout 240 | Out-Null
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
