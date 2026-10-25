@echo off
setlocal enabledelayedexpansion
title RoadSight - Smart Infrastructure Launcher
color 0B
cls

echo =====================================================================
echo       ROADSIGHT: AI-POWERED ROAD PROGRESS MONITORING SYSTEM
echo                      Smart Infrastructure Portal
echo =====================================================================
echo.

set "PATH=C:\Program Files\nodejs;%PATH%"

:: Resolve project directory without trailing backslash
set "PROJ_DIR=%~dp0"
if "%PROJ_DIR:~-1%"=="\" set "PROJ_DIR=%PROJ_DIR:~0,-1%"

cd /d "%PROJ_DIR%"

echo [*] Working Directory: %PROJ_DIR%
echo [*] Checking Node.js installation...
where node >nul 2>nul
if errorlevel 1 goto NO_NODE

for /f "tokens=*" %%v in ('node -v') do echo [*] Node.js version: %%v

:: 1. Check if FastAPI Backend (port 8000) is listening
netstat -ano -p tcp | findstr /C:":8000 " | findstr /I "LISTENING" >nul 2>nul
if not errorlevel 1 goto BACKEND_RUNNING

echo [*] Launching RoadSight FastAPI Backend (Port 8000)...
start "RoadSight FastAPI Backend" /min cmd /c "cd /d "%PROJ_DIR%" && python -m uvicorn backend.server:app --host 127.0.0.1 --port 8000"
timeout /t 2 /nobreak >nul
goto CHECK_FRONTEND

:BACKEND_RUNNING
echo [*] RoadSight FastAPI Backend is already listening on port 8000.

:CHECK_FRONTEND
:: 2. Check if Vite Frontend (port 5173) is listening
netstat -ano -p tcp | findstr /C:":5173 " | findstr /I "LISTENING" >nul 2>nul
if not errorlevel 1 goto FRONTEND_RUNNING

echo [*] Starting RoadSight Web Portal...
echo [*] Opening default web browser at http://localhost:5173/
echo.

:: Open browser after a brief delay in background
start "" cmd /c "ping -n 3 127.0.0.1 >nul && start http://localhost:5173/"

:: Launch Vite server
call npm run dev -- --host 127.0.0.1 --port 5173
goto END

:FRONTEND_RUNNING
echo [*] RoadSight server is ALREADY RUNNING on port 5173!
echo [*] Opening your web browser now...
start "" "http://localhost:5173/"
ping -n 2 127.0.0.1 >nul
goto END

:NO_NODE
echo.
echo [ERROR] Node.js executable was not detected in PATH!
echo Please make sure Node.js is installed from https://nodejs.org/
echo.
pause
exit /b 1

:END
