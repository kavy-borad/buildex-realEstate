@echo off
echo ========================================
echo    Stopping BuildEx Project
echo ========================================
echo.

echo Stopping all Node.js processes...
taskkill /F /FI "WINDOWTITLE eq BuildEx Backend*" 2>nul
taskkill /F /FI "WINDOWTITLE eq BuildEx Frontend*" 2>nul

echo.
echo ✓ BuildEx Stopped
echo.
pause
