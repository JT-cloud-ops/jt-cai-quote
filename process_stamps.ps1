Add-Type -AssemblyName System.Drawing
$stamps = @{
    "jie-cai" = "stamp_jie-cai.jpg"
    "cai-xin" = "stamp_cai-xin.jpg"
    "health" = "stamp_health.jpg"
    "li-xin" = "stamp_li-xin.jpg"
}

$outputDir = "Y:\Karen_AI\quotation-app\public\stamps"
if (!(Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir }

foreach ($id in $stamps.Keys) {
    $src = "Y:\Karen_AI\" + $stamps[$id]
    $dest = "$outputDir\$id.png"
    
    if (Test-Path $src) {
        Write-Host "Processing $src..."
        $img = [System.Drawing.Image]::FromFile($src)
        $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.DrawImage($img, 0, 0)
        $g.Dispose()
        $img.Dispose()
        
        for ($y = 0; $y -lt $bmp.Height; $y++) {
            for ($x = 0; $x -lt $bmp.Width; $x++) {
                $pixel = $bmp.GetPixel($x, $y)
                if ($pixel.R -gt 230 -and $pixel.G -gt 230 -and $pixel.B -gt 230) {
                    $bmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
                }
            }
        }
        
        $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Write-Host "Successfully saved to $dest"
    } else {
        Write-Warning "Source file not found: $src"
    }
}
