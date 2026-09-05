Add-Type -AssemblyName System.Drawing

$src = "C:\Users\Yatharth\.gemini\antigravity-ide\brain\30754cb0-fd1e-458e-bc72-482fb24055d4\.user_uploaded\media_1788640285269.jpg"
$outDir = "d:\kisan setu\Kisan-Setu\public"
$weatherDir = "d:\kisan setu\Kisan-Setu\public\weather"

if (!(Test-Path $weatherDir)) {
    New-Item -ItemType Directory -Force -Path $weatherDir
}

# Copy full master image
Copy-Item -Path $src -Destination (Join-Path $outDir "weather-bg.jpg") -Force
Copy-Item -Path $src -Destination (Join-Path $weatherDir "weather-all.jpg") -Force

$img = [System.Drawing.Bitmap]::FromFile($src)
$w = $img.Width
$h = $img.Height
$halfW = [int]($w / 2)
$halfH = [int]($h / 2)

Write-Host "Total size: ${w}x${h}, Half: ${halfW}x${halfH}"

# 1. Top-Left: Clear / Sunny Plowing
$rectTL = New-Object System.Drawing.Rectangle(0, 0, $halfW, $halfH)
$cropTL = $img.Clone($rectTL, $img.PixelFormat)
$cropTL.Save((Join-Path $weatherDir "clear.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropTL.Dispose()

# 2. Top-Right: Bright Sun / Clear Sky
$rectTR = New-Object System.Drawing.Rectangle($halfW, 0, ($w - $halfW), $halfH)
$cropTR = $img.Clone($rectTR, $img.PixelFormat)
$cropTR.Save((Join-Path $weatherDir "sunny.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropTR.Dispose()

# 3. Bottom-Left: Rain / Monsoon / Plowing
$rectBL = New-Object System.Drawing.Rectangle(0, $halfH, $halfW, ($h - $halfH))
$cropBL = $img.Clone($rectBL, $img.PixelFormat)
$cropBL.Save((Join-Path $weatherDir "rain.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropBL.Dispose()

# 4. Bottom-Right: Cloudy / Overcast / Dark Sky
$rectBR = New-Object System.Drawing.Rectangle($halfW, $halfH, ($w - $halfW), ($h - $halfH))
$cropBR = $img.Clone($rectBR, $img.PixelFormat)
$cropBR.Save((Join-Path $weatherDir "cloudy.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropBR.Dispose()

$img.Dispose()

Write-Host "Successfully generated weather images in $weatherDir and $outDir\weather-bg.jpg"
