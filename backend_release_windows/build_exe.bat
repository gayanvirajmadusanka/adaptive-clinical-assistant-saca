@echo off
cd /d "%~dp0.."

echo [1/4] Installing dependencies...
pip install -r backend_release_windows\requirements_windows.txt
if errorlevel 1 goto :error

echo [2/4] Downloading spaCy model...
python -m spacy download en_core_web_sm
if errorlevel 1 goto :error

echo [3/4] Building executable...
pyinstaller backend_release_windows\saca_server.spec --clean
if errorlevel 1 goto :error

echo [4/4] Done.
echo Executable: dist\saca_server.exe
goto :end

:error
echo BUILD FAILED
exit /b 1

:end
