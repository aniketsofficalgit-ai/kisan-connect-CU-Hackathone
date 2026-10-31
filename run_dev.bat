@echo off
echo ========================================================
echo  Starting Kisan Connect - Smart Agricultural Waste Platform
echo  Team: CLOVER GUARDIAN (Prakhar, Ayush, Raj, Aniket Dubey)
echo ========================================================

start "Kisan Connect Backend" cmd /k "cd backend && .\venv\Scripts\activate && python run.py"
timeout /t 3 /nobreak >nul
start "Kisan Connect Frontend" cmd /k "cd frontend && npm run dev"

echo Kisan Connect launched!
echo Frontend: http://localhost:5173
echo Backend API: http://127.0.0.1:5000
