# Launch 6 submit jobs as detached background processes, don't wait
$base = 'C:\Users\Administrator\sewindwolf-site'
$chars = @(
    @{tag='fengya'; prompt='p_fengya.txt'; refs=@('https://sewindwolf.art/images/refs/fengya_ref.png')},
    @{tag='yufeng'; prompt='p_yufeng.txt'; refs=@('https://sewindwolf.art/images/refs/yufeng_ref.png')},
    @{tag='tilion'; prompt='p_tilion.txt'; refs=@('https://sewindwolf.art/images/refs/tilion_ref.png')},
    @{tag='foxlanz'; prompt='p_foxlanz.txt'; refs=@('https://sewindwolf.art/images/refs/foxlanz_ref.png')},
    @{tag='aki'; prompt='p_aki.txt'; refs=@('https://sewindwolf.art/images/refs/aki_ref.png')},
    @{tag='wolvol'; prompt='p_wolvol.txt'; refs=@('https://sewindwolf.art/images/refs/wolvol_ref.png')}
)

foreach ($c in $chars) {
    $tag = $c.tag
    $prompt = $c.prompt
    $refs = $c.refs
    $refsQuoted = ($refs | ForEach-Object { "'$_'" }) -join ','
    $logFile = Join-Path $base ("log_submit_"+$tag+".txt")
    $args = "-NoProfile -ExecutionPolicy Bypass -File `"$base\submit_only.ps1`" -PromptFile `"$base\$prompt`" -RefUrls @($refsQuoted) -TaskIdFile `"$base\task_$tag.txt`" -Tag $tag"
    $p = Start-Process -FilePath 'powershell.exe' -ArgumentList $args -RedirectStandardOutput $logFile -RedirectStandardError (Join-Path $base ("logerr_submit_"+$tag+".txt")) -NoNewWindow -PassThru
    Write-Host ("Launched submit for " + $tag + ", PID=" + $p.Id)
}
Write-Host 'All submit processes launched (detached).'
