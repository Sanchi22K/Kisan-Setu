Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem -Path 'C:\Users\Yatharth\.gemini\antigravity-ide\brain\7bf72dbc-bc01-4660-a0c7-e13d0da4a74b\.user_uploaded\*' -Include *.png,*.jpg
foreach ($f in $files) {
    try {
        $b = [System.Drawing.Bitmap]::FromFile($f.FullName)
        $p = $b.GetPixel(10,10)
        Write-Host "$($f.Name) RGB:" $p.R $p.G $p.B $p.A
        $b.Dispose()
    } catch {}
}
