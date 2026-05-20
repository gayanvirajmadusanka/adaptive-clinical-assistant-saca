@echo off
setlocal
cd /d "%~dp0.."

:: -----------------------------------------------------------------------
:: Prerequisites:
::   - JDK 17+ on PATH  (must include jpackage)
::   - Python 3.11+ on PATH with pip
::   - Maven (mvn) on PATH
::   - JAVAFX_HOME set to JavaFX SDK root, e.g.:
::       set JAVAFX_HOME=C:\javafx-sdk-21.0.2
:: -----------------------------------------------------------------------

if "%JAVAFX_HOME%"=="" (
    echo ERROR: JAVAFX_HOME is not set.
    echo Download JavaFX SDK from https://gluonhq.com/products/javafx/
    echo Then run:  set JAVAFX_HOME=C:\path\to\javafx-sdk-21.0.2
    exit /b 1
)

echo.
echo [1/5] Installing Python dependencies...
pip install -r backend_release_windows\requirements_windows.txt
if errorlevel 1 goto :error

echo.
echo [2/5] Downloading spaCy model...
python -m spacy download en_core_web_sm
if errorlevel 1 goto :error

echo.
echo [3/5] Building saca_server.exe...
pyinstaller backend_release_windows\saca_server.spec --clean --distpath backend_release_windows\dist
if errorlevel 1 goto :error

echo.
echo [4/5] Building JavaFX app JAR...
cd windows_app
mvn clean package -q
if errorlevel 1 goto :error

:: Copy saca_server.exe into target/lib so jpackage bundles it
copy /Y ..\backend_release_windows\dist\saca_server.exe target\lib\saca_server.exe
cd ..

echo.
echo [5/5] Packaging installer with jpackage...
jpackage ^
  --type exe ^
  --name SACA ^
  --app-version 1.0 ^
  --vendor "SACA Team" ^
  --description "SACA Adaptive Clinical Assistant" ^
  --input windows_app\target\lib ^
  --main-jar SACA-1.0-SNAPSHOT.jar ^
  --main-class org.saca.MainApp ^
  --module-path "%JAVAFX_HOME%\lib" ^
  --add-modules javafx.controls,javafx.fxml,javafx.media ^
  --win-dir-chooser ^
  --win-shortcut ^
  --win-menu ^
  --dest dist_installer
if errorlevel 1 goto :error

echo.
echo ================================================================
echo  Done!  Installer: dist_installer\SACA-1.0.exe
echo ================================================================
goto :end

:error
echo.
echo BUILD FAILED.
exit /b 1

:end
endlocal
