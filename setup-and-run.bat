@echo off
:: This script automates project environment setup and runs the server from any PC.
title Node.js Project Setup & Launcher

echo ===================================================
echo 🚀 STARTING BACKEND DEVELOPMENT SETUP
echo ===================================================

:: Step 1: Check for Node.js installation
echo 🔍 Checking for Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed on this PC.
    echo Please install Node.js from https://nodejs.org before running this script.
    pause
    exit /b
)
echo ✅ Node.js is installed!

:: Step 2: Install node_modules if missing
if not exist "node_modules\\" (
    echo 📦 Missing 'node_modules'. Installing project dependencies...
    call npm install
    echo ✅ Dependencies installed successfully!
) else (
    echo ✅ 'node_modules' folder already exists. Skipping installation.
)

:: Step 3: Check for .env file configuration
if not exist ".env" (
    echo ⚠️ Warning: Your custom secret configuration file (.env) was not found!
    echo Creating a blank .env template for you...
    echo PORT=5000> .env
    echo MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxx.mongodb.net/myFirstDatabase?retryWrites=true^&w=majority>> .env
    echo 🛠️ A template '.env' file has been generated in the project root folder.
    echo 🛑 Open '.env' right now and add your real MongoDB Atlas password before proceeding!
    echo ===================================================
    pause
)

:: Step 4: Run the application
echo Before start the server add MONGO_URI in .env file then,
echo 🏃 Start your Express Backend Server...
echo 💡 Press Ctrl + C inside this window to stop the server at any time.
echo ===================================================

pause
