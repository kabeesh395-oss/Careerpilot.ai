@echo off
if exist "%~dp0android\gradlew.bat" (
  cd /d "%~dp0android"
  call gradlew.bat %*
) else (
  echo Error: android\gradlew.bat not found.
  exit /b 1
)
