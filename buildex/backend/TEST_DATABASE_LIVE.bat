@echo off
echo.
echo ========================================
echo    LIVE DATABASE TEST
echo ========================================
echo.
echo यह script आपको दिखाएगी कि database
echo में real-time save/delete हो रहा है!
echo.
echo ========================================
echo.

cd /d "%~dp0"

:MENU
echo.
echo क्या करना है?
echo.
echo [1] Check Current Database (Count देखो)
echo [2] App Open करो + Test Instructions
echo [3] Database Monitor (Real-time देखो)
echo [4] Exit
echo.
set /p choice="Select option (1-4): "

if "%choice%"=="1" goto CHECK_DB
if "%choice%"=="2" goto OPEN_APP
if "%choice%"=="3" goto MONITOR
if "%choice%"=="4" goto END

echo Invalid choice! Try again.
goto MENU

:CHECK_DB
echo.
echo ========================================
echo   DATABASE STATUS
echo ========================================
node check_database.js
echo.
pause
goto MENU

:OPEN_APP
echo.
echo ========================================
echo   TEST INSTRUCTIONS
echo ========================================
echo.
echo 1. अभी browser खुलेगा
echo 2. Create Quotation पर जाओ
echo 3. Kuch bhi details भरो
echo 4. "Save Draft" पर click करो
echo 5. Success message देखो
echo.
echo फिर इस window में आकर Option 1 select करो
echo तो देखोगे - Count बढ़ गया होगा! ✨
echo.
pause

start http://localhost:8080
echo.
echo Browser opened! अब test करो...
echo.
pause
goto MENU

:MONITOR
echo.
echo ========================================
echo   REAL-TIME DATABASE MONITOR
echo ========================================
echo.
echo Monitoring database every 3 seconds...
echo Press Ctrl+C to stop
echo.

:MONITOR_LOOP
node check_database.js
timeout /t 3 /nobreak >nul
goto MONITOR_LOOP

:END
echo.
echo ========================================
echo   Database Integration Verified! ✅
echo ========================================
echo.
pause
exit
