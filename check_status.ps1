$base = 'C:\Users\Administrator\sewindwolf-site'
$tags = @('fengya','yufeng','tilion','foxlanz','aki','wolvol')
Write-Host '--- task_* (taskIds) ---'
foreach ($t in $tags) {
    $f = Join-Path $base ('task_'+$t+'.txt')
    if (Test-Path $f) {
        $v = ([IO.File]::ReadAllText($f)).Trim()
        Write-Host ($t + ': ' + $v)
    } else {
        Write-Host ($t + ': <no file>')
    }
}
Write-Host '--- url_* (result urls) ---'
foreach ($t in $tags) {
    $f = Join-Path $base ('url_'+$t+'.txt')
    if (Test-Path $f) {
        $v = ([IO.File]::ReadAllText($f)).Trim()
        if ($v) { Write-Host ($t + ': ' + $v) } else { Write-Host ($t + ': <empty>') }
    } else {
        Write-Host ($t + ': <no file>')
    }
}
