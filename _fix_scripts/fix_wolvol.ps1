$officialKey = "sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp"
$refImgUrl = "https://sewindwolf.art/images/refs/wolvol_ref.png"
$prompt = @"
[CHARACTER REFERENCE LOCKED - MAIN SUBJECT IS WOLVOL, NOT FENGYA, NOT ANY OTHER WOLF-PERSON]
ONLY ONE visible main character: Wolvol. Wolvol is a STYLIZED ANTHROPOMORPHIC FURRY BIPEDAL HUMANOID dragon-wolf hybrid-person (NOT a real dragon, NOT a real wolf, NOT a quadruped). Character MUST match the reference image exactly.

[WOLVOL MUST-HAVE - critical identity markers, DO NOT omit any]:
1. Deep INK-BLUE / navy-blue fur all over body (NOT grey-blue, NOT silver-blue - much darker, saturated navy)
2. Two EBONY-BLACK DRAGON HORNS curving back from top of head (critical - not just wolf ears)
3. PURPLE-GOLD dragon-like pupils (NOT yellow wolf eyes, NOT orange eyes)
4. Pale seafoam-GREEN CRESCENT-MOON patterns on nose bridge (like small paint strokes)
5. Visible SCAR crossing the LEFT eye (vertical old scar line)
6. Silent minimalist expression, head tilted down focused on door handle
7. Bare clawed paws (digitigrade)

[ABSOLUTELY NOT - these belong to OTHER characters, do not draw them on Wolvol]:
- NO red maple-leaf forehead mark (that is Fengya)
- NO four-leaf-clover pendant necklace (that is Fengya)
- NO band-aid on nose bridge (that is Fengya)
- NO light grey-blue or silvery wolf fur (that is Fengya)
- NO white hoodie with clover logo (that is Fengya)
- NO golden wolf eyes (that is Fengya)

[OUTFIT LOCKED]: dark charcoal / black long tunic, leather harness strap across chest, worn brown travel cloak pooled at his feet, no shoes (bare clawed feet).

Scene: Wolvol's stone cottage exterior in Emberkeep eastern old alley. He is kneeling on one knee beside a rustic wooden door, one clawed hand gripping a corroded brass door handle, the other hand holding a small rag mid-polish. Weathered stone walls with moss patches, cobblestone path, a rusted empty wooden mailbox mounted next to the door.

Secondary element (far background, VERY small, extremely blurred): a distant silhouette of an anthropomorphic BIPEDAL HUMANOID black-and-tan shiba-inu dog-person running past the alley mouth - he is Aki the mail courier. MUST-HAVE for Aki even though tiny: BLACK back fur + TAN/ORANGE belly, RED COLLAR around neck (visible as a small red dot), messenger satchel strap. NOT a feral orange shiba dog. Size: less than 5 percent of frame, motion-blurred, just a tiny glimpse - Wolvol sees him peripherally but does NOT turn his head.

Easter egg (tiny): a small grey sparrow perched on a low stone ledge holding a reddish-orange MAPLE LEAF in its beak (NOT a flower, NOT a rose, specifically a pointed 5-lobed maple leaf shape). Grey body, white belly. Very small, background element.

Composition: low-angle medium shot, Wolvol fills right two-thirds of frame at eye level kneeling. Rule of thirds - Wolvol off-center right, door frame on right edge, alley vanishing left with distant running figure tiny in far distance. Late morning sunlight warm diagonal rays from upper left.

Art style: semi-realistic fantasy furry illustration, cool navy/ink-blue tones with warm amber sunlight accents, painterly cel-shaded.

[NEGATIVE]: NO duplicate Wolvol, NO Fengya-like appearance on main character, NO wrong fur color, NO missing horns, NO missing scar, NO missing crescent nose pattern, NO feral dog instead of Aki, NO missing red collar on Aki, NO flower or rose in bird beak (must be maple leaf), NO real animals, NO quadrupeds, NO human faces.
"@
$imgUrl = $null
for ($i = 1; $i -le 3; $i++) {
  try {
    Write-Host "Official attempt $i (wolvol FIX)..."
    $boundary = [System.Guid]::NewGuid().ToString()
    $ct = "multipart/form-data; boundary=$boundary"
    $bodyLines = @("--$boundary", 'Content-Disposition: form-data; name="prompt"', "", $prompt, "--$boundary", 'Content-Disposition: form-data; name="model"', "", "nano-banana-pro", "--$boundary", 'Content-Disposition: form-data; name="mode"', "", "image-to-image", "--$boundary", 'Content-Disposition: form-data; name="aspectRatio"', "", "16:9", "--$boundary", 'Content-Disposition: form-data; name="imageSize"', "", "1K", "--$boundary", 'Content-Disposition: form-data; name="imageUrl"', "", $refImgUrl, "--$boundary--")
    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes(($bodyLines -join "`r`n"))
    $submitResp = Invoke-RestMethod -Uri "https://nanobananapro.cloud/api/v1/image/nano-banana" -Method POST -Headers @{"Authorization"="Bearer $officialKey"} -Body $bodyBytes -ContentType $ct -TimeoutSec 30
    $taskId = $submitResp.data.id
    Write-Host "taskId=$taskId"
    for ($j = 1; $j -le 30; $j++) {
      Start-Sleep -Seconds 5
      $pollResp = Invoke-RestMethod -Uri "https://nanobananapro.cloud/api/v1/image/nano-banana/result" -Method POST -Headers @{"Authorization"="Bearer $officialKey"; "Content-Type"="application/json"} -Body (@{taskId=$taskId} | ConvertTo-Json) -TimeoutSec 15
      if ($pollResp.data.status -eq "succeeded") { $imgUrl = $pollResp.data.results[0].url; break }
      if ($pollResp.data.status -eq "failed") { break }
    }
    if ($imgUrl) { break }
  } catch { if ($i -lt 3) { Start-Sleep -Seconds 10 } }
}
Write-Host "WOLVOL_FIX_IMG_URL=$imgUrl"
$imgUrl | Out-File "C:\Users\Administrator\sewindwolf-site\_fix_scripts\wolvol_url.txt" -Encoding UTF8
