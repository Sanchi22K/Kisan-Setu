Add-Type -AssemblyName System.Drawing
$b1 = [System.Drawing.Bitmap]::FromFile('C:\Users\Yatharth\.gemini\antigravity-ide\brain\7bf72dbc-bc01-4660-a0c7-e13d0da4a74b\.user_uploaded\media_1788615839361.jpg')
$p1 = $b1.GetPixel(10,10)
Write-Host "media_1788615839361.jpg RGB:" $p1.R $p1.G $p1.B
$b1.Dispose()

$b2 = [System.Drawing.Bitmap]::FromFile('C:\Users\Yatharth\.gemini\antigravity-ide\brain\d17b5f38-aee8-45de-9267-ad0c450f65e2\.user_uploaded\media_1788623745870.jpg')
$p2 = $b2.GetPixel(10,10)
Write-Host "media_1788623745870.jpg RGB:" $p2.R $p2.G $p2.B
$b2.Dispose()
