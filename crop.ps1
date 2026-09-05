Add-Type -AssemblyName System.Drawing

$whiteSrc = "C:\Users\Yatharth\.gemini\antigravity-ide\brain\7bf72dbc-bc01-4660-a0c7-e13d0da4a74b\.user_uploaded\media_1788616344475.jpg"
$beigeSrc = "C:\Users\Yatharth\.gemini\antigravity-ide\brain\d17b5f38-aee8-45de-9267-ad0c450f65e2\.user_uploaded\media_1788623745870.jpg"

$whiteOut = "d:\kisan setu\Kisan-Setu\public\produce\white"
$beigeOut = "d:\kisan setu\Kisan-Setu\public\produce\beige"
$rootOut  = "d:\kisan setu\Kisan-Setu\public\produce"

@($whiteOut, $beigeOut, $rootOut) | ForEach-Object {
    if (!(Test-Path $_)) { New-Item -ItemType Directory -Force -Path $_ }
}

$products = @(
    @("p1", "tomato", 0, 0),
    @("p2", "onion", 0, 1),
    @("p3", "spinach", 0, 2),
    @("p4", "potato", 0, 3),
    @("p5", "cauliflower", 1, 0),
    @("p6", "wheat", 1, 1),
    @("p7", "basmati", 1, 2),
    @("p8", "mango", 1, 3),
    @("p9", "guava", 2, 0),
    @("p10", "okra", 2, 1),
    @("p11", "green-chilli", 2, 2),
    @("p12", "banana", 2, 3),
    @("p13", "cow-milk", 3, 0),
    @("p14", "desi-ghee", 3, 1),
    @("p15", "bajra", 3, 2),
    @("p16", "turmeric", 3, 3),
    @("p17", "chana-dal", 4, 0),
    @("p18", "amla", 4, 1)
)

$cols = 4
$rows = 5

function Crop-Grid($srcPath, $targetDir) {
    $img = [System.Drawing.Bitmap]::FromFile($srcPath)
    $cellW = $img.Width / $cols
    $cellH = $img.Height / $rows
    foreach ($item in $products) {
        $id = $item[0]
        $r = $item[2]
        $c = $item[3]
        $x = [int]($c * $cellW)
        $y = [int]($r * $cellH)
        $w = [int]$cellW
        $h = [int]$cellH
        $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
        $cropped = $img.Clone($rect, $img.PixelFormat)
        $destPath = Join-Path $targetDir "$id.jpg"
        $cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        $cropped.Dispose()
    }
    $img.Dispose()
}

Write-Host "Cropping white background images..."
Crop-Grid $whiteSrc $whiteOut
Crop-Grid $whiteSrc $rootOut

Write-Host "Cropping beige background images..."
Crop-Grid $beigeSrc $beigeOut

Write-Host "Done! Both sets cropped successfully."
