param([string]$message = "")
Set-Location $PSScriptRoot

# Pre-compilar bundle JSX → JS plano con esbuild (~250 KB minificado vs ~830 KB JSX runtime)
# Elimina la dependencia de Babel Standalone en runtime → cold load 50-70% más rápido.
Write-Host 'Compilando app-bundle con esbuild...' -ForegroundColor Cyan
if (-not (Test-Path 'node_modules\.bin\esbuild.cmd')) {
    Write-Host 'esbuild no encontrado, instalando...' -ForegroundColor Yellow
    npm install --silent
    if ($LASTEXITCODE -ne 0) { Write-Host 'ERROR npm install' -ForegroundColor Red; exit 1 }
}
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host 'ERROR esbuild compile' -ForegroundColor Red
    exit 1
}
$compiledSize = (Get-Item 'js\app-bundle.compiled.js').Length
Write-Host ('Bundle compilado: ' + [math]::Round($compiledSize/1024,1) + ' KB') -ForegroundColor Green

# Hash de versión: incluye bundle COMPILADO (lo que sirve a producción)
$archivos = @("js\app-bundle.compiled.js","js\storage.js","js\cloud-storage.js","js\nutritionEngine.js","js\recipes.js","js\auth.js","css\style.css","css\tailwind-compiled.css") | Where-Object { Test-Path $_ }
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
