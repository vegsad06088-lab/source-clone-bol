# PowerShell wrapper script to run npm with Node v24
# This bypasses the WSL node in PATH

$pathItems = $env:PATH -split ';' | Where-Object { $_ -notmatch 'WSLNode' }
$env:PATH = "C:\Tools\node-v24.14.0-win-x64;$($pathItems -join ';')"

# Get the arguments passed to this script
$npmArgs = $args

# Run npm
& C:\Tools\node-v24.14.0-win-x64\npm.cmd @npmArgs

