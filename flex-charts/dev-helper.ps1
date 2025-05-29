# PowerShell script for FlexCharts development and testing
# Run from: c:\Users\terok\proj\FlexCharts\flex-charts\

param(
    [string]$Action = "help"
)

$ProjectRoot = "c:\Users\terok\proj\FlexCharts\flex-charts"

# Change to project directory
Set-Location $ProjectRoot

function Show-Help {
    Write-Host "FlexCharts Development Script" -ForegroundColor Green
    Write-Host "=============================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage: .\dev-helper.ps1 [action]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Available actions:" -ForegroundColor Cyan
    Write-Host "  help          - Show this help message"
    Write-Host "  install       - Install dependencies"
    Write-Host "  dev           - Start development server"
    Write-Host "  build         - Build the library"
    Write-Host "  test          - Run unit tests"
    Write-Host "  test-e2e      - Run Playwright tests"
    Write-Host "  test-ui       - Run Playwright tests with UI"
    Write-Host "  preview       - Start preview server"
    Write-Host "  lint          - Run ESLint"
    Write-Host "  clean         - Clean build artifacts"
    Write-Host "  controller    - Open controller test page"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Magenta
    Write-Host "  .\dev-helper.ps1 dev"
    Write-Host "  .\dev-helper.ps1 test-e2e"
    Write-Host "  .\dev-helper.ps1 controller"
}

function Install-Dependencies {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to install dependencies" -ForegroundColor Red
    }
}

function Start-DevServer {
    Write-Host "Starting development server..." -ForegroundColor Yellow
    Write-Host "The server will be available at: http://localhost:5173" -ForegroundColor Cyan
    npm run dev
}

function Build-Library {
    Write-Host "Building library..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build completed successfully!" -ForegroundColor Green
        Write-Host "Output: dist/" -ForegroundColor Cyan
    } else {
        Write-Host "Build failed" -ForegroundColor Red
    }
}

function Run-Tests {
    Write-Host "Running unit tests..." -ForegroundColor Yellow
    npm run test
}

function Run-E2ETests {
    Write-Host "Running Playwright tests..." -ForegroundColor Yellow
    Write-Host "This will start the preview server and run tests on both mobile (480px) and desktop (1600px)" -ForegroundColor Cyan
    npm run test:render
}

function Run-E2ETestsUI {
    Write-Host "Running Playwright tests with UI..." -ForegroundColor Yellow
    npm run test:render:ui
}

function Start-Preview {
    Write-Host "Starting preview server..." -ForegroundColor Yellow
    Write-Host "The preview will be available at: http://localhost:4173" -ForegroundColor Cyan
    npm run preview
}

function Run-Lint {
    Write-Host "Running ESLint..." -ForegroundColor Yellow
    npm run lint
}

function Clean-Build {
    Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
        Write-Host "Removed dist/" -ForegroundColor Green
    }
    if (Test-Path "test-results") {
        Remove-Item -Recurse -Force "test-results"
        Write-Host "Removed test-results/" -ForegroundColor Green
    }
    if (Test-Path "playwright-report") {
        Remove-Item -Recurse -Force "playwright-report"
        Write-Host "Removed playwright-report/" -ForegroundColor Green
    }
    Write-Host "Clean completed!" -ForegroundColor Green
}

function Open-ControllerTest {
    Write-Host "Opening controller test page..." -ForegroundColor Yellow
    $TestFile = Join-Path $ProjectRoot "timeline-controller-test.html"
    if (Test-Path $TestFile) {
        Start-Process $TestFile
        Write-Host "Controller test page opened in default browser" -ForegroundColor Green
    } else {
        Write-Host "Controller test file not found: $TestFile" -ForegroundColor Red
    }
}

# Main script logic
switch ($Action.ToLower()) {
    "help" { Show-Help }
    "install" { Install-Dependencies }
    "dev" { Start-DevServer }
    "build" { Build-Library }
    "test" { Run-Tests }
    "test-e2e" { Run-E2ETests }
    "test-ui" { Run-E2ETestsUI }
    "preview" { Start-Preview }
    "lint" { Run-Lint }
    "clean" { Clean-Build }
    "controller" { Open-ControllerTest }
    default {
        Write-Host "Unknown action: $Action" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}
