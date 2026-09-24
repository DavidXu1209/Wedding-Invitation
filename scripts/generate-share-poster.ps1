Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$source = Join-Path $root 'assets/photos/69b05db0516e58a3d5ec9a98a6cbc1a7.jpg'
$destination = Join-Path $root 'assets/share/invitation.jpg'

$canvas = [System.Drawing.Bitmap]::new(1080, 1920)
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$photo = [System.Drawing.Image]::FromFile($source)
$cream = [System.Drawing.ColorTranslator]::FromHtml('#F0E7D5')
$muted = [System.Drawing.ColorTranslator]::FromHtml('#D1C3A9')
$olive = [System.Drawing.ColorTranslator]::FromHtml('#292D24')
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear($olive)

function Draw-CenteredText($value, $font, $color, $top, $height) {
    $brush = [System.Drawing.SolidBrush]::new($color)
    $format = [System.Drawing.StringFormat]::new()
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $graphics.DrawString($value, $font, $brush, [System.Drawing.RectangleF]::new(60, $top, 960, $height), $format)
    $format.Dispose()
    $brush.Dispose()
}

$serifTitle = [System.Drawing.Font]::new('Noto Serif SC', 72, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$serifNames = [System.Drawing.Font]::new('Noto Serif SC', 52, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$serifDate = [System.Drawing.Font]::new('Georgia', 58, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$sansVenue = [System.Drawing.Font]::new('Noto Sans SC', 39, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$sansDetail = [System.Drawing.Font]::new('Noto Sans SC', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$english = [System.Drawing.Font]::new('Georgia', 27, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)

try {
    $framePen = [System.Drawing.Pen]::new($muted, 2)
    $graphics.DrawRectangle($framePen, 43, 43, 994, 1834)
    $graphics.DrawLine($framePen, 375, 102, 705, 102)
    Draw-CenteredText '婚礼邀请函' $serifTitle $cream 122 94
    Draw-CenteredText 'THE WEDDING OF' $english $muted 222 45
    Draw-CenteredText '许超  &  程昱' $serifNames $cream 272 68

    $matBrush = [System.Drawing.SolidBrush]::new($cream)
    $graphics.FillRectangle($matBrush, 104, 356, 872, 1152)
    $matBrush.Dispose()
    $graphics.DrawImage(
        $photo,
        [System.Drawing.Rectangle]::new(120, 372, 840, 1120),
        [System.Drawing.Rectangle]::new(230, 600, 960, 1280),
        [System.Drawing.GraphicsUnit]::Pixel
    )

    Draw-CenteredText '2026.11.16' $serifDate $cream 1538 80
    Draw-CenteredText '星期一  ·  中午 12:00' $sansDetail $muted 1623 50
    $graphics.DrawLine($framePen, 390, 1697, 690, 1697)
    Draw-CenteredText '山东临沂 · 陶然居大酒店' $sansVenue $cream 1725 65
    Draw-CenteredText '兰山区陶然路163号 · 请从南门进入' $sansDetail $muted 1800 48
    $framePen.Dispose()

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
    $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
    $parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]92)
    $canvas.Save($destination, $codec, $parameters)
    $parameters.Dispose()
} finally {
    $serifTitle.Dispose(); $serifNames.Dispose(); $serifDate.Dispose()
    $sansVenue.Dispose(); $sansDetail.Dispose(); $english.Dispose()
    $photo.Dispose(); $graphics.Dispose(); $canvas.Dispose()
}

Write-Output $destination
