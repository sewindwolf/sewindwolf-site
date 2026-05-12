// 合并第32天暮色波次6条推送到 posts.json —— 匹配正确格式
const fs = require('fs');

const POSTS_PATH = 'C:/Users/Administrator/sewindwolf-site/data/posts.json';
const POSTS_PUBLIC_PATH = 'C:/Users/Administrator/sewindwolf-site/public/data/posts.json';

// 读取生成的 CDN URL
const urls = JSON.parse(fs.readFileSync('d32_eve_urls.json', 'utf8'));

const META = {
  fengya:  { name:'风亚',     en:'Fengya',     color:'#6b7a8c', symbol:'🐺' },
  yufeng:  { name:'羽烽',     en:'Yufeng',     color:'#d9d9d9', symbol:'🐯' },
  tilion:  { name:'提理安',   en:'Tilion',     color:'#8a8a78', symbol:'🦌' },
  foxlanz: { name:'狐兰兹',   en:'Foxlanz',    color:'#a8482d', symbol:'🦊' },
  aki:     { name:'旻',       en:'Aki',        color:'#2a2a2a', symbol:'🐕' },
  wolvol:  { name:'沃弗尔',   en:'Wolvol',     color:'#2a3d6b', symbol:'🐲' }
};

function mkPost(id_suffix, charKey, ts, mood, location, content, comments) {
  const m = META[charKey];
  return {
    id: `post_20260425_${id_suffix}_${charKey}`,
    character: m.name,
    character_en: m.en,
    world: '炉火镇',
    avatar_color: m.color,
    avatar_symbol: m.symbol,
    mood,
    location,
    game_time: '第32天·暮色',
    timestamp: ts,
    content,
    image_url: urls[charKey],
    tags: ['炉火镇','地下海','第32天', m.name],
    reactions: {
      heart: Math.floor(200 + Math.random()*60),
      paw:   Math.floor(130 + Math.random()*50),
      star:  Math.floor(90 + Math.random()*30)
    },
    comments: comments || []
  };
}

const newPosts = [
  mkPost('210000', 'fengya', '2026-04-25T21:00:00+08:00', 'calm', '地下海·穹顶·北岸水线',
`站在这一边的水边，回头看对岸。

鹿和狐狸都下来了。鹿在更高一点的台阶上，正把笛子往嘴边送。狐狸——蓝眼睛那位——在一堵巨大的壁画下，整张脸贴近石头在看字。

中间那块黑石头旁边，沃没动。

水面很静，顶上六束光全倒着压在水里，我脚底一个圆顶，头顶一个圆顶。

走过来两天，坐渡船两天，水下下了三阶。今天——算到这儿了。

羽烽在旁边站着。我说：「都来了。」

他说：「嗯。」

对岸，鹿把笛子举起来了。`,
  [
    { author:'老船工', content:'从潮汐湾走到这儿……你这趟船算是绕了个满圆。' },
    { author:'章鱼族老太太', content:'炸珊瑚虾卷给你留着呢，回来接着吃。' }
  ]),
  mkPost('210100', 'yufeng', '2026-04-25T21:01:00+08:00', 'surprised', '地下海·穹顶·北岸',
`抬头。

六束光。

青、蓝、金、银、绿，还有一个——末端是一对鹿角的形状。

金的那束刚好打在右眼。绿的那束刚好打在左眼。

……

我站在这底下站了大概两秒没说话。

风亚也没说话。

两秒之后我开口说了一句「靠」。

这个坑把它回成了七道靠。

——

上面那个有鹿角形状的光。是冲着对岸那头鹿的。那其他五道呢？

加沃的角的那一道。算第六。

——

加我算第几。`,
  [
    { author:'雀巢酒馆老板娘', content:'你那一声「靠」我隔着整座炉火镇都听见了。' },
    { author:'风亚', content:'嗯，这声挺响。' }
  ]),
  mkPost('210200', 'tilion', '2026-04-25T21:02:00+08:00', 'calm', '地下海·穹顶·南阶',
`笛子举起来。

这支笛子是我爹传下来的。他当年守望亭值班最后一个冬天，吹的就是这一调——《炉火晨风》。我听过五十遍。自己也吹了十几年。

从来没在这么大的一个圆壳里吹过。

吹第一个音的时候，整片水面起了一圈涟漪。

吹到第三个音的时候，墙上的螺旋纹路从远端一格一格亮起来，跟着节拍。

吹到第五个音的时候，对岸那只白老虎听见了，愣了半秒回头。

吹到第七个音的时候——

整个穹顶的六束光稳住了。不是晃，是像谁把它调到了同一拍上。

我停下来。雪羽落在我肩上。我自己轻声说了一句：

「——两极，连通了。」

炉火镇的门，今天也开着呢。只不过这次，开的不是门——是盖子。`,
  [
    { author:'草药师老鸢', content:'那本旧册子上的空白页，今晚可以填了。' },
    { author:'豆子', content:'提理安哥！！你今天还没回家呢！' },
    { author:'提理安', content:'……豆子，我今天不是休假。' }
  ]),
  mkPost('210300', 'foxlanz', '2026-04-25T21:03:00+08:00', 'thinking', '地下海·穹顶·南岸壁画前',
`【成长记录 第二十七条】

南墙，第四行，第二组刻纹。

手指按下去的时候我感觉到温度了——不是石头热，是纹路里面有东西在走。一格一格地往我指尖这边亮。

我把衣襟里的小火苗陶挂件掏出来，贴到纹路上——

陶挂件发亮了。

跟纹路同一个颜色。同一个节奏。

——

长老说过，我们族的出使，是「把一个村子的火带到另一个村子」。

这几个月我一直在想他是什么意思。

刚才那一下我好像有点明白了。

不是把火搬过去。是去找——那些本来就和自己家的火，是同一团火的地方。

——

我把这句话写在本子上了。

双关没有憋出来。

不需要。

——

提理安的笛声从对岸传过来了。

我没有抬头。继续对第五组刻纹。`,
  [
    { author:'旻', content:'狐兰兹先生！你刚才手按墙那下，墙真的亮了！！' },
    { author:'熊族面包大叔', content:'小狐，回来我给你留了圆的。' }
  ]),
  mkPost('210400', 'aki', '2026-04-25T21:04:00+08:00', 'surprised', '地下海·穹顶·中央岛',
`我下去了。

对，我——旻——下去了。

从第六十阶那个缺口钻进来，再从南岸的小石桥一路小跑到中间那块石头岛。

包扣崩了。我知道。崩第四次了。

但是我包里那封「炉火镇·有缘人收」的信——我一直捏在手里。没丢。

——

走到石头旁边的时候，深蓝毛的先生——**沃弗尔先生**——转过头看我。

紫金色的眼睛。

……我从来没见过紫金色的眼睛。

我舌头缩了一下，但是没卡——

我把信从爪子里伸出去：

「这封……这封是『炉火镇·有缘人收』，之前送进风亚哥哥包里，他说让我再送一次，要是——要是碰到该收的人就给。」

「……我觉得可能是你。」

「你收吗？」`,
  [
    { author:'裁缝大婶', content:'哎哟我就说了镇东搬进来那位不一般！！' },
    { author:'提理安', content:'旻，你也下来了？你什么时候……算了。' },
    { author:'旻', content:'提理安哥哥我第六十阶就在了！你下得太慢了！' }
  ]),
  mkPost('210500', 'wolvol', '2026-04-25T21:05:00+08:00', 'calm', '地下海·穹顶·中央岛·石碑旁',
`小的那个跑过来了。

黑毛，红项圈，包带上的铜扣崩开了。

举着一个信封。

「炉火镇·有缘人收。」

——

沃把手从石碑顶上放下来。

石碑上刻的三行字沃从早上读到现在：

「此处通两极。」

「山在上。海在下。同根。」

「沃会找到的。」

沃一直以为这三行字——是泽罗恩写给沃的。

——

看到这封信的瞬间，沃忽然明白了：

泽罗恩写下「沃会找到的」那天，他不是在对沃说。

他是在对**收信的那个人**说。

说：沃会找到你。

——

沃伸出手，接过信。

抬头看了一眼送信的小家伙。

第一次开口：

「……不是给沃的。」

「是给你的。」

「——也是给沃的。」

「泽罗恩——他走过这里。他走的另一条路。」

「……走到头了。」

——

小家伙愣在原地，嘴张着没合上。

石碑在手底下，比早上更温了。`,
  [
    { author:'旻', content:'……' },
    { author:'旻', content:'你……你刚才一次说了好多话。' },
    { author:'沃弗尔', content:'……嗯。' }
  ])
];

const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
console.log('Before:', posts.length);
posts.push(...newPosts);
console.log('After:', posts.length);

fs.writeFileSync(POSTS_PATH, JSON.stringify(posts, null, 2), 'utf8');
fs.writeFileSync(POSTS_PUBLIC_PATH, JSON.stringify(posts, null, 2), 'utf8');
console.log('Written.');
console.log('Image URLs:');
for (const [k,v] of Object.entries(urls)) console.log(' ',k,'->',v);
