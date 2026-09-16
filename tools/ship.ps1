# Fly Box - stage, commit and push in one go
# ---------------------------------------------------------------------------
#   .\tools\ship.ps1 "what changed"
#
# Written for a repo that lives inside OneDrive, which is why it is more than
# three lines. Two things OneDrive does to git here:
#   - "Files On-Demand" placeholders make `git add` die with
#     "mmap failed: Invalid argument"; pinning the tree first avoids it.
#   - git's automatic repack cannot delete emptied .git/objects folders that
#     OneDrive still has open, so it stops to ask y/n. gc.auto=0 ends that.
# A file OneDrive has left broken (a sync conflict) is reported by name rather
# than aborting the whole add, so you can replace it and re-run.

param(
  [Parameter(Mandatory = $true)][string] $Message
)

$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

git config gc.auto 0 | Out-Null

# Pin everything, .git included, so nothing is a placeholder when git reads it.
attrib +P -U "$root\*" /S /D 2>$null | Out-Null
attrib +P -U "$root\.git\*" /S /D 2>$null | Out-Null

# Add file by file: one bad file must not block the other three hundred.
$failed = @()
git ls-files -o -m -d --exclude-standard | ForEach-Object {
  $out = git add -A -- "$_" 2>&1
  if ($LASTEXITCODE -ne 0) { $failed += $_; Write-Host "  could not add: $_" -ForegroundColor Yellow }
}

$staged = (git diff --cached --name-only | Measure-Object -Line).Lines
if ($staged -eq 0) { Write-Host "Nothing to commit."; exit 0 }

$trailer = "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`nClaude-Session: https://claude.ai/code/session_018h9iPpuLgPR6ZkzXr3aVcD"
git commit -q -m $Message -m $trailer
if ($LASTEXITCODE -ne 0) { Write-Host "Commit failed." -ForegroundColor Red; exit 1 }

git push -q
if ($LASTEXITCODE -ne 0) { Write-Host "Push failed - check the network and run: git push" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "Pushed: $(git log --oneline -1)" -ForegroundColor Green
if ($failed.Count) {
  Write-Host ""
  Write-Host "Left out (OneDrive has these files broken - delete or replace, then run again):" -ForegroundColor Yellow
  $failed | ForEach-Object { Write-Host "  $_" }
}
