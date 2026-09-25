Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$source = Join-Path $root 'assets/share/invitation.png'
$destination = Join-Path $root 'assets/share/invitation-card.jpg'
$photo = [System.Drawing.Image]::FromFile($source)
$canvas = [System.Drawing.Bitmap]::new($photo.Width, $photo.Height)
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.DrawImage($photo, 0, 0, $photo.Width, $photo.Height)

for ($y = 0; $y -lt 600; $y++) {
    $alpha = [int](240 * (1 - $y / 600.0))
    $shade = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($alpha, 24, 31, 25))
    $graphics.FillRectangle($shade, 0, $y, $photo.Width, 1)
    $shade.Dispose()
}

function Draw-CenteredText($value, $font, $top, $height) {
    $brush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#FFF8EB'))
    $format = [System.Drawing.StringFormat]::new()
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $graphics.DrawString($value, $font, $brush, [System.Drawing.RectangleF]::new(30, $top, $photo.Width - 60, $height), $format)
    $format.Dispose()
    $brush.Dispose()
}

$title = [System.Drawing.Font]::new('Noto Serif SC', 57, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$names = [System.Drawing.Font]::new('Noto Serif SC', 62, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$date = [System.Drawing.Font]::new('Georgia', 57, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$detail = [System.Drawing.Font]::new('Noto Sans SC', 33, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$line = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#E8D9BD'), 2)

try {
    Draw-CenteredText '婚礼邀请函' $title 52 83
    Draw-CenteredText '许超  &  程昱' $names 143 90
    $graphics.DrawLine($line, 330, 247, 545, 247)
    Draw-CenteredText '2026.11.16' $date 255 74
    Draw-CenteredText '中午 12:00' $detail 330 49
    Draw-CenteredText '山东临沂 · 陶然居大酒店' $detail 385 50

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
    $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
    $parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]95)
    $canvas.Save($destination, $codec, $parameters)
    $parameters.Dispose()
} finally {
    $title.Dispose(); $names.Dispose(); $date.Dispose(); $detail.Dispose()
    $line.Dispose(); $graphics.Dispose(); $canvas.Dispose(); $photo.Dispose()
}

Write-Output $destination
