@echo off
echo ========================================
echo    Starting BuildEx Project
echo ========================================
echo.

:: Check if MongoDB is running
echo [1/3] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MongoDB is running
) else (
    echo ✗ MongoDB is NOT running!
    echo Please start MongoDB first.
    pause
    exit /b 1
)

echo.
echo [2/3] Starting Backend Server (Port 5000)...
start "BuildEx Backend" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Starting Frontend Server (Port 8080)...
start "BuildEx Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo ✓ BuildEx Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:8080
echo.
echo Press any key to exit this window...
pause >nul
