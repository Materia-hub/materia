@echo off
REM Materia Backend-Only Deployment Script (Windows)
REM Deploys only Supabase edge functions

echo ⚙️  Materia Backend Deployment
echo ===============================
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Supabase CLI not installed
    echo.
    echo Install with:
    echo   npm install -g supabase
    echo.
    exit /b 1
)

REM Check if functions directory exists
if not exist "supabase\functions" (
    echo ❌ supabase\functions directory not found
    exit /b 1
)

REM Navigate to functions directory
cd supabase\functions

REM Deploy
echo 📦 Deploying edge function to Supabase...
echo.

supabase functions deploy make-server-8ae6fee0 --no-verify-jwt

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===============================
    echo ✅ Backend Deployed! 🎉
    echo ===============================
    echo.
    echo Check logs: https://supabase.com/dashboard
    cd ..\..
) else (
    echo.
    echo ❌ Deployment failed
    echo.
    echo Common issues:
    echo   1. Not logged in - run: supabase login
    echo   2. Not linked to project - run: supabase link --project-ref YOUR_REF
    echo   3. Network issue
    cd ..\..
    exit /b 1
)
