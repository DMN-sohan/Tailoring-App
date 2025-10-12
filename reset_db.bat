@echo off
REM Quick Database Reset Script for Windows
REM ==========================================

echo.
echo ========================================
echo   Tailoring Management System
echo   Quick Database Reset
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

REM Check if requests library is installed
python -c "import requests" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing required dependencies...
    pip install requests
)

REM Run the simple reset script
python reset_database_simple.py

echo.
pause


