Start-Process -FilePath 'powershell.exe' -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','C:\Users\Administrator\sewindwolf-site\submit_all_detached.ps1' -WindowStyle Hidden
Write-Host 'Launcher spawned'
