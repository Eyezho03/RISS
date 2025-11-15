# RISS Quick Start Script for Windows PowerShell
# Run this script to set up everything quickly

Write-Host "🚀 RISS Quick Start Script" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing Dependencies..." -ForegroundColor Yellow
Write-Host ""

# Install contracts dependencies
Write-Host "1. Installing smart contracts dependencies..." -ForegroundColor Cyan
Set-Location "C:\Users\gilly\Desktop\riss-contracts"
if (Test-Path "node_modules") {
    Write-Host "   node_modules exists, skipping..." -ForegroundColor Gray
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install contracts dependencies" -ForegroundColor Red
        exit 1
    }
}

# Install backend dependencies
Write-Host "2. Installing backend dependencies..." -ForegroundColor Cyan
Set-Location "C:\Users\gilly\Desktop\riss-backend"
if (Test-Path "node_modules") {
    Write-Host "   node_modules exists, skipping..." -ForegroundColor Gray
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
}

# Install frontend dependencies
Write-Host "3. Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location "C:\Users\gilly\Desktop\RISS"
if (Test-Path "node_modules") {
    Write-Host "   node_modules exists, skipping..." -ForegroundColor Gray
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ All dependencies installed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Compile contracts:" -ForegroundColor Cyan
Write-Host "   cd C:\Users\gilly\Desktop\riss-contracts" -ForegroundColor White
Write-Host "   npm run compile" -ForegroundColor White
Write-Host ""
Write-Host "2. Start Hardhat node (Terminal 1):" -ForegroundColor Cyan
Write-Host "   cd C:\Users\gilly\Desktop\riss-contracts" -ForegroundColor White
Write-Host "   npm run node" -ForegroundColor White
Write-Host ""
Write-Host "3. Deploy contracts (Terminal 2):" -ForegroundColor Cyan
Write-Host "   cd C:\Users\gilly\Desktop\riss-contracts" -ForegroundColor White
Write-Host "   npm run deploy:local" -ForegroundColor White
Write-Host "   (Copy the contract addresses!)" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Configure backend .env:" -ForegroundColor Cyan
Write-Host "   cd C:\Users\gilly\Desktop\riss-backend" -ForegroundColor White
Write-Host "   Copy env.example to .env and add contract addresses" -ForegroundColor White
Write-Host ""
Write-Host "5. Start backend (Terminal 3):" -ForegroundColor Cyan
Write-Host "   cd C:\Users\gilly\Desktop\riss-backend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "6. Start frontend (Terminal 4):" -ForegroundColor Cyan
Write-Host "   cd C:\Users\gilly\Desktop\RISS" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📖 See GETTING_STARTED.md for detailed instructions" -ForegroundColor Yellow
Write-Host ""

