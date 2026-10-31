# Kisan Connect PowerShell Dev Launcher
Write-Host "Starting Kisan Connect Agricultural Waste Management Platform..." -ForegroundColor Green
Write-Host "Team: CLOVER GUARDIAN (Prakhar, Ayush, Raj, Aniket Dubey)" -ForegroundColor Yellow

# Start Flask backend in a new process
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; python run.py"

Start-Sleep -Seconds 3

# Start frontend in a new process
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Kisan Connect launched successfully!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend API: http://127.0.0.1:5000" -ForegroundColor Cyan
