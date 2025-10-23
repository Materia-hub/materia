@echo off
REM Materia Deployment Script for Windows
REM Deploys both frontend (via Git/Vercel) and backend (Supabase functions)

echo.
echo ================================
echo   Materia Deployment Script
echo ================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git not found. Please install Git first.
    pause
    exit /b 1
)

REM Get deployment message
set /p DEPLOY_MSG="Enter deployment message (or press Enter for default): "

if "%DEPLOY_MSG%"=="" (
    set DEPLOY_MSG=Deploy changes from Figma Make - %date% %time%
)

echo.
echo Deployment message: %DEPLOY_MSG%
echo.

REM Step 1: Stage changes
echo [*] Staging changes...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to stage changes
    pause
    exit /b 1
)
echo [OK] Changes staged

REM Step 2: Commit
echo [*] Committing changes...
git commit -m "%DEPLOY_MSG%"
REM Don't exit on commit failure (might be nothing to commit)

REM Step 3: Push to GitHub
echo [*] Pushing to GitHub...
git push
if %errorlevel% neq 0 (
    echo [ERROR] Failed to push to GitHub
    echo.
    echo Possible issues:
    echo   1. No remote repository configured
    echo   2. Authentication required
    echo   3. Network issue
    echo.
    pause
    exit /b 1
)
echo [OK] Pushed to GitHub successfully

REM Step 4: Ask about backend deployment
echo.
set /p DEPLOY_BACKEND="Deploy backend to Supabase? (y/N): "

if /i "%DEPLOY_BACKEND%"=="y" (
    echo [*] Deploying backend to Supabase...
    
    REM Check if Supabase CLI is installed
    where supabase >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERROR] Supabase CLI not installed
        echo Install with: npm install -g supabase
        pause
        exit /b 1
    )
    
    REM Navigate to functions directory
    if exist "supabase\functions" (
        cd supabase\functions
        supabase functions deploy make-server-8ae6fee0 --no-verify-jwt
        if %errorlevel% neq 0 (
            echo [ERROR] Backend deployment failed
            cd ..\..
            pause
            exit /b 1
        )
        echo [OK] Backend deployed to Supabase
        cd ..\..
    ) else (
        echo [ERROR] supabase\functions directory not found
        pause
        exit /b 1
    )
) else (
    echo [SKIP] Skipping backend deployment
)

REM Success!
echo.
echo ================================
echo   Deployment Complete!
echo ================================
echo.
echo Next steps:
echo   1. Vercel will auto-deploy in 2-3 minutes
echo   2. Check deployment status at: https://vercel.com/dashboard
echo   3. Monitor for errors in Vercel logs
if /i "%DEPLOY_BACKEND%"=="y" (
    echo   4. Check Supabase function logs at: https://supabase.com/dashboard
)
echo.
echo Your changes will be live shortly!
echo.
pause
