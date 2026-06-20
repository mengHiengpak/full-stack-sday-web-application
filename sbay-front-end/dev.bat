@echo off
start "PTV Frontend" cmd /c "cd /d "%~dp0ptv-frontend\frontend" && npm run dev"
start "PTV Backend" cmd /c "cd /d "%~dp0ptv-backend\backend" && npm run dev"
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
pause
