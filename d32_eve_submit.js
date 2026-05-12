// 第32天·暮色将至 波次生图提交（6条）
// 官方 Nano Banana Pro image-to-image 模式
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp';
const API_URL = 'https://nanobananapro.cloud/api/v1/image/nano-banana';

const REF_BASE = 'https://sewindwolf.art/images/refs/';
const REFS = {
  fengya: REF_BASE + 'fengya_ref.png',
  tilion: REF_BASE + 'tilion_ref.png',
  foxlanz: REF_BASE + 'foxlanz_ref.png',
  yufeng: REF_BASE + 'yufeng_ref.png',
  aki: REF_BASE + 'aki_ref.png',
  wolvol: REF_BASE + 'wolvol_ref.png'
};

// 6条推送的生图 prompt
const STYLE_PREFIX = 'STYLIZED ANTHROPOMORPHIC FURRY character in semi-realistic fantasy furry illustration style, painterly, warm cinematic lighting. All characters are BIPEDAL HUMANOID furry — NO real animals, NO feral creatures, NO quadrupeds, NO animal silhouettes. ';
const NEG = ' NEGATIVE: photorealistic human, bare torso, wrong species, duplicate character, extra limbs, extra hands, distorted anatomy, quadruped, feral animal, real animal, realistic bird, photorealistic bird, real sparrow, real pigeon, real dove, realistic feathers';

const tasks = [
  // 1. 风亚 — 双人视角·过肩镜头·看羽烽回头喊
  {
    name: 'fengya',
    imageUrl: [REFS.fengya, REFS.yufeng],
    prompt: STYLE_PREFIX +
      '[MAIN CHARACTER from Image 1: BIPEDAL HUMANOID grey wolf-person Fengya — slate-blue-grey fur, red maple-leaf birthmark on forehead, bandaid on nose bridge, four-leaf clover pendant, BARE clawed hands/feet NO gloves NO boots, wearing his usual brown vest and simple dark pants]. ' +
      '[SECONDARY from Image 2: BIPEDAL HUMANOID white tiger-person Yufeng — heterochromia right-gold left-green eyes, spiky black hair, wearing flowing fantasy warrior white robe with large white cloak (NOT Greek style, green hair tips NOT laurel wreath), BIPEDAL NOT a real tiger]. ' +
      'Over-the-shoulder composition: camera behind Fengya\'s left shoulder. Fengya in foreground (40% of frame), his right ear and shoulder blurred out-of-focus in the corner, he stands barefoot at the edge of a huge underground cave lake, looking slightly sideways. Yufeng in mid-ground to his right, one step behind, cupping hand around mouth having just shouted across the water — echoing sound depicted as subtle ripple rings on the mirror-still lake surface. ' +
      'Setting: vast spherical underground sea cavern (hidden cavern beneath Emberkeep\'s fire room and Tidal Bay\'s seabed). Six beams of light radiate from an apex ceiling dome — teal, blue, gold, silver, green, and one beam ending in an antler-shape. The still black lake water mirrors the dome, creating a double-dome illusion. Opposite far shore barely visible as silhouettes across the water. Cool silver-blue moonlight ambience with warm amber rim on Fengya\'s fur. ' +
      'Mood: quiet awe, steady. Fengya is NOT looking directly at Yufeng, looking at the far shore instead — emotion: "the one on the mountain side has arrived too." ' +
      'Only TWO characters in the scene.' + NEG
  },
  // 2. 羽烽 — 低角度仰拍·看顶上六束光
  {
    name: 'yufeng',
    imageUrl: [REFS.yufeng],
    prompt: STYLE_PREFIX +
      '[MAIN CHARACTER from Image 1: BIPEDAL HUMANOID white tiger-person Yufeng — heterochromia right-gold left-green eyes, wide round face, spiky black hair with green tips, wearing his fixed combat outfit: flowing fantasy warrior white robe + large white cloak (NOT Greek tunic), BIPEDAL NOT a real tiger]. ' +
      'Low-angle extreme upward shot — camera at knee level shooting up past his jaw. He tilts his head back to look at the apex of the underground dome. We see the underside of his chin, the sweep of his white cloak rippling above like wings, and behind his silhouette the six radiating beams of light from the dome apex: teal, blue, gold, silver, green, and one beam ending in an antler-shape. His right gold eye catches the gold beam, his left green eye catches the green beam — a visual rhyme. ' +
      'Setting: underground spherical sea cavern, apex 40 meters overhead, dome carved with ancient spiral reliefs glowing faintly. ' +
      'Mood: stunned quiet — he just shouted and heard his own voice echo seven times. Tiny parted lips. His left hand unconsciously grips the edge of his cloak. ' +
      'Composition: vertical framing, Dutch-tilt about 10 degrees to emphasize vertigo. Only ONE character in the scene.' + NEG
  },
  // 3. 提理安 — 环境主导镜头·吹笛+穹顶六光扩散（广角远景）
  {
    name: 'tilion',
    imageUrl: [REFS.tilion],
    prompt: STYLE_PREFIX +
      '[MAIN CHARACTER from Image 1: BIPEDAL HUMANOID grey reindeer-person Tilion — light grey fur, large branching antlers, silver circlet headband, green-and-gold cloak, tall dark-brown military boots, holding a wooden flute to his lips, BIPEDAL NOT a real deer]. ' +
      'Wide environmental establishing shot — camera far back and slightly elevated, Tilion small in the lower-right third of the frame (only 15% of frame height), standing on the last stone step of a stairway that descends into the spherical underground cavern. He is bringing a wooden flute halfway to his lips — about to play but paused. White dove "Snowfeather" hovering near his shoulder in silhouette. ' +
      'Environment dominates: vast dome cavern, six radiating beams of light from the apex (teal, blue, gold, silver, green, antler-shape) spreading like a mandala across the dome, reflecting in the mirror-still black lake water below to create a doubled halo. Ancient carved spirals on the stone walls pulse with faint cyan-green light in a three-beat pulse. Across the lake, tiny distant figures visible on the opposite shore and on a central black-stone islet. ' +
      'Color: cool teal-and-indigo cavern with amber warm glow from the flute-hand. Painterly wide vista, chiaroscuro. ' +
      'Mood: awe + quiet understanding — "two poles connected". Only ONE main character, background silhouettes are distant (<5% each) and unrecognizable.' + NEG
  },
  // 4. 狐兰兹 — 近脸特写·手按壁画
  {
    name: 'foxlanz',
    imageUrl: [REFS.foxlanz],
    prompt: STYLE_PREFIX +
      '[MAIN CHARACTER from Image 1: BIPEDAL HUMANOID red-brown fox-person Foxlanz — red-brown fur, bright blue eyes, white-tipped fluffy tail, DARK-BROWN-BLACK Celtic spiral tattoo on the cheek (NOT blue), colorful bead pouch on hip, rope-knot wristband, BARE red-brown claws NO gloves, wearing BLACK sleeveless leather vest (open front) + BLUE DENIM JEANS (NOT brown travel gear), small fire-charm wooden pendant around neck]. ' +
      'Close-up three-quarter face portrait — camera at eye level, slightly offset to his right, shallow depth of field. His right hand (bare red-brown claws, clearly visible fingertip tracing a carved spiral groove) is pressed flat against a massive ancient stone wall that fills the entire background. His blue eyes fixed intently on the carvings — NOT on the camera, NOT on the viewer. His ears stand UP straight (not folded) — this is the character growth moment: focus not nerves. ' +
      'Wall detail: huge carved ancient runes and spiral glyphs, four specific glyphs subtly highlighted with faint teal-green bioluminescence glow near his fingertip. ' +
      'Color: muted blue-grey stone, warm red-brown fur subject pops against cool background, a single teal-green rim light from the glyph. ' +
      'Mood: quiet confidence, focused analytical stare. Soft parted lips. Only ONE character in the scene.' + NEG
  },
  // 5. 旻 — 动态镜头·跑下石阶走向沃弗尔（交信前）
  {
    name: 'aki',
    imageUrl: [REFS.aki, REFS.wolvol],
    prompt: STYLE_PREFIX +
      '[MAIN CHARACTER from Image 1: BIPEDAL HUMANOID black Shiba-dog-person Aki — black-to-orange gradient fur, yellow eyebrow dots, RED collar with small bell, cross-body satchel bag (currently half-open with letters spilling), bandage wrappings on ankles, bright blue eyes, wearing tea-brown work vest + white sleeveless hoodie + tea-brown work shorts, BIPEDAL NOT a real shiba]. ' +
      '[SECONDARY from Image 2: BIPEDAL HUMANOID dragon-wolf hybrid Wolvol — deep navy-blue fur, ebony dragon horns, purple-gold dragon eyes, crescent teal-green nose-bridge markings, scar on left eye, minimalist dark outfit, standing very still beside a black stone monolith. BIPEDAL HUMANOID (NOT a quadruped, NOT a real wolf/dragon)]. ' +
      'Dynamic action shot — camera at low angle, motion-blur trail behind Aki\'s feet. Aki running/half-jumping forward down the last few stone steps toward Wolvol, his satchel flopping and one letter visibly airborne mid-flight beside him, tongue half-out from running. He is in the FOREGROUND (50% of frame) mid-stride, leaning forward, one paw reaching into his satchel pulling out a sealed letter envelope marked "炉火镇·有缘人收". Wolvol stands motionless in mid-ground on a small central black stone island, his hand resting on a tombstone-like stone slab, turned halfway toward Aki — first eye contact between them. ' +
      'Setting: central island of the underground dome cavern, cool teal-blue ambient light from overhead six-beam dome, warm amber floor reflection from the still black lake water. ' +
      'Mood: breathless nervous excitement on Aki (ears up, tongue out, big blue eyes), calm stillness on Wolvol. Only TWO characters in the scene.' + NEG
  },
  // 6. 沃弗尔 — 近脸特写·接过信封瞬间·首次说话
  {
    name: 'wolvol',
    imageUrl: [REFS.wolvol, REFS.aki],
    prompt: STYLE_PREFIX +
      '[MAIN CHARACTER from Image 1: BIPEDAL HUMANOID dragon-wolf hybrid Wolvol — deep navy-blue (ink-blue) fur, ebony dragon horns curving backward, purple-gold dragon eyes (irises glow faintly), teal-green crescent-moon markings on nose bridge, thin scar across left eye, minimalist sleeveless dark outfit, BIPEDAL HUMANOID (NOT a quadruped, NOT a real wolf, NOT a real dragon)]. ' +
      '[SECONDARY from Image 2: BIPEDAL HUMANOID black Shiba-dog-person Aki — small, black-orange gradient fur, red collar, bright blue eyes, holding out a sealed letter envelope. BIPEDAL HUMANOID NOT a real shiba]. ' +
      'Close-up face-and-shoulder portrait of Wolvol — camera slightly low, tilted up to his face. His right hand just lifted from the tombstone-like stone slab (fingertips still touching the top edge), his left hand extending outward toward the bottom of the frame where a small black shiba paw (Aki\'s, only his wrist+paw visible in the corner) presents an envelope marked "炉火镇·有缘人收". Wolvol\'s purple-gold eyes meet Aki\'s from above — first direct eye contact. His mouth just barely parted — about to speak ("不是给沃的。是给你的。"). ' +
      'Behind Wolvol: the central black stone monolith engraved with three lines of ancient script glowing faintly teal-green, slightly out of focus. Further back: the dome ceiling\'s six-beam light, the antler-shaped beam notably falling across Wolvol\'s horns. ' +
      'Color: cool deep-teal cavern palette dominated, single warm-gold highlight on Wolvol\'s left eye catching the gold beam from above. ' +
      'Mood: quiet revelation — the stillest moment of the whole arc, the character who had zero friends suddenly being handed something. Wolvol is the MAIN focus (70% of frame), Aki is only a hand+paw in the corner.' + NEG
  }
];

async function submitTask(task) {
  const form = new FormData();
  form.append('prompt', task.prompt);
  form.append('model', 'nano-banana-pro');
  form.append('aspectRatio', '16:9');
  if (Array.isArray(task.imageUrl)) {
    task.imageUrl.forEach(u => form.append('imageUrl', u));
  } else {
    form.append('imageUrl', task.imageUrl);
  }
  const resp = await fetch(API_URL, {
    method: 'POST',
    body: form,
    headers: { 'Authorization': 'Bearer ' + API_KEY }
  });
  const text = await resp.text();
  try { return JSON.parse(text); } catch { return { raw: text, status: resp.status }; }
}

(async () => {
  const results = {};
  for (const t of tasks) {
    try {
      console.log('[SUBMIT]', t.name);
      const r = await submitTask(t);
      console.log('  =>', JSON.stringify(r).slice(0, 200));
      results[t.name] = r;
      fs.writeFileSync(`d32_eve_task_${t.name}.json`, JSON.stringify(r, null, 2));
    } catch (e) {
      console.error('[FAIL]', t.name, e.message, e.response?.data);
      results[t.name] = { error: e.message, data: e.response?.data };
    }
  }
  fs.writeFileSync('d32_eve_all_tasks.json', JSON.stringify(results, null, 2));
  console.log('DONE');
})();
