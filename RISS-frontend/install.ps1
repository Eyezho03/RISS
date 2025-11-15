# PowerShell script to install dependencies on Windows
# This script works around the fsevents platform issue

Write-Host "Cleaning up previous installations..." -ForegroundColor Yellow
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

Write-Host "Checking for Yarn..." -ForegroundColor Yellow
$yarnInstalled = Get-Command yarn -ErrorAction SilentlyContinue

if (-not $yarnInstalled) {
    Write-Host "Yarn not found. Installing Yarn globally..." -ForegroundColor Yellow
    npm install -g yarn
}

Write-Host "Installing dependencies with Yarn (this may take a few minutes)..." -ForegroundColor Green
yarn install --ignore-platform

if ($LASTEXITCODE -eq 0) {
    Write-Host "Installation completed successfully!" -ForegroundColor Green
    Write-Host "You can now run: yarn dev" -ForegroundColor Green
} else {
    Write-Host "Installation failed. Please check the error messages above." -ForegroundColor Red
}

