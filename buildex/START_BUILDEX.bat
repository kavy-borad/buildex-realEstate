@echo off
echo.
echo ========================================
echo    BUILDEX - Starting All Servers
echo ========================================
echo.
echo Starting Backend Server (Port 5000)...
echo Starting Frontend Server (Port 8080)...
echo.
echo ========================================
echo.

cd /d "%~dp0"

start "Buildex Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Buildex Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo   Backend: http://localhost:5000
echo   Frontend: http://localhost:8080
echo ========================================
echo.
echo Login Credentials:
echo   Email: admin@buildex.com
echo   Password: admin123
echo.
echo Press any key to open the app in browser...
pause >nul

start http://localhost:8080

echo.
echo All servers are running!
echo Keep the server windows open while using the app.
echo Close this window anytime - servers will keep running.
echo.
pause
