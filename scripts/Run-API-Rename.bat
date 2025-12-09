@echo off
REM ============================================================================
REM API Directory Renaming - Complete Workflow Automation
REM ============================================================================
REM This batch file provides a guided workflow for renaming all .API
REM directories to .Api throughout the AcontPlus project
REM ============================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"
cd ..

:MENU
cls
echo.
echo ============================================================================
echo          ACONTPLUS API DIRECTORY RENAMING - WORKFLOW AUTOMATION
echo ============================================================================
echo.
echo Current Directory: %CD%
echo.
echo Select an action:
echo.
echo  1. [PREVIEW] Show what will be changed (WhatIf mode - SAFE)
echo  2. [EXECUTE] Run the rename script
echo  3. [VALIDATE] Check if renaming was successful
echo  4. [BUILD]    Build solution to verify changes
echo  5. [TEST]     Run unit tests
echo  6. [COMMIT]   Commit changes to git
echo  7. [HELP]     Show documentation
echo  8. [EXIT]     Exit this program
echo.
echo ============================================================================
echo.

set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto PREVIEW
if "%choice%"=="2" goto EXECUTE
if "%choice%"=="3" goto VALIDATE
if "%choice%"=="4" goto BUILD
if "%choice%"=="5" goto TEST
if "%choice%"=="6" goto COMMIT
if "%choice%"=="7" goto HELP
if "%choice%"=="8" goto EXIT
goto INVALID

:PREVIEW
cls
echo.
echo ============================================================================
echo                    PREVIEW MODE - No Changes Will Be Made
echo ============================================================================
echo.
echo Running script with -WhatIf parameter...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\Rename-API-Directories.ps1" -WhatIf
echo.
pause
goto MENU

:EXECUTE
cls
echo.
echo ============================================================================
echo                         EXECUTING API RENAME
echo ============================================================================
echo.
echo WARNING: This will rename all .API directories to .Api format
echo          Make sure you have:
echo            1. Closed Visual Studio
echo            2. Committed your current work
echo            3. Created a backup branch
echo.
set /p confirm="Continue? (YES/NO): "
if /i not "%confirm%"=="YES" (
    echo Cancelled.
    pause
    goto MENU
)
echo.
echo Executing rename script...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\Rename-API-Directories.ps1"
echo.
echo Renaming complete. Check the report: scripts\API-Rename-Report.txt
pause
goto MENU

:VALIDATE
cls
echo.
echo ============================================================================
echo                    VALIDATING API RENAME CHANGES
echo ============================================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\Validate-API-Rename.ps1"
echo.
pause
goto MENU

:BUILD
cls
echo.
echo ============================================================================
echo                         BUILDING SOLUTION
echo ============================================================================
echo.
echo Running: dotnet clean && dotnet build
echo.
call dotnet clean
call dotnet build
echo.
pause
goto MENU

:TEST
cls
echo.
echo ============================================================================
echo                      RUNNING UNIT TESTS
echo ============================================================================
echo.
echo Running: dotnet test
echo.
call dotnet test
echo.
pause
goto MENU

:COMMIT
cls
echo.
echo ============================================================================
echo                    COMMITTING CHANGES TO GIT
echo ============================================================================
echo.
echo Current git status:
git status
echo.
echo This will commit the API rename changes.
set /p confirm="Continue? (YES/NO): "
if /i not "%confirm%"=="YES" (
    echo Cancelled.
    pause
    goto MENU
)
echo.
echo Staging changes...
git add .
echo.
echo Committing...
git commit -m "refactor: rename all .API directories to .Api PascalCase"
echo.
echo Commit complete. View changes with: git log --oneline
pause
goto MENU

:HELP
cls
echo.
echo ============================================================================
echo                      DOCUMENTATION & HELP
echo ============================================================================
echo.
echo Opening documentation...
echo.
if exist "scripts\API-Rename-README.md" (
    start "" "scripts\API-Rename-README.md"
) else (
    echo Documentation file not found.
)
echo.
echo Documentation files available:
echo   - scripts\QUICK-START.md - Quick reference guide
echo   - scripts\API-Rename-README.md - Complete documentation
echo   - scripts\API-Rename-Report.txt - Last execution report
echo   - scripts\API-Validation-Report.txt - Last validation report
echo.
pause
goto MENU

:INVALID
cls
echo.
echo Invalid choice. Please try again.
echo.
pause
goto MENU

:EXIT
echo.
echo Exiting...
exit /b 0
