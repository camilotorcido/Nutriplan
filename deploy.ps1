param([string]$message = "")
Set-Location $PSScriptRoot

$archivos = @("js\app-bundle.js","js\storage.js","js\cloud-storage.js","js\nutritionEngine.js","js\recipes.js","js\auth.js","css\style.css","css\tailwind-compiled.css") | Where-Object { Test-Path $_ }
$contenido = ($archivos | ForEach-Object { Get-Content $_ -Raw }) -join "|"
$bytes   = [System.Text.Encoding]::UTF8.GetBytes($contenido)
$hash    = [System.Security.Cryptography.MD5]::Create().ComputeHash($bytes)
$version = [System.BitConverter]::ToString($hash).Replace("-","").Substring(0,8).ToLower()
Write-Host ('Version: ' + $version) -ForegroundColor Cyan

$html = Get-Content "index.html" -Raw -Encoding utf8
$html = [regex]::Replace($html, "APP_VERSION\s*=\s*'[^']*'", ("APP_VERSION = '" + $version + "'"))
$html = [regex]::Replace($html, '\?v=[\da-z]+', ('?v=' + $version))
[System.IO.File]::WriteAllText(($PSScriptRoot + '\index.html'), $html, [System.Text.UTF8Encoding]::new($false))
Write-Host 'index.html actualizado' -ForegroundColor Green

# Generar version.json para deteccion de updates en iOS PWA (bypass SW cache)
'{"v":"' + $version + '"}' | Out-File -FilePath ($PSScriptRoot + '\version.json') -Encoding utf8 -NoNewline
Write-Host 'version.json actualizado' -ForegroundColor Green

$msg = if ($message) { $message } else { ('chore: deploy ' + $version) }
git add -A
$st = git status --short
if ($st) {
    git commit -m $msg
    git push
    Write-Host ('Deploy OK: ' + $version) -ForegroundColor Green
} else {
    Write-Host 'Sin cambios en frontend.' -ForegroundColor Yellow
}

# Deploy Cloud Functions si functions/index.js cambio
$fnChanged = git diff HEAD~1 --name-only 2>$null | Where-Object { $_ -match '^functions/' }
if ($fnChanged) {
    Write-Host 'Detectados cambios en functions/ -> desplegando Cloud Functions...' -ForegroundColor Cyan
    firebase deploy --only functions
    if ($LASTEXITCODE -eq 0) {
        Write-Host 'Cloud Functions OK' -ForegroundColor Green
    } else {
        Write-Host 'ERROR en Cloud Functions deploy' -ForegroundColor Red
    }
}
