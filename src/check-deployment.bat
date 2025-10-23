@echo off
REM Quick script to check if backend needs deployment (Windows)

echo 🔍 Checking Backend Deployment Status...
echo.

REM Read project ID from utils/supabase/info.tsx
for /f "tokens=2 delims='" %%i in ('findstr "projectId.*=" utils\supabase\info.tsx') do set PROJECT_ID=%%i

if "%PROJECT_ID%"=="" (
    echo ❌ Could not find project ID
    exit /b 1
)

set BACKEND_URL=https://%PROJECT_ID%.supabase.co/functions/v1/make-server-8ae6fee0

echo Backend URL: %BACKEND_URL%/health
echo.

REM Make health check request using PowerShell
powershell -Command "$response = Invoke-WebRequest -Uri '%BACKEND_URL%/health' -UseBasicParsing; $response.Content"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Backend is OFFLINE or not responding
    echo.
    echo 👉 Deploy with: deploy-backend.sh ^(in Git Bash or WSL^)
    exit /b 1
)

echo.
echo ✅ Check the version in the response above
echo Expected version: 2.0.0-kv-fix
echo.
echo 👉 If version is wrong, deploy with: deploy-backend.sh
