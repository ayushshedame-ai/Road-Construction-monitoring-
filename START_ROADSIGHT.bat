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

:: Ensure node is in PATH
set "PATH=C:\Program Files\nodejs;%PATH%"

cd /d "%~dp0"

echo [*] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Node.js executable was not detected!
    echo Please make sure Node.js is installed from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set "NODE_VER=%%v"
echo [*] Node.js version: !NODE_VER!

:: Check if FastAPI backend (port 8000) is running, if not start it
netstat -ano | findstr :8000 >nul 2>nul
if %errorlevel% neq 0 (
    echo [*] Launching RoadSight FastAPI Backend (Port 8000)...
    start "RoadSight FastAPI Backend" cmd /c "cd /d "%~dp0" && python -m uvicorn backend.server:app --host 127.0.0.1 --port 8000"
    timeout /t 2 >nul
) else (
    echo [*] RoadSight FastAPI Backend is already active on port 8000.
)

:: Check if port 5173 is already active
netstat -ano | findstr :5173 >nul 2>nul
if %errorlevel% equ 0 (
    echo.
    echo [*] RoadSight frontend server is ALREADY RUNNING on port 5173!
    echo [*] Opening your web browser now...
    start "" "http://localhost:5173/"
    timeout /t 3 >nul
    exit /b 0
)

echo [*] Starting RoadSight Vite Application Server...
echo [*] Opening default web browser at http://localhost:5173/
echo.

:: Launch Vite with --open flag so Vite itself opens the browser as soon as ready
call npx vite --host 127.0.0.1 --port 5173 --open

if %errorlevel% neq 0 (
    echo.
    echo [*] Falling back to npm run dev...
    start "" "http://localhost:5173/"
    call npm run dev -- --host 127.0.0.1 --port 5173 --open
)

pause
