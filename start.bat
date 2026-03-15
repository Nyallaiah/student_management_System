@echo off
echo ========================================
echo Student Record System - Starting Up
echo ========================================
echo.

REM Check if MongoDB is running (Windows)
echo [1/3] Checking MongoDB status...
timeout /t 2 /nobreak >nul

REM Start MongoDB if not running (assuming it's installed as a service)
sc query MongoDB | findstr STATE | findstr RUNNING >nul
if %errorlevel% neq 0 (
    echo MongoDB is not running. Please start MongoDB first.
    echo Run: net start MongoDB
    echo Or start MongoDB Compass or MongoDB Community Server
    echo.
    pause
    exit /b 1
)
echo MongoDB is running ✓
echo.

REM Install backend dependencies if needed
echo [2/3] Checking backend dependencies...
if not exist "backend\venv" (
    echo Creating virtual environment...
    python -m venv backend\venv
)

echo Activating virtual environment...
call backend\venv\Scripts\activate.bat

echo Installing Flask dependencies...
pip install -q -r backend\requirement

echo Starting Flask Backend on port 5000...
start "Flask Backend" cmd /k "cd backend && python app.py"

REM Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start frontend
echo [3/3] Starting Frontend (Vite) on port 5173...
start "Vite Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo System is starting up!
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:5173
echo.
echo Default login credentials:
echo   Admin: admin@gmail.com / admin123
echo   Student: student@gmail.com / student123
echo ========================================
pause

