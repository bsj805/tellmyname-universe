@echo off
title Gemini Foods Auto Generator
echo =========================================================
echo    Gemini Web Foods Image Auto Generator
echo    (mukbang.tellmyname.app)
echo =========================================================
echo.
echo  [Default Path] c:\Users\USER\Documents\projects\food\images
echo.
set "TARGET_DIR=%~1"
if "%TARGET_DIR%"=="" (
    set /p "TARGET_DIR=Enter Target Folder Path (Press Enter for c:\Users\USER\Documents\projects\food\images): "
)
if defined TARGET_DIR (
    set "TARGET_DIR=%TARGET_DIR:"=%"
)
if "%TARGET_DIR%"=="" (
    set "TARGET_DIR=c:\Users\USER\Documents\projects\food\images"
)
echo.
echo  Target Folder: "%TARGET_DIR%"
echo.
cd /d "c:\Users\USER\Documents\projects\food"
echo [1/2] Updating prompt txt files from food dataset...
node scripts/generate_prompt_txt_files.mjs "%TARGET_DIR%"
echo.
echo [2/2] Launching Gemini Image Auto Generator...
"C:\Users\USER\AppData\Local\hermes\bin\uv.exe" run --with playwright --with pillow --with requests python auto_generator.py "%TARGET_DIR%"
echo.
pause
