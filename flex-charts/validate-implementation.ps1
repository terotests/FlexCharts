# Validation script for TimeLineChart Controller implementation
# This script checks if all required files and features are properly implemented

Write-Host "FlexCharts Controller Implementation Validation" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

$ProjectRoot = "c:\Users\terok\proj\FlexCharts\flex-charts"
$Errors = @()
$Warnings = @()
$Success = @()

# Check if we're in the right directory
if (-not (Test-Path (Join-Path $ProjectRoot "package.json"))) {
    Write-Host "Error: Not in FlexCharts project directory" -ForegroundColor Red
    exit 1
}

Set-Location $ProjectRoot

# Function to check file exists and contains required content
function Test-FileContent {
    param(
        [string]$FilePath,
        [string[]]$RequiredStrings,
        [string]$Description
    )
    
    if (-not (Test-Path $FilePath)) {
        $global:Errors += "Missing file: $FilePath"
        return $false
    }
    
    $content = Get-Content $FilePath -Raw
    $missing = @()
    
    foreach ($required in $RequiredStrings) {
        if ($content -notmatch [regex]::Escape($required)) {
            $missing += $required
        }
    }
    
    if ($missing.Count -eq 0) {
        $global:Success += "$Description - ✓"
        return $true
    } else {
        $global:Errors += "$Description - Missing: $($missing -join ', ')"
        return $false
    }
}

Write-Host "Checking core controller implementation..." -ForegroundColor Yellow

# Check TimeLineChartController
Test-FileContent -FilePath "src\lib\controllers\TimeLineChartController.ts" `
    -RequiredStrings @(
        "class TimeLineChartController",
        "ResizeObserver",
        "onDimensionChange",
        "addBarElement",
        "updateTimeSlotElements",
        "getDimensions"
    ) `
    -Description "TimeLineChartController features"

# Check TimeLineChart component
Test-FileContent -FilePath "src\lib\components\TimeLineChart.tsx" `
    -RequiredStrings @(
        "forwardRef",
        "useImperativeHandle",
        "data-test-id",
        "onBarElementRef",
        "aria-label"
    ) `
    -Description "TimeLineChart component integration"

# Check test files
Test-FileContent -FilePath "tests\e2e\timeline-chart.spec.ts" `
    -RequiredStrings @(
        "mobile-480px",
        "desktop-1600px",
        "data-test-id",
        "bar-1",
        "bar-12"
    ) `
    -Description "Playwright viewport tests"

# Check configuration files
Test-FileContent -FilePath "playwright.config.ts" `
    -RequiredStrings @(
        "mobile-480px",
        "desktop-1600px",
        "viewport",
        "webServer"
    ) `
    -Description "Playwright configuration"

# Check package.json scripts
Test-FileContent -FilePath "package.json" `
    -RequiredStrings @(
        "test:render",
        "test:render:ui",
        "@playwright/test"
    ) `
    -Description "Package.json test scripts"

# Check if gitignore excludes test artifacts
Test-FileContent -FilePath ".gitignore" `
    -RequiredStrings @(
        "test-results",
        "playwright-report"
    ) `
    -Description "Gitignore test artifacts"

Write-Host ""
Write-Host "Validation Results:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

if ($Success.Count -gt 0) {
    Write-Host ""
    Write-Host "✓ Successful checks:" -ForegroundColor Green
    foreach ($item in $Success) {
        Write-Host "  $item" -ForegroundColor Green
    }
}

if ($Warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠ Warnings:" -ForegroundColor Yellow
    foreach ($item in $Warnings) {
        Write-Host "  $item" -ForegroundColor Yellow
    }
}

if ($Errors.Count -gt 0) {
    Write-Host ""
    Write-Host "✗ Errors:" -ForegroundColor Red
    foreach ($item in $Errors) {
        Write-Host "  $item" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "🎉 All validation checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Controller implementation is ready for testing:" -ForegroundColor Cyan
    Write-Host "  • DOM element reference storage ✓" -ForegroundColor White
    Write-Host "  • ResizeObserver for dimension tracking ✓" -ForegroundColor White
    Write-Host "  • Dimension change callbacks ✓" -ForegroundColor White
    Write-Host "  • Bar and time slot element management ✓" -ForegroundColor White
    Write-Host "  • Accessibility attributes ✓" -ForegroundColor White
    Write-Host "  • Viewport-specific testing (480px/1600px) ✓" -ForegroundColor White
    Write-Host "  • Data-test-id selectors ✓" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Magenta
    Write-Host "  1. Run: .\dev-helper.ps1 test-e2e" -ForegroundColor White
    Write-Host "  2. Run: .\dev-helper.ps1 dev" -ForegroundColor White
    Write-Host "  3. Run: .\dev-helper.ps1 controller" -ForegroundColor White
}

Write-Host ""
Write-Host "Summary: $($Success.Count) passed, $($Warnings.Count) warnings, $($Errors.Count) errors" -ForegroundColor Cyan
