@echo off
title RoadSight - FastAPI AI/ML Backend Server
color 0A
cls

echo =====================================================================
echo       ROADSIGHT: FASTAPI AI/ML PROGRESS MONITORING BACKEND
echo =====================================================================
echo.

cd /d "%~dp0"

echo [*] Starting FastAPI REST API Service on http://127.0.0.1:8000 ...
echo [*] Interactive Swagger API Docs: http://127.0.0.1:8000/docs
echo.

python -m uvicorn backend.server:app --host 127.0.0.1 --port 8000 --reload

pause
