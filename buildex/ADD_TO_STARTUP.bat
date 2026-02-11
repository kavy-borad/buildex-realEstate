@echo off
echo.
echo ========================================
echo   Adding Buildex Backend to Startup
echo ========================================
echo.

set "SCRIPT_DIR=%~dp0"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS_FILE=%STARTUP_FOLDER%\Buildex_Backend.vbs"

echo Creating startup script...

(
echo Set WshShell = CreateObject^("WScript.Shell"^)
echo WshShell.Run "cmd /c cd /d ""%SCRIPT_DIR%backend"" && npm run dev", 0, False
) > "%VBS_FILE%"

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Backend will now start automatically when Windows starts!
echo.
echo The backend server will run in the background.
echo You won't see any window, but it will be running on port 5000.
echo.
echo To remove from startup, delete this file:
echo %VBS_FILE%
echo.
echo ========================================
echo.
pause
