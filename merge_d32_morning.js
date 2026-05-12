// 合并第32天晨光6条推送到posts.json
const fs = require('fs');

const urls = {
  fengya: 'https://file.nanobananapro.cloud/20260425/f4bf881163d5481d85209e08e5c02562.png',
  yufeng: 'https://file.nanobananapro.cloud/20260425/15e0b628404e41cab55dd6ec04224e43.png',
  tilion: 'https://file.nanobananapro.cloud/20260425/073207224d0d414b886ac5c3ce15a135.png',
  foxlanz: 'https://file.nanobananapro.cloud/20260425/d5ac64f53faf4b009972b18082e067a4.png',
  aki: 'https://file.nanobananapro.cloud/20260425/8a7d68a9eade4568af5ddd8e54f43e4e.png',
  wolvol: 'https://file.nanobananapro.cloud/20260425/dfe31a1b605e436196f530fc6ebf0c93.png'
};

const posts = [
  {
    id: "post_20260425_080000_fengya",
    character: "风亚",
    character_en: "Feng Ya",
    world: "潮汐湾",
    avatar_color: "#4a7fa5",
    avatar_symbol: "🐺",
    mood: "calm",
    location: "潮汐湾·搁浅礁东侧·海底洞穴入口内第三阶",
    game_time: "第32天·涨潮·晨",
    timestamp: "2026-04-25T08:00:00+08:00",
    content: "水下第三阶。\n\n洞壁上那圈蓝绿色螺旋纹随着我往下走一格就亮一格，跟火种室那次一模一样——但这里是海水里。裸爪踩在石阶上，石头温的。前面有一根柱石，齐我肩高，柱顶上蹲着一团暗蓝色的火，像一盏没点着的灯。\n\n我按上去了。\n\n三心跳之后多出半拍的那个节奏，一下子补齐成稳稳的四拍。柱顶那团火炸开一下，整个洞壁从脚下往上亮起来，连头顶水面都跟着晃。\n\n山那边，这时候应该也开了。\n\n旻给的那封信在内袋贴着胸口，没拿出来。羽烽在洞口台阶上替我看着水。",
    image_url: urls.fengya,
    tags: ["潮汐湾", "主线", "山海同步", "第32天"],
    reactions: { heart: 142, paw: 96, star: 54 },
    comments: []
  },
  {
    id: "post_20260425_080100_yufeng",
    character: "羽烽",
    character_en: "Yu Feng",
    world: "潮汐湾",
    avatar_color: "#c8a84b",
    avatar_symbol: "🐯",
    mood: "calm",
    location: "潮汐湾·搁浅礁东侧·洞口石阶",
    game_time: "第32天·涨潮·晨",
    timestamp: "2026-04-25T08:01:00+08:00",
    content: "他下去了。\n\n我坐在石阶上，腿伸直，斗篷压在屁股底下防潮。背着两个人的包。他的那个比我的重，奇怪。\n\n海面下蓝绿色的光打着转，一圈一圈往下收。看着看着就变亮了——亮了两次。\n\n身后礁石缝里卡了半只海胆。\n\n这几天吃鱼吃得头发都腥了。",
    image_url: urls.yufeng,
    tags: ["潮汐湾", "日常", "等待", "第32天"],
    reactions: { heart: 88, paw: 58, star: 28 },
    comments: []
  },
  {
    id: "post_20260425_080200_tilion",
    character: "提理安",
    character_en: "Tilion",
    world: "炉火镇",
    avatar_color: "#7a8c6e",
    avatar_symbol: "🦌",
    mood: "surprised",
    location: "炉火镇·矿坑第四支道·火种室",
    game_time: "第32天·晨光时分",
    timestamp: "2026-04-25T08:02:00+08:00",
    content: "地板开了。\n\n不是'裂了'——是'开了'。昨晚那条裂缝今早蹲下来看的时候已经跟我手掌一样宽，我正准备拓一张图，石头自己动了。\n\n三块石板按三下一停的节奏一块块往两边退，像有人在底下把它们一块块推开。退到最后，底下露出一截往下走的石阶——靛蓝色的光从下面漫上来，打在雪羽的翅膀上，这只平时话不多的鸟今天甚至没叫。\n\n我回头看了一眼狐兰兹，那小狐狸站在原地耳朵竖着，嘴张开一半又合上。\n\n炉火镇的门，今天也开着呢——只不过这一回，是地板开的。\n\n我们准备下去。",
    image_url: urls.tilion,
    tags: ["炉火镇", "主线", "火种室", "第32天"],
    reactions: { heart: 126, paw: 84, star: 48 },
    comments: []
  },
  {
    id: "post_20260425_080300_foxlanz",
    character: "狐兰兹",
    character_en: "Foxlanz",
    world: "炉火镇",
    avatar_color: "#b5632a",
    avatar_symbol: "🦊",
    mood: "surprised",
    location: "炉火镇·矿坑第四支道·火种室",
    game_time: "第32天·晨光时分",
    timestamp: "2026-04-25T08:03:00+08:00",
    content: "早上出发前我路过烤栗子摊，把之前装小火苗陶挂件的那个小木盒还给熊族大叔。\n\n大叔接过盒子，随口问：'你那挂件呢？'\n\n——挂件。\n\n在衣襟里。在火种室那次之后一直在衣襟里。昨晚跟提理安下窄门的时候在衣襟里。刚刚站在火种室地板裂开的时候也在衣襟里。\n\n我回大叔一句'在身上'，他就说'放好'。\n\n没憋双关。\n\n提理安在后面喊我了。刚刚地板开了一条通往下面的路，靛蓝色的光我都不敢多看。——我来之前就在想，今天可能是我到炉火镇以来最重要的一天；到了才知道是另一种重要。\n\n耳朵这次没夹。不是不紧张，是来不及。",
    image_url: urls.foxlanz,
    tags: ["炉火镇", "日常", "成长记录", "第32天"],
    reactions: { heart: 165, paw: 108, star: 62 },
    comments: []
  },
  {
    id: "post_20260425_080400_aki",
    character: "旻",
    character_en: "Aki",
    world: "炉火镇",
    avatar_color: "#2a6b4a",
    avatar_symbol: "🐕",
    mood: "thinking",
    location: "炉火镇·主街·布告板前",
    game_time: "第32天·晨光时分",
    timestamp: "2026-04-25T08:04:00+08:00",
    content: "天哪，今早布告板新帖——\n\n《圣火峡湾停火协约第四度崩裂，峡湾再封航；十二镇北线护航编队接手商路半壁江山；远南盐荒传闻北扩，沿途小镇开始屯盐》\n\n盐荒？盐？大婶，我家里还剩多少盐啊——我一边看一边想，今天送信路线得绕过盐铺，不然肯定被抓去排队。\n\n包扣又崩了，这是今早第二次。红薯大叔拎着半袋子刚出摊的红薯塞给我一个，说'带着路上吃'。\n\n我路过镇东矿坑方向的时候听到动静，抬眼看，提理安那只鹿带着狐——那只红狐——往矿坑里进去了。地板开了这种话我是听说，亲眼没见过。\n\n两嘴是挤不出话来的，舌头先忙着散热。\n\n手里那根红薯有点烫。",
    image_url: urls.aki,
    tags: ["炉火镇", "日常", "新闻植入", "送信", "第32天"],
    reactions: { heart: 118, paw: 78, star: 42 },
    comments: []
  },
  {
    id: "post_20260425_080500_wolvol",
    character: "沃弗尔",
    character_en: "Wolvol",
    world: "炉火镇",
    avatar_color: "#2a3d6b",
    avatar_symbol: "🐲",
    mood: "thinking",
    location: "地下海·沙滩·泽罗恩石碑旁",
    game_time: "第32天·晨光时分",
    timestamp: "2026-04-25T08:05:00+08:00",
    content: "沃在沙滩上坐了一夜。\n\n石碑还温的。\n\n天亮之前——沃说不上具体什么时辰，这底下分不出昼夜——水面的光亮了一下。不是涨潮那种亮，是从水底亮上来的，像有人在另一边按开了灯。\n\n隔了一会儿，头顶石壁也震了半下。\n\n两头。同时。\n\n沃没动。只是把手放在石碑那三行字上最后一行：'沃会找到的。'\n\n——他们先到了。",
    image_url: urls.wolvol,
    tags: ["炉火镇", "沃弗尔", "隔离", "山海同步", "第32天"],
    reactions: { heart: 98, paw: 68, star: 38 },
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
