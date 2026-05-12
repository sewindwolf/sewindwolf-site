// Merge D32 Noon 6 posts into posts.json
const fs = require('fs');

const urls = {
  fengya:  'https://file.nanobananapro.cloud/20260425/c73b486df77f49c5af22d4b6d27dba6a.png',
  yufeng:  'https://file.nanobananapro.cloud/20260425/a4705ae3bcd144fd8fed68072c404677.png',
  tilion:  'https://file.nanobananapro.cloud/20260425/7427864ed794442b897a2d3a4d5c3b82.png',
  foxlanz: 'https://file.nanobananapro.cloud/20260425/3ec63224fc4d460d80a16a978972ea83.png',
  aki:     'https://file.nanobananapro.cloud/20260425/7a60368467f746e092bb63b2ae6f133d.png',
  wolvol:  'https://file.nanobananapro.cloud/20260425/94dc9756db23475895778956b22ba3e3.png'
};

const posts = [
  // 1. 风亚 - 广角环境主导 / 仰视穹顶（从海底洞穴走出来到穹顶第一眼）
  {
    id: "post_20260425_140000_fengya",
    character: "风亚",
    character_en: "Feng Ya",
    world: "潮汐湾",
    avatar_color: "#4a7fa5",
    avatar_symbol: "🐺",
    mood: "surprised",
    location: "地下海·穹顶·北岸水线",
    game_time: "第32天·正午",
    timestamp: "2026-04-25T14:00:00+08:00",
    content: "水下那截洞走到头，头顶的石壁忽然一下子开了。\n\n整个人走进一个……不知道叫什么的地方。\n\n一个巨大的圆顶。顶上六道光，从顶心往外射，每一道颜色都不一样——青、蓝、金、银、绿，还有一道，末端是一个我见过的形状。沃的角。\n\n底下是水。水很静。静得像一面镜子，把上面那个圆顶又倒着映了一遍，所以我现在脚下也是一个圆顶。两个。叠着。\n\n我没有动。裸爪贴在湿石上。\n\n脚脖子这一圈水温的。\n\n山那头的人——应该也到了。",
    image_url: urls.fengya,
    tags: ["潮汐湾", "地下海", "主线", "穹顶", "第32天"],
    reactions: { heart: 186, paw: 124, star: 82 },
    comments: []
  },
  // 2. 羽烽 - 侧身远景 / 第一次看见对岸的提理安狐兰兹（吐槽）
  {
    id: "post_20260425_140100_yufeng",
    character: "羽烽",
    character_en: "Yu Feng",
    world: "潮汐湾",
    avatar_color: "#c8a84b",
    avatar_symbol: "🐯",
    mood: "surprised",
    location: "地下海·穹顶·北岸",
    game_time: "第32天·正午",
    timestamp: "2026-04-25T14:01:00+08:00",
    content: "跟着他进来的。\n\n站稳了抬头。看了两秒。没话。\n\n眼睛往对岸扫了一下——\n\n一头鹿。一只狐狸。\n\n鹿戴圆圈儿。狐狸蓝眼睛。\n\n……\n\n我转头看风亚。风亚盯着顶上没反应。\n\n再转回去确认了一遍。\n\n没看错。就是那头鹿和那只狐狸。在一个地下巨坑的对面。\n\n「——喂。」\n\n我喊了一声。我自己声音在这个坑里回了七下。\n\n对岸鹿抬了一下头。\n\n还真是他。",
    image_url: urls.yufeng,
    tags: ["潮汐湾", "地下海", "吐槽", "穹顶", "第32天"],
    reactions: { heart: 172, paw: 112, star: 68 },
    comments: []
  },
  // 3. 提理安 - 俯视广角 / 从火种室石阶鸟瞰全场
  {
    id: "post_20260425_140200_tilion",
    character: "提理安",
    character_en: "Tilion",
    world: "炉火镇",
    avatar_color: "#7a8c6e",
    avatar_symbol: "🦌",
    mood: "calm",
    location: "地下海·穹顶·南阶最后一级",
    game_time: "第32天·正午",
    timestamp: "2026-04-25T14:02:00+08:00",
    content: "下了九十二级。\n\n最后一级石阶踏出去之前，先听见水声。然后是回声——有人在对面喊了一声，像是风亚的声音。我先愣了一下，旋即笑出声。\n\n往下看。\n\n整个炉火镇和半个潮汐湾都塞在这个球里了。\n\n正中一块黑岩小岛，小岛上立着一块墓碑模样的石头，石头旁站一个影子——深蓝色的，背冲我，肩膀上是龙角。不用靠近也知道是谁。\n\n对岸两个人——白斗篷那个正朝我这边比划，另一个站得笔直，像在复核他没看错。\n\n雪羽从我肩上飞下去一圈又回来。这只平时金贵得很的鸟这会儿安静了。\n\n顶上六道光。我数了两遍。\n\n——原来是六个人。\n\n我吹了半个调子的笛，没吹完。先不打扰。",
    image_url: urls.tilion,
    tags: ["炉火镇", "地下海", "主线", "六人汇合", "第32天"],
    reactions: { heart: 195, paw: 132, star: 88 },
    comments: []
  },
  // 4. 狐兰兹 - 极近景手部特写 / 独立辨认古字（成长㉖）
  {
    id: "post_20260425_140300_foxlanz",
    character: "狐兰兹",
    character_en: "Foxlanz",
    world: "炉火镇",
    avatar_color: "#b5632a",
    avatar_symbol: "🦊",
    mood: "thinking",
    location: "地下海·穹顶·南岸壁画前",
    game_time: "第32天·正午",
    timestamp: "2026-04-25T14:03:00+08:00",
    content: "【成长记录 第二十六条】\n\n下到底之后没去对岸。先走到南侧壁画跟前。\n\n这面墙太大，我视线先是散了一下，才定在右下第一组刻纹上。\n\n——看懂了。\n\n不是全部看懂。是其中四个词。\n\n「两极」。「同根」。「守」。还有一个，「第六」。\n\n用我昨晚在窄门石阶上拓下来那些古字对照着，一个一个地对。第三个字我不敢肯定，转头想问提理安，提理安在九十二级台阶上还没下完。\n\n我自己对了第三遍。\n\n是「守」。\n\n指甲沿着那道凿痕描了一下。石头是温的。\n\n——\n\n笔记本翻新的一页，我写下：「第32天 正午 南墙 自辨四字 无人在旁 确认」。\n\n耳朵没夹。这一次是，我不想夹。",
    image_url: urls.foxlanz,
    tags: ["炉火镇", "地下海", "成长记录", "狐兰兹", "第32天"],
    reactions: { heart: 208, paw: 142, star: 95 },
    comments: []
  },
  // 5. 旻 - 过肩动态 / 首次亲眼见到沃弗尔（传说变现实）
  {
    id: "post_20260425_140400_aki",
    character: "旻",
    character_en: "Aki",
    world: "炉火镇",
    avatar_color: "#2a6b4a",
    avatar_symbol: "🐕",
    mood: "surprised",
    location: "地下海·穹顶·南阶半腰",
    game_time: "第32天·正午",
    timestamp: "2026-04-25T14:04:00+08:00",
    content: "我是跟着提理安和狐——狐兰兹先生——偷偷下来的。\n\n他们下得慢。我每一阶都贴墙走。\n\n下到第六十阶的时候，石壁开了一口。我从这口子里探头——\n\n天哪。\n\n天哪天哪天哪。\n\n下面那个——\n\n就是裁缝大婶说的那个——\n\n「深蓝毛、龙角、眼睛紫金的先生」——\n\n真的有。真的有！\n\n他一个人站在中间那块石头上，手按在一块墓碑一样的黑石头顶。影子被灯光打得老长。\n\n我嘴张着没合上。舌头都忘了伸。\n\n——后来我才反应过来——对岸还有两个人。风亚哥哥，和那个有两只不同颜色眼睛的白老虎先生。\n\n全到齐了。\n\n我这个信使——居然是最后一个知道的。\n\n包扣又崩了一下。没人看见。",
    image_url: urls.aki,
    tags: ["炉火镇", "地下海", "旻", "首次相见", "第32天"],
    reactions: { heart: 215, paw: 148, star: 98 },
    comments: []
  },
  // 6. 沃弗尔 - 低角英雄镜头 / 五人剪影围绕的静止瞬间
  {
    id: "post_20260425_140500_wolvol",
    character: "沃弗尔",
    character_en: "Wolvol",
    world: "炉火镇",
    avatar_color: "#2a3d6b",
    avatar_symbol: "🐲",
    mood: "calm",
    location: "地下海·穹顶·中央岛·石碑旁",
    game_time: "第32天·正午",
    timestamp: "2026-04-25T14:05:00+08:00",
    content: "海的那头走出来两个人。\n\n山的那头下来了两个人。\n\n半路停了半只小东西。\n\n沃没动。\n\n手还在石碑上。石碑比早上更温。\n\n对面那个喊了一声。回声七道。\n\n顶上六道光。\n\n加沃。\n\n——\n\n「沃会找到的。」\n\n沃一直以为，石碑是对着沃写的。\n\n现在知道不是。\n\n是他——泽罗恩——在告诉所有六个人：「等等他。」",
    image_url: urls.wolvol,
    tags: ["炉火镇", "地下海", "沃弗尔", "六人汇合", "泽罗恩", "第32天"],
    reactions: { heart: 228, paw: 156, star: 108 },
    comments: []
  }
];

const paths = [
  'C:/Users/Administrator/sewindwolf-site/data/posts.json',
  'C:/Users/Administrator/sewindwolf-site/public/data/posts.json'
];

for (const p of paths) {
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  const existingIds = new Set(data.map(x => x.id));
  let added = 0;
  for (const np of posts) {
    if (!existingIds.has(np.id)) {
      data.push(np);
      added++;
    }
  }
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[${p}] total=${data.length}, added=${added}`);
}
