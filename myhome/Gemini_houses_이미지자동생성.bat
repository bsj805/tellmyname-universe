@echo off
title Gemini Houses Auto Generator
echo =========================================================
echo    Gemini Web Houses Image Auto Generator
echo =========================================================
echo.
echo  [Default Path] G:\My Drive\new_houses
echo  [Legacy Path ] G:\My Drive\houses
echo.
set "TARGET_DIR=%~1"
if "%TARGET_DIR%"=="" (
    set /p "TARGET_DIR=Enter Target Folder Path (Press Enter for G:\My Drive\new_houses): "
)
if defined TARGET_DIR (
    set "TARGET_DIR=%TARGET_DIR:"=%"
)
if "%TARGET_DIR%"=="" (
    set "TARGET_DIR=G:\My Drive\new_houses"
)
echo.
echo  Target Folder: "%TARGET_DIR%"
echo.
cd /d "c:\Users\USER\Documents\projects\myhome"
"C:\Users\USER\AppData\Local\hermes\bin\uv.exe" run --with playwright --with pillow --with requests python auto_generator.py "%TARGET_DIR%"
echo.
pause
