$officialKey = "sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp"
$refImgUrl = "https://sewindwolf.art/images/refs/foxlanz_ref.png"
$prompt = @"
[CHARACTER REFERENCE LOCKED] STYLIZED ANTHROPOMORPHIC FURRY character. BIPEDAL HUMANOID red fox-person (NOT a real fox, NOT a quadruped). Character must match the reference image exactly.

[FOXLANZ MUST-HAVE]:
1. Reddish-brown fox fur with white chest/belly
2. Bright BLUE eyes
3. BROWN Celtic-style tribal tattoo patterns on face/neck/shoulders/arms (earth-tone brown, visible directly on skin/fur - NOT covered by gloves or sleeves)
4. WHITE-TIPPED fluffy fox tail
5. REDDISH-BROWN front paws (bare digitigrade claws, just simple ankle wraps - NO gloves, NO shoes, NO leather bracers)
6. Colorful trinkets/charms dangling from belt (fire-flame ceramic charm visible)
7. Colorful BRAIDED ROPE BRACELETS on wrists (thin colorful threads, not leather straps)

[OUTFIT STRICTLY LOCKED - match reference image exactly, DO NOT IMPROVISE]:
- DARK LEATHER VEST (black or very dark brown) worn over BARE CHEST showing chest fur and tattoos - NOT a white tunic, NOT an off-white shirt, NOT a medieval adventurer outfit
- BLUE DENIM JEANS (modern blue jeans, visible denim texture) - NOT brown trousers, NOT medieval canvas pants
- Belt with colorful small charms/trinkets hanging
- Bare digitigrade paws with simple fabric ankle wraps ONLY
- Modern-traveler look, NOT fantasy-adventurer, NOT RPG-rogue look
- NO red gloves, NO leather gauntlets, NO arm bracers covering the tattoos, NO backpack straps covering chest
- Arms are BARE showing the celtic tattoos - do not draw sleeves

[BODY TYPE]: Lean slim athletic young traveler, NOT bulky.

Composition: dynamic medium shot, action mid-moment. Rule of thirds. Foxlanz in a squat position with ears FULLY PERKED UP (not flattened!), helping prop up the wooden shaft of a large wooden hoe from below with both bare-paw hands - his face showing earnest focus, mouth slightly open mid-pun-forming, slight blush visible through face fur. Tail sticking out for balance, white tip visible.

Scene: Emberkeep main street blacksmith stall, warm noon sunlight. Beside Foxlanz: a burly dark-brown bear-person blacksmith (Lao He) in a leather apron, massive paw gripping the top of the hoe, expression mildly amused/surprised by fox's eagerness. Background: blurred pottery stall, bread stall, wooden fence, cobblestones, a few townspeople.

Easter egg: tiny grey sparrow perched on the wooden fence post, holding a reddish-orange MAPLE LEAF in its beak (5-lobed pointed maple-leaf shape with characteristic palm-like shape, NOT a flower, NOT a rose, NOT a round bloom). Small unobtrusive detail.

Art style: semi-realistic fantasy furry illustration, warm medieval palette, painterly cel-shaded, bright saturated colors.

[NEGATIVE]: NO white tunic, NO off-white shirt, NO brown medieval trousers, NO red gloves, NO leather bracers covering arm tattoos, NO adventurer RPG outfit, NO boots, NO sleeves covering tattoos, NO flower/rose in bird beak (MUST be maple leaf), NO real fox, NO quadruped, NO human face, NO duplicate figures.
"@
$imgUrl = $null
for ($i = 1; $i -le 3; $i++) {
  try {
    Write-Host "Official attempt $i (foxlanz FIX)..."
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
Write-Host "FOXLANZ_FIX_IMG_URL=$imgUrl"
$imgUrl | Out-File "C:\Users\Administrator\sewindwolf-site\_fix_scripts\foxlanz_url.txt" -Encoding UTF8
