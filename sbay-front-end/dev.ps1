$root = $PSScriptRoot
$frontend = Join-Path $root "ptv-frontend\frontend"
$backend  = Join-Path $root "ptv-backend\backend"

Write-Host "Starting PTV dev servers..." -ForegroundColor Cyan

$f = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontend'; npm run dev" -PassThru
$b = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backend'; npm run dev" -PassThru

Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "Close both windows or press Ctrl+C to stop." -ForegroundColor Yellow

$f.WaitForExit()
