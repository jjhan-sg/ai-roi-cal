@echo off
chcp 65001 > nul
echo ===================================================
echo   AX Portfolio Manager & AI ROI Simulator 실행
echo ===================================================
cd /d "%~dp0\.."
python app\start_app.py
pause
