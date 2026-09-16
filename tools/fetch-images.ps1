# Fly Box - pull down the images that were generated on fal
# ---------------------------------------------------------------------------
# Needs nothing but Windows PowerShell. No node, no FAL_KEY, no cost.
#
#   From the Fly Box folder:
#     powershell -ExecutionPolicy Bypass -File tools\fetch-images.ps1
#
#   Flags:
#     -Limit 8       stop after N (spot-check before pulling the lot)
#     -Force         re-download files that already exist
#     -Group panels  just the knot/leader panels (or: assets)
#     -DryRun        list what would be downloaded and exit
#
#   296 flies + organisms  ->  app\public\assets
#    45 knot/leader panels ->  app\public\assets\panels
#
# fal's media URLs are not permanent. If this starts returning 404s the set has
# to be regenerated rather than re-fetched.

param(
    [int]$Limit = 0,
    [switch]$Force,
    [string]$Group = '',
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $here
$manifestPath = Join-Path $here 'generated-images.json'

if (-not (Test-Path $manifestPath)) {
    Write-Host ""
    Write-Host "  Can't find $manifestPath" -ForegroundColor Red
    Write-Host "  Run this from the Fly Box folder, with the manifest in tools\."
    Write-Host ""
    exit 1
}

$pack = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json

# Flatten the groups into one work queue.
$queue = New-Object System.Collections.Generic.List[object]
foreach ($g in $pack.groups) {
    if ($Group -and ($g.dest -notlike "*$Group*") -and ($g.kind -notlike "*$Group*")) { continue }
    $dest = Join-Path $root ($g.dest -replace '/', '\')
    foreach ($p in $g.images.PSObject.Properties) {
        $queue.Add([pscustomobject]@{
            Id   = $p.Name
            Url  = $pack.base + $p.Value
            File = Join-Path $dest ($p.Name + '.jpg')
            Dest = $dest
        })
    }
}

if (-not $Force) { $queue = $queue | Where-Object { -not (Test-Path -LiteralPath $_.File) } }
if ($Limit -gt 0) { $queue = $queue | Select-Object -First $Limit }
$queue = @($queue)

Write-Host ""
Write-Host "  pack     $($pack.count) images, generated $($pack.generatedAt)"
foreach ($g in $pack.groups) {
    $n = ($g.images.PSObject.Properties | Measure-Object).Count
    Write-Host ("           {0,4}  {1}  ->  {2}" -f $n, $g.kind, $g.dest)
}
Write-Host "  to do    $($queue.Count)$(if ($Force) { ' (forced)' } else { ' (skipping existing)' })"
Write-Host ""

if ($DryRun) { $queue | ForEach-Object { Write-Host "  $($_.Id)" }; Write-Host ""; exit 0 }
if ($queue.Count -eq 0) { Write-Host "  nothing to do."; Write-Host ""; exit 0 }

foreach ($d in ($queue | Select-Object -ExpandProperty Dest -Unique)) {
    if (-not (Test-Path -LiteralPath $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
}

# TLS 1.2 - older PowerShell defaults can fail the handshake.
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch {}

$client = New-Object System.Net.WebClient
$done = 0
$failed = 0
$failures = New-Object System.Collections.Generic.List[string]
$total = $queue.Count

foreach ($item in $queue) {
    $ok = $false
    for ($attempt = 1; $attempt -le 3 -and -not $ok; $attempt++) {
        try {
            $bytes = $client.DownloadData($item.Url)
            if ($bytes.Length -lt 1024) { throw "suspiciously small ($($bytes.Length) bytes)" }
            [IO.File]::WriteAllBytes($item.File, $bytes)
            $ok = $true
        } catch {
            if ($attempt -eq 3) {
                $failed++
                $failures.Add($item.Id)
                Write-Host ("  FAIL  {0,3}/{1}  {2}  {3}" -f ($done + $failed), $total, $item.Id.PadRight(34), $_.Exception.Message) -ForegroundColor Red
            } else {
                Start-Sleep -Milliseconds (1500 * $attempt)
            }
        }
    }
    if ($ok) {
        $done++
        Write-Host ("  ok    {0,3}/{1}  {2}  {3} KB" -f ($done + $failed), $total, $item.Id.PadRight(34), [int]($bytes.Length / 1024))
    }
}

$client.Dispose()

Write-Host ""
Write-Host "  $done downloaded, $failed failed"
if ($failures.Count -gt 0) {
    $head = ($failures | Select-Object -First 8) -join ', '
    $more = if ($failures.Count -gt 8) { " +$($failures.Count - 8) more" } else { "" }
    Write-Host "  re-run to retry: $head$more"
}
Write-Host ""
