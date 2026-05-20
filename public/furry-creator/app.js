const speciesDetailOptions = {
  common: [['wolf','狼'],['fox','狐狸'],['dog','狗'],['cat','猫'],['tiger','虎'],['lion','狮'],['dragon','龙'],['deer','鹿'],['rabbit','兔'],['bear','熊'],['raccoon','浣熊'],['random','随便，帮我随机一个常见种族']],
  rare: [['bird','鸟类'],['snake','蛇'],['goat','山羊'],['bull','牛'],['horse','马'],['bat','蝙蝠'],['crocodile','鳄鱼'],['shark','鲨鱼'],['lizard','蜥蜴'],['otter','水獭'],['random','随便，帮我随机一个罕见种族']],
  fantasy: [['dragon beastfolk','龙兽'],['griffin','狮鹫'],['kirin','麒麟'],['wolf-dragon hybrid','狼龙混合'],['phoenix avian','凤凰兽人'],['demon beastfolk','恶魔兽人'],['unicorn','独角兽'],['crystal beast','水晶兽'],['alien beastfolk','外星兽人'],['divine mythical beast','神兽'],['random','随便，帮我随机一个幻想种族']],
  mechanical: [['mechanical wolf','机械狼'],['mechanical fox','机械狐狸'],['mechanical dragon','机械龙'],['synthetic beastfolk','合成兽人'],['bionic cat','仿生猫'],['bioengineered tiger','生化虎'],['armored dog','装甲犬'],['experimental beastfolk','实验体兽人'],['random','随便，帮我随机一个机械/人造种族']]
};

const speciesVariantOptions = {
  wolf: [['gray wolf','灰狼'],['arctic wolf','北极狼'],['black wolf','黑狼'],['red wolf','红狼'],['timber wolf','森林狼'],['maned wolf','鬃狼'],['random','随机一个狼亚型']],
  fox: [['red fox','赤狐'],['arctic fox','北极狐'],['fennec fox','耳廓狐'],['silver fox','银狐'],['nine-tailed fox','九尾狐'],['random','随机一个狐狸亚型']],
  dog: [['shiba inu dog','柴犬'],['husky dog','哈士奇'],['german shepherd dog','德国牧羊犬'],['samoyed dog','萨摩耶'],['border collie dog','边境牧羊犬'],['golden retriever dog','金毛寻回犬'],['doberman dog','杜宾犬'],['corgi dog','柯基'],['random','随机一个犬种']],
  cat: [['black domestic cat','黑猫'],['calico cat','三花猫'],['tabby cat','狸花猫'],['siamese cat','暹罗猫'],['maine coon cat','缅因猫'],['lynx cat','猞猁'],['random','随机一个猫亚型']],
  tiger: [['siberian tiger','东北虎'],['white tiger','白虎'],['golden tiger','金虎'],['black striped tiger','黑纹虎'],['random','随机一个虎亚型']],
  lion: [['golden lion','金狮'],['white lion','白狮'],['black-maned lion','黑鬃狮'],['mountain lion','山狮'],['random','随机一个狮亚型']],
  dragon: [['eastern dragon','东方龙'],['western dragon','西方龙'],['water dragon','水龙'],['fire dragon','火龙'],['feathered dragon','羽龙'],['random','随机一个龙亚型']],
  deer: [['sika deer','梅花鹿'],['red deer','赤鹿'],['reindeer','驯鹿'],['white-tailed deer','白尾鹿'],['moose','驼鹿'],['random','随机一个鹿亚型']],
  rabbit: [['lop rabbit','垂耳兔'],['white rabbit','白兔'],['hare','野兔'],['angora rabbit','安哥拉兔'],['jackrabbit','长耳野兔'],['random','随机一个兔亚型']],
  bear: [['brown bear','棕熊'],['polar bear','北极熊'],['black bear','黑熊'],['panda bear','熊猫'],['sun bear','马来熊'],['random','随机一个熊亚型']],
  raccoon: [['common raccoon','浣熊'],['tanuki raccoon dog','狸猫/貉'],['white raccoon','白化浣熊'],['random','随机一个浣熊亚型']],
  bird: [['eagle avian','鹰'],['owl avian','猫头鹰'],['raven avian','渡鸦'],['parrot avian','鹦鹉'],['crane avian','鹤'],['penguin avian','企鹅'],['random','随机一个鸟类亚型']],
  snake: [['cobra snake','眼镜蛇'],['python snake','蟒蛇'],['viper snake','蝰蛇'],['coral snake','珊瑚蛇'],['white snake','白蛇'],['random','随机一个蛇亚型']],
  goat: [['mountain goat','山地羊'],['black goat','黑山羊'],['ibex goat','北山羊'],['ram goat','公羊'],['random','随机一个山羊亚型']],
  bull: [['water buffalo','水牛'],['yak bull','牦牛'],['bison','野牛'],['highland cattle','高地牛'],['random','随机一个牛亚型']],
  horse: [['black horse','黑马'],['white horse','白马'],['zebra horse','斑马'],['pegasus-like horse','天马感马'],['mustang horse','野马'],['random','随机一个马亚型']],
  bat: [['fruit bat','果蝠'],['vampire bat','吸血蝠'],['long-eared bat','长耳蝠'],['white bat','白蝙蝠'],['random','随机一个蝙蝠亚型']],
  crocodile: [['crocodile','鳄鱼'],['alligator','短吻鳄'],['gharial','恒河鳄'],['caiman','凯门鳄'],['random','随机一个鳄类亚型']],
  shark: [['great white shark','大白鲨'],['hammerhead shark','锤头鲨'],['whale shark','鲸鲨'],['tiger shark','虎鲨'],['random','随机一个鲨鱼亚型']],
  lizard: [['gecko lizard','壁虎'],['iguana lizard','鬣蜥'],['chameleon lizard','变色龙'],['monitor lizard','巨蜥'],['axolotl amphibian','美西螈'],['random','随机一个蜥蜴/两栖亚型']],
  otter: [['river otter','河獭'],['sea otter','海獭'],['giant otter','巨獭'],['random','随机一个水獭亚型']],
  'dragon beastfolk': [['eastern dragon beastfolk','东方龙兽'],['western dragon beastfolk','西方龙兽'],['sea dragon beastfolk','海龙兽'],['celestial dragon beastfolk','天龙兽'],['random','随机一个龙兽细分']],
  griffin: [['eagle griffin','鹰狮鹫'],['owl griffin','猫头鹰狮鹫'],['snow griffin','雪原狮鹫'],['royal griffin','王室狮鹫'],['random','随机一个狮鹫细分']],
  kirin: [['classic kirin','传统麒麟'],['deer kirin','鹿形麒麟'],['dragon kirin','龙角麒麟'],['crystal kirin','水晶麒麟'],['random','随机一个麒麟细分']],
  'wolf-dragon hybrid': [['wolf-dragon hybrid','狼龙混合'],['fox-dragon hybrid','狐龙混合'],['tiger-dragon hybrid','虎龙混合'],['deer-dragon hybrid','鹿龙混合'],['random','随机一个龙混合种']],
  'phoenix avian': [['red phoenix avian','赤凤凰'],['blue phoenix avian','青凤凰'],['golden phoenix avian','金凤凰'],['ash phoenix avian','灰烬凤凰'],['random','随机一个凤凰细分']],
  'demon beastfolk': [['horned demon beastfolk','角魔兽人'],['shadow demon beastfolk','影魔兽人'],['goat demon beastfolk','羊魔兽人'],['fox demon beastfolk','狐魔兽人'],['random','随机一个恶魔兽人细分']],
  unicorn: [['classic unicorn','传统独角兽'],['dark unicorn','暗色独角兽'],['crystal unicorn','水晶独角兽'],['forest unicorn','森林独角兽'],['random','随机一个独角兽细分']],
  'crystal beast': [['crystal wolf beast','水晶狼兽'],['crystal fox beast','水晶狐兽'],['crystal deer beast','水晶鹿兽'],['gemstone dragon beast','宝石龙兽'],['random','随机一个水晶兽细分']],
  'alien beastfolk': [['alien canine beastfolk','外星犬科'],['alien feline beastfolk','外星猫科'],['moth alien beastfolk','蛾形外星兽人'],['aquatic alien beastfolk','水生外星兽人'],['random','随机一个外星兽人细分']],
  'divine mythical beast': [['divine wolf beast','神狼'],['divine fox beast','神狐'],['divine deer beast','神鹿'],['divine tiger beast','神虎'],['random','随机一个神兽细分']],
  'mechanical wolf': [['mechanical gray wolf','机械灰狼'],['mechanical arctic wolf','机械北极狼'],['stealth mechanical wolf','隐形机械狼'],['random','随机一个机械狼细分']],
  'mechanical fox': [['mechanical red fox','机械赤狐'],['mechanical arctic fox','机械北极狐'],['mechanical fennec fox','机械耳廓狐'],['random','随机一个机械狐细分']],
  'mechanical dragon': [['mechanical eastern dragon','机械东方龙'],['mechanical western dragon','机械西方龙'],['mechanical wyvern','机械飞龙'],['random','随机一个机械龙细分']],
  'synthetic beastfolk': [['synthetic canine beastfolk','合成犬科'],['synthetic feline beastfolk','合成猫科'],['synthetic aquatic beastfolk','合成水生兽人'],['synthetic avian beastfolk','合成鸟兽人'],['random','随机一个合成兽人细分']],
  'bionic cat': [['bionic black cat','仿生黑猫'],['bionic tabby cat','仿生狸花猫'],['bionic lynx','仿生猞猁'],['random','随机一个仿生猫细分']],
  'bioengineered tiger': [['bioengineered tiger','生化虎'],['bioengineered white tiger','生化白虎'],['bioengineered saber tiger','生化剑齿虎'],['random','随机一个生化虎细分']],
  'armored dog': [['armored shiba inu dog','装甲柴犬'],['armored husky dog','装甲哈士奇'],['armored shepherd dog','装甲牧羊犬'],['random','随机一个装甲犬细分']],
  'experimental beastfolk': [['experimental wolf beastfolk','实验狼兽人'],['experimental fox beastfolk','实验狐兽人'],['experimental reptile beastfolk','实验爬行兽人'],['experimental chimera beastfolk','实验嵌合兽人'],['random','随机一个实验体细分']]
};

const promptTemplates = {
  turnaround: {
    label: '标准三视图',
    cn: '标准三视图',
    description: '正面 / 侧面 / 背面，干净白底，适合后续稳定扩展。'
  },
  designBoard: {
    label: '完整设定板',
    cn: '完整设定板',
    description: '三视图 + 头像 + 细节格 + 配色 + 装备/徽章，像幻想 RPG 角色设定稿。'
  },
  profileCard: {
    label: '头像角色卡',
    cn: '头像角色卡',
    description: '大头像/半身展示 + 信息栏 + 色板，适合社交展示和角色档案。'
  },
  modelSheet: {
    label: '干净模型表',
    cn: '干净模型表',
    description: '更偏动画/建模用，轮廓清楚、标注区域少、背景极简。'
  }
};

const questions = [
  { id: 'speciesCategory', title: '第一步：你想从哪类种族开始？', tip: '先选一个大方向，下一步会展开具体种族。这里必须选择，不能跳过。', required: true, options: [['common','常见种族'],['rare','罕见种族'],['fantasy','幻想/神话种族'],['mechanical','机械/人造种族']] },
  { id: 'speciesChoice', title: '第二步：选择基础种族', tip: '先选基础种族，例如犬、猫、狼、龙等；下一步会展开更细的品种或亚型。', required: true, dynamic: 'species' },
  { id: 'speciesVariant', title: '第三步：选择品种 / 亚型细则', tip: '这里会决定更具体的种族细节，例如狗可以细分为柴犬、哈士奇、德牧、萨摩耶等。', required: true, dynamic: 'variant' },
  { id: 'anthro', title: '拟人程度', tip: '按 0%~100% 控制人形/兽形比例：数值越低越接近人类兽耳，数值越高越接近野兽或怪物体态。', options: [['anthro0','0% 近人类 / 兽耳人'],['anthro20','20% 轻度兽化'],['anthro40','40% 标准 furry'],['anthro60','60% 强兽人'],['anthro80','80% 野兽倾向'],['anthro100','100% 兽形 / 怪物感'],['random','随机']] },
  { id: 'bodyTypeChoice', title: '体型轮廓', tip: '这是捏人里非常关键的一步，会直接影响三视图剪影。', options: [['slim','修长'],['athletic','运动型'],['soft','柔和圆润'],['strong','强壮'],['tall','高挑优雅'],['small','小巧灵活'],['heavy','厚重敦实'],['random','随机']] },
  { id: 'temperament', title: '整体气质', tip: '决定角色给人的第一印象，也会影响描述用词。', options: [['cute','可爱亲和'],['cool','冷酷帅气'],['wild','野性危险'],['noble','高贵神秘'],['playful','活泼调皮'],['gentle','温柔可靠'],['dark','阴暗邪气'],['random','随机']] },
  { id: 'artStyle', title: '画风倾向', tip: '决定最终提示词的视觉风格。也可以在下方手写 12 字以内画风，例如厚涂、赛璐璐、绘本风。', custom: true, customKey: 'customArtStyle', customPlaceholder: '如：厚涂绘本风', options: [['clean-anime','清爽日系立绘'],['kemono','日系兽设 / Kemono'],['storybook','温暖绘本风'],['semi-realistic','半写实插画'],['cartoon','欧美卡通感'],['cell-shading','赛璐璐动画风'],['painterly','厚涂概念图'],['game-concept','游戏角色设定图'],['random','随机']] },
  { id: 'furColor', title: '毛色 / 主色基调', tip: '比原来的“配色方向”更具体，会写进毛色描述和 Banana 提示词。可在下方补充 12 字以内自定义毛色。', custom: true, customKey: 'customFurColor', customPlaceholder: '如：黑橙渐变', options: [['solid-white','纯白色'],['solid-black','纯黑色'],['solid-gray','纯灰色'],['solid-brown','纯棕色'],['natural-gray','灰白自然色'],['orange-cream','橙黄奶油色'],['black-white','黑白高对比'],['brown-tan','棕色浅腹'],['blue-silver','蓝灰银色'],['red-black','黑红暗色'],['pastel','梦幻浅彩色'],['neon','霓虹发光色'],['random','随机']] },
  { id: 'markingChoice', title: '花纹类型', tip: '决定身上的条纹、斑点、渐变、面纹或发光纹路。可补充 12 字以内自定义花纹。', custom: true, customKey: 'customMarking', customPlaceholder: '如：眉心月纹', options: [['clean','干净少花纹'],['stripes','条纹'],['spots','斑点'],['gradient','渐变色'],['mask','面部面具纹'],['rings','尾巴/四肢环纹'],['glow','发光纹路'],['tattoo','图腾纹 / 魔法纹'],['random','随机']] },
  { id: 'eyeColor', title: '瞳色', tip: '瞳色会让角色更有辨识度，尤其适合头像和角色卡。可补充 12 字以内自定义瞳色。', custom: true, customKey: 'customEyeColor', customPlaceholder: '如：金绿渐变', options: [['amber','琥珀金'],['blue','冰蓝色'],['green','翠绿色'],['red','红色'],['purple','紫色'],['hetero','异色瞳'],['glow','发光瞳'],['black','黑色深瞳'],['random','随机']] },
  { id: 'featureDetail', title: '重点外形特征', tip: '重点外形特征可复选；“不额外强化”和“随机”会与其他特征互斥。可补充 12 字以内自定义特征。', multiple: true, custom: true, customKey: 'customFeature', customPlaceholder: '如：断角金纹', options: [['tail','尾巴更有设计感'],['ears','耳朵更有辨识度'],['horns','角 / 鹿角 / 龙角'],['wings','翅膀 / 翼膜'],['mane','鬃毛 / 颈部蓬毛'],['scales','鳞片 / 甲片'],['mechanical','机械义体 / 发光接口'],['none','不额外强化'],['random','随机']] },
  { id: 'accessory', title: '装饰物', tip: '装饰物可以多选，用来建立角色记忆点；“不加装饰”和“随机”会与其他装饰互斥。可补充 12 字以内自定义装饰。', multiple: true, custom: true, customKey: 'customAccessory', customPlaceholder: '如：铃铛项圈', options: [['necklace','项链 / 吊坠'],['earring','耳饰'],['scarf','围巾'],['gloves','手套 / 护腕'],['belt','腰带 / 小包'],['glasses','眼镜 / 护目镜'],['ribbon','丝带 / 发饰'],['none','不加装饰'],['random','随机']] },
  { id: 'outfitStyle', title: '服装风格', tip: '决定整体衣装大方向。可补充 12 字以内自定义服装方向。', custom: true, customKey: 'customOutfit', customPlaceholder: '如：水手披肩', options: [['accessory','饰品为主'],['street','现代街头'],['fantasy','奇幻冒险'],['cyber','赛博朋克'],['tribal','部落自然'],['noble','贵族礼服'],['armor','战斗装甲'],['mage','魔法师/祭司'],['random','随机']] },
  { id: 'outfitDetail', title: '服装细节', tip: '补充衣服层次与剪裁，避免结果只有一句“穿着某种服装”。可补充 12 字以内自定义细节。', custom: true, customKey: 'customOutfitDetail', customPlaceholder: '如：云纹袖口', options: [['light','轻便短外套'],['layered','多层次披挂'],['cloak','披风 / 斗篷'],['uniform','制服感剪裁'],['armor-parts','局部护甲'],['techwear','机能绑带与模块'],['robe','长袍与垂坠布料'],['minimal','简洁不复杂'],['random','随机']] },
  { id: 'world', title: '世界观', tip: '世界观最多可选两个，用于融合角色出身与氛围；“随机”会随机 1~2 个世界观。可补充 12 字以内自定义世界观。', multiple: true, maxSelect: 2, custom: true, customKey: 'customWorld', customPlaceholder: '如：雾港旧城', options: [['modern','现代都市'],['beastfolk','奇幻兽人世界'],['cyberpunk','赛博朋克'],['academy','魔法学院'],['wasteland','废土'],['ocean','海洋文明'],['myth','神话世界'],['space','太空科幻'],['random','随机']] },
  { id: 'detailLevel', title: '生成细节密度', tip: '不是跳过细节，而是决定最终描述写得更简洁还是更完整。', options: [['balanced','平衡'],['clean','简洁清楚'],['rich','细节丰富'],['reference','偏角色卡 / 三视图设定'],['random','随机']] },
  { id: 'promptTemplate', title: '最终版式模板', tip: '生成前选择这张图要长什么样：是标准三视图，还是带头像、细节、配色和装备栏的完整设定板。', required: true, options: [['turnaround','标准三视图'],['designBoard','完整设定板'],['profileCard','头像角色卡'],['modelSheet','干净模型表']] }
];
const pools = {
  common: speciesDetailOptions.common.filter(([v]) => v !== 'random').map(([v]) => v),
  rare: speciesDetailOptions.rare.filter(([v]) => v !== 'random').map(([v]) => v),
  fantasy: speciesDetailOptions.fantasy.filter(([v]) => v !== 'random').map(([v]) => v),
  mechanical: speciesDetailOptions.mechanical.filter(([v]) => v !== 'random').map(([v]) => v),
  hybridBase: ['wolf','fox','cat','tiger','dragon','deer','bird','snake','shark'],
  hybridTrait: ['deer antlers','dragon scales','feathered wings','multiple tails','glowing markings','mechanical parts','aquatic fins','demon horns']
};

const speciesDefaults = {
  wolf: ['medium wolf muzzle','pointed wolf ears','bushy wolf tail','short thick fur','digitigrade legs','paw feet'],
  fox: ['slender fox muzzle','large pointed fox ears','large fluffy fox tail','soft fluffy fur','digitigrade legs','paw feet'],
  dog: ['friendly canine muzzle','floppy or pointed dog ears','curled dog tail','short soft fur','digitigrade legs','paw feet'],
  cat: ['short feline muzzle','pointed feline ears','long feline tail','soft sleek fur','digitigrade legs','paw feet with retractable claws'],
  tiger: ['short feline muzzle','rounded tiger ears','long tiger tail','striped fur','digitigrade legs','large paw feet'],
  lion: ['short feline muzzle','rounded lion ears','tufted lion tail','golden fur with mane-like neck fluff','digitigrade legs','large paw feet'],
  dragon: ['reptilian dragon snout','horns and fin-like ears','long dragon tail','scales','digitigrade reptilian legs','clawed dragon feet'],
  deer: ['gentle deer muzzle','side deer ears','short deer tail','short fur','hoofed digitigrade legs','hooves'],
  rabbit: ['small rabbit muzzle','long rabbit ears','round rabbit tail','soft fluffy fur','digitigrade legs','paw feet'],
  bear: ['broad bear muzzle','round bear ears','short bear tail','dense fur','plantigrade legs','broad paw feet'],
  raccoon: ['short raccoon muzzle','rounded raccoon ears','ringed raccoon tail','soft fur','digitigrade legs','paw feet'],
  bird: ['beak','feather crest','feathered tail','feathers','avian legs','talon feet'],
  snake: ['reptilian snake-like snout','no external ears','long serpentine tail','smooth scales','digitigrade legs for turnaround clarity','clawed reptilian feet'],
  goat: ['gentle goat muzzle','side goat ears','short goat tail','short fur','hoofed digitigrade legs','hooves'],
  bull: ['strong bovine muzzle','side bovine ears','short bovine tail','short fur','hoofed digitigrade legs','hooves'],
  horse: ['long horse muzzle','upright horse ears','horse tail','short coat','hoofed digitigrade legs','hooves'],
  bat: ['small bat muzzle','large bat ears','short tail','short fur with membrane wing details','digitigrade legs','clawed feet'],
  crocodile: ['long crocodile snout','small reptilian ear openings','thick crocodile tail','armored scales','digitigrade reptilian legs','clawed feet'],
  shark: ['shark-like muzzle','small fin-like ears','powerful shark tail','smooth skin with subtle countershading','digitigrade legs','webbed clawed feet'],
  lizard: ['reptilian lizard snout','small fin-like ears','long lizard tail','smooth scales','digitigrade reptilian legs','clawed feet'],
  otter: ['rounded otter muzzle','small round ears','thick otter tail','sleek wet-looking fur','digitigrade legs','webbed paw feet']
};

const maps = {
  temperament: { cute:'cute and friendly', cool:'cool and reliable', wild:'wild and dangerous', noble:'noble and mysterious', playful:'playful and lively', gentle:'gentle and dependable', dark:'dark and ominous' },
  artStyle: { 'clean-anime':'clean anime character illustration style', kemono:'Japanese kemono furry character design style', storybook:'warm storybook illustration style', 'semi-realistic':'semi-realistic polished illustration style', cartoon:'western cartoon character design style', 'cell-shading':'crisp cel-shaded animation style', painterly:'painterly concept art style', 'game-concept':'game character concept art style' },
  anthro: { anthro0:'0% anthro level, near-human kemonomimi character', anthro20:'20% anthro level, lightly animalized kemono character', anthro40:'40% anthro level, balanced standard furry character', anthro60:'60% anthro level, strong beastman furry character', anthro80:'80% anthro level, feral-leaning anthropomorphic beast character', anthro100:'100% anthro level, beast-shaped monster or divine animal character' },
  world: { modern:'modern city', beastfolk:'fantasy beastfolk kingdom', cyberpunk:'neon cyberpunk city', academy:'magic academy', wasteland:'post-apocalyptic wasteland', ocean:'ocean civilization', myth:'ancient mythological realm', space:'spacefaring sci-fi colony' },
  outfitStyle: { accessory:'minimal clothing with tasteful accessories', street:'modern streetwear outfit', fantasy:'fantasy adventurer outfit', cyber:'cyberpunk techwear outfit', tribal:'tribal nature-inspired outfit', noble:'noble formal attire', armor:'battle armor', mage:'mage or priest ceremonial robe' },
  bodyType: { slim:'slim build', athletic:'athletic build', soft:'soft rounded build', strong:'strong muscular build', tall:'tall elegant build', small:'small agile build', heavy:'heavy sturdy build' },
  furColor: {
    'solid-white':['pure white fur','same white fur across the whole body','clean solid-color coat'],
    'solid-black':['pure black fur','same black fur across the whole body','clean solid-color coat'],
    'solid-gray':['pure gray fur','same gray fur across the whole body','clean solid-color coat'],
    'solid-brown':['pure brown fur','same brown fur across the whole body','clean solid-color coat'],
    'natural-gray':['gray fur','white chest and muzzle','darker back fur and tail tip'],
    'orange-cream':['orange fur','cream muzzle and belly','dark ear tips'],
    'black-white':['black fur','white chest and face markings','sharp high-contrast color blocks'],
    'brown-tan':['brown fur','tan chest fur','warm natural accents'],
    'blue-silver':['deep blue-gray fur','pale icy chest','silver accents'],
    'red-black':['charcoal black fur','dark red accents','shadowy color contrast'],
    pastel:['pink and cream fur','pastel blue accents','soft candy-like palette'],
    neon:['cyan fur','purple gradients','glowing neon accents']
  },
  marking: { clean:'clean minimal markings', stripes:'clear stripe markings', spots:'spotted markings', gradient:'smooth color gradients', mask:'mask-like facial markings', rings:'ring markings on tail and limbs', glow:'glowing body markings', tattoo:'ornate totem or magic markings' },
  eyeColor: { amber:'amber golden eyes', blue:'icy blue eyes', green:'emerald green eyes', red:'red eyes', purple:'purple eyes', hetero:'heterochromia eyes', glow:'glowing luminous eyes', black:'deep black eyes' },
  featureDetail: { tail:'extra expressive tail design', ears:'distinctive ear silhouette', horns:'horns or antlers', wings:'wings or wing membrane details', mane:'mane or thick neck fluff', scales:'scales or armor-like plates', mechanical:'mechanical prosthetic parts and glowing ports', none:'no extra special feature' },
  accessory: { necklace:'necklace or pendant', earring:'earrings', scarf:'scarf', gloves:'gloves or wrist guards', belt:'belt with small pouches', glasses:'glasses or goggles', ribbon:'ribbon or hair ornament', none:'no extra accessory' },
  outfitDetail: { light:'light short jacket', layered:'layered clothing and straps', cloak:'cloak or cape', uniform:'uniform-like tailoring', 'armor-parts':'partial armor pieces', techwear:'techwear straps and modular gear', robe:'long robe with hanging fabric', minimal:'simple clean clothing details' },
  detailLevel: { balanced:'balanced detail level', clean:'clean and concise design', rich:'richly detailed design', reference:'reference-sheet focused design' }
};

const anthroLegacyMap = { humanlike:'anthro20', standard:'anthro40', beastlike:'anthro80', mythic:'anthro100' };

const anthroProfiles = {
  anthro0: {
    percent: 0,
    cn: '0% 近人类 / 兽耳人',
    guidance: '0% anthro anatomy: almost human silhouette and upright human posture, human torso, human legs and human hands, only animal ears, tail, light fur accents or subtle species motifs. Avoid animal muzzle, avoid digitigrade legs, avoid heavy paws.',
    posture: 'upright human posture, straight spine, normal human stance',
    covering: 'mostly human skin with limited fur accents',
    legStructure: 'human plantigrade legs',
    footType: 'human feet or very light paw-inspired feet',
    handType: 'human hands with subtle claw-like nails'
  },
  anthro20: {
    percent: 20,
    cn: '20% 轻度兽化',
    guidance: '20% anthro anatomy: mostly human proportions with visible animal ears, tail, soft fur on forearms or lower legs, slight muzzle or animal nose, humanlike hands, upright relaxed stance. Keep the face cute and readable, not fully animal-headed.',
    posture: 'upright humanlike posture with relaxed shoulders',
    covering: 'partial soft fur on ears, tail, forearms and lower legs',
    legStructure: 'mostly human plantigrade legs with slight animal styling',
    footType: 'humanlike feet with light paw pads or small claws',
    handType: 'humanlike hands with short claws'
  },
  anthro40: {
    percent: 40,
    cn: '40% 标准 furry',
    guidance: '40% anthro anatomy: balanced standard furry design, upright bipedal body, clear animal head and muzzle, visible ears and tail, paw hands, digitigrade or furry-adapted legs, still close to human body proportions.',
    posture: 'upright bipedal furry posture',
    covering: 'full visible fur or species body covering',
    legStructure: 'moderate digitigrade furry legs',
    footType: 'clear paw feet',
    handType: 'paw-like hands with usable fingers'
  },
  anthro60: {
    percent: 60,
    cn: '60% 强兽人',
    guidance: '60% anthro anatomy: stronger animal silhouette while standing upright, pronounced muzzle, thicker neck fluff and chest fur, larger paws, stronger digitigrade legs, wider shoulders or animal musculature, less human facial structure.',
    posture: 'upright but powerfully animal-like stance',
    covering: 'dense full-body fur or species covering with thick neck and chest fluff',
    legStructure: 'strong digitigrade animal legs',
    footType: 'large paw feet or clawed animal feet',
    handType: 'large paw hands with claws and readable fingers'
  },
  anthro80: {
    percent: 80,
    cn: '80% 野兽倾向',
    guidance: '80% anthro anatomy: feral-leaning beastman, long muzzle, heavy fur mane, hunched forward torso, longer arms, large clawed paws, powerful digitigrade legs, body language closer to a wild animal while still readable as an OC character.',
    posture: 'forward-leaning semi-feral bipedal posture',
    covering: 'heavy fur, mane, shaggy limbs and stronger animal texture',
    legStructure: 'deep digitigrade beast legs with powerful haunches',
    footType: 'oversized clawed paw feet',
    handType: 'large clawed paw hands'
  },
  anthro100: {
    percent: 100,
    cn: '100% 兽形 / 怪物感',
    guidance: '100% anthro anatomy: beast-shaped monster or divine animal direction, strongly non-human body plan, low crouching or quadruped-ready stance, animal torso rhythm, long muzzle, large claws, heavy paws, tail and mane dominate the silhouette. Keep it coherent for a character reference sheet, not a normal human body.',
    posture: 'low crouching beast posture, quadruped-ready stance',
    covering: 'complete animal fur, scales, feathers or monster body covering',
    legStructure: 'fully animal-like hind legs',
    footType: 'large animal paws, talons, hooves or claws',
    handType: 'animal forepaws or clawed hands'
  }
};

function normalizeAnthroKey(value){
  if(value === 'random' || value === 'auto') return pick(Object.keys(maps.anthro));
  return maps.anthro[value] ? value : (anthroLegacyMap[value] || 'anthro40');
}

const colors = {
  natural: [['gray fur','white chest and muzzle','darker back fur and tail tip'],['orange fur','cream muzzle and belly','dark ear tips and ringed tail'],['brown fur','tan chest fur','subtle facial markings']],
  mono: [['black fur','white chest and face markings','sharp high-contrast markings'],['white fur','black ears and tail tip','clean monochrome pattern']],
  warm: [['golden amber fur','cream belly','soft red-brown accents'],['rust orange fur','warm beige chest','copper markings']],
  cool: [['deep blue-gray fur','pale icy chest','silver markings'],['teal fur','white belly','navy gradients']],
  dream: [['lavender fur','white belly','starry blue markings'],['cyan fur','purple gradients','glowing neon stripes'],['pink and cream fur','pastel blue accents','heart-shaped facial marking']],
  dark: [['charcoal fur','dark red accents','subtle shadow markings'],['midnight blue fur','silver chest','dim glowing markings']]
};

const professions = ['ranger','guardian','adventurer','street dancer','mage','priest','mechanic','captain','scout','alchemist','knight','idol','healer'];

const zhTerms = {
  wolf:'狼', fox:'狐狸', dog:'犬', cat:'猫', tiger:'虎', lion:'狮', dragon:'龙', deer:'鹿', rabbit:'兔', bear:'熊', raccoon:'浣熊',
  'gray wolf':'灰狼', 'arctic wolf':'北极狼', 'black wolf':'黑狼', 'red wolf':'红狼', 'timber wolf':'森林狼', 'maned wolf':'鬃狼',
  'red fox':'赤狐', 'arctic fox':'北极狐', 'fennec fox':'耳廓狐', 'silver fox':'银狐', 'nine-tailed fox':'九尾狐',
  'shiba inu dog':'柴犬', 'husky dog':'哈士奇', 'german shepherd dog':'德国牧羊犬', 'samoyed dog':'萨摩耶', 'border collie dog':'边境牧羊犬', 'golden retriever dog':'金毛寻回犬', 'doberman dog':'杜宾犬', 'corgi dog':'柯基',
  'black domestic cat':'黑猫', 'calico cat':'三花猫', 'tabby cat':'狸花猫', 'siamese cat':'暹罗猫', 'maine coon cat':'缅因猫', 'lynx cat':'猞猁',
  'siberian tiger':'东北虎', 'white tiger':'白虎', 'golden tiger':'金虎', 'black striped tiger':'黑纹虎', 'golden lion':'金狮', 'white lion':'白狮', 'black-maned lion':'黑鬃狮', 'mountain lion':'山狮',
  'eastern dragon':'东方龙', 'western dragon':'西方龙', 'water dragon':'水龙', 'fire dragon':'火龙', 'feathered dragon':'羽龙',
  'sika deer':'梅花鹿', 'red deer':'赤鹿', reindeer:'驯鹿', 'white-tailed deer':'白尾鹿', moose:'驼鹿', 'lop rabbit':'垂耳兔', 'white rabbit':'白兔', hare:'野兔', 'angora rabbit':'安哥拉兔', jackrabbit:'长耳野兔',
  'brown bear':'棕熊', 'polar bear':'北极熊', 'black bear':'黑熊', 'panda bear':'熊猫', 'sun bear':'马来熊', 'common raccoon':'浣熊', 'tanuki raccoon dog':'狸猫/貉', 'white raccoon':'白化浣熊',
  bird:'鸟类', snake:'蛇', goat:'山羊', bull:'牛', horse:'马', bat:'蝙蝠', crocodile:'鳄鱼', shark:'鲨鱼', lizard:'蜥蜴', otter:'水獭',
  'eagle avian':'鹰', 'owl avian':'猫头鹰', 'raven avian':'渡鸦', 'parrot avian':'鹦鹉', 'crane avian':'鹤', 'penguin avian':'企鹅', 'cobra snake':'眼镜蛇', 'python snake':'蟒蛇', 'viper snake':'蝰蛇', 'coral snake':'珊瑚蛇', 'white snake':'白蛇',
  'mountain goat':'山地羊', 'black goat':'黑山羊', 'ibex goat':'北山羊', 'ram goat':'公羊', 'water buffalo':'水牛', 'yak bull':'牦牛', bison:'野牛', 'highland cattle':'高地牛',
  'black horse':'黑马', 'white horse':'白马', 'zebra horse':'斑马', 'pegasus-like horse':'天马感马', 'mustang horse':'野马', 'fruit bat':'果蝠', 'vampire bat':'吸血蝠', 'long-eared bat':'长耳蝠', 'white bat':'白蝙蝠',
  alligator:'短吻鳄', gharial:'恒河鳄', caiman:'凯门鳄', 'great white shark':'大白鲨', 'hammerhead shark':'锤头鲨', 'whale shark':'鲸鲨', 'tiger shark':'虎鲨',
  'gecko lizard':'壁虎', 'iguana lizard':'鬣蜥', 'chameleon lizard':'变色龙', 'monitor lizard':'巨蜥', 'axolotl amphibian':'美西螈', 'river otter':'河獭', 'sea otter':'海獭', 'giant otter':'巨獭',
  'dragon beastfolk':'龙兽人', griffin:'狮鹫', kirin:'麒麟', 'wolf-dragon hybrid':'狼龙混合种', 'phoenix avian':'凤凰鸟兽人', 'demon beastfolk':'恶魔兽人', unicorn:'独角兽', 'crystal beast':'水晶兽', 'alien beastfolk':'外星兽人', 'divine mythical beast':'神兽',
  'eastern dragon beastfolk':'东方龙兽', 'western dragon beastfolk':'西方龙兽', 'sea dragon beastfolk':'海龙兽', 'celestial dragon beastfolk':'天龙兽', 'eagle griffin':'鹰狮鹫', 'owl griffin':'猫头鹰狮鹫', 'snow griffin':'雪原狮鹫', 'royal griffin':'王室狮鹫',
  'classic kirin':'传统麒麟', 'deer kirin':'鹿形麒麟', 'dragon kirin':'龙角麒麟', 'crystal kirin':'水晶麒麟', 'fox-dragon hybrid':'狐龙混合种', 'tiger-dragon hybrid':'虎龙混合种', 'deer-dragon hybrid':'鹿龙混合种',
  'red phoenix avian':'赤凤凰', 'blue phoenix avian':'青凤凰', 'golden phoenix avian':'金凤凰', 'ash phoenix avian':'灰烬凤凰', 'horned demon beastfolk':'角魔兽人', 'shadow demon beastfolk':'影魔兽人', 'goat demon beastfolk':'羊魔兽人', 'fox demon beastfolk':'狐魔兽人',
  'classic unicorn':'传统独角兽', 'dark unicorn':'暗色独角兽', 'crystal unicorn':'水晶独角兽', 'forest unicorn':'森林独角兽', 'crystal wolf beast':'水晶狼兽', 'crystal fox beast':'水晶狐兽', 'crystal deer beast':'水晶鹿兽', 'gemstone dragon beast':'宝石龙兽',
  'alien canine beastfolk':'外星犬科', 'alien feline beastfolk':'外星猫科', 'moth alien beastfolk':'蛾形外星兽人', 'aquatic alien beastfolk':'水生外星兽人', 'divine wolf beast':'神狼', 'divine fox beast':'神狐', 'divine deer beast':'神鹿', 'divine tiger beast':'神虎',
  'mechanical wolf':'机械狼', 'mechanical fox':'机械狐狸', 'mechanical dragon':'机械龙', 'synthetic beastfolk':'合成兽人', 'bionic cat':'仿生猫', 'bioengineered tiger':'生化虎', 'armored dog':'装甲犬', 'experimental beastfolk':'实验体兽人',
  'mechanical gray wolf':'机械灰狼', 'mechanical arctic wolf':'机械北极狼', 'stealth mechanical wolf':'隐形机械狼', 'mechanical red fox':'机械赤狐', 'mechanical arctic fox':'机械北极狐', 'mechanical fennec fox':'机械耳廓狐',
  'mechanical eastern dragon':'机械东方龙', 'mechanical western dragon':'机械西方龙', 'mechanical wyvern':'机械飞龙', 'synthetic canine beastfolk':'合成犬科', 'synthetic feline beastfolk':'合成猫科', 'synthetic aquatic beastfolk':'合成水生兽人', 'synthetic avian beastfolk':'合成鸟兽人',
  'bionic black cat':'仿生黑猫', 'bionic tabby cat':'仿生狸花猫', 'bionic lynx':'仿生猞猁', 'bioengineered white tiger':'生化白虎', 'bioengineered saber tiger':'生化剑齿虎', 'armored shiba inu dog':'装甲柴犬', 'armored husky dog':'装甲哈士奇', 'armored shepherd dog':'装甲牧羊犬',
  'experimental wolf beastfolk':'实验狼兽人', 'experimental fox beastfolk':'实验狐兽人', 'experimental reptile beastfolk':'实验爬行兽人', 'experimental chimera beastfolk':'实验嵌合兽人',
  'cute and friendly':'可爱亲和', 'cool and reliable':'冷酷可靠', 'wild and dangerous':'野性危险', 'noble and mysterious':'高贵神秘', 'playful and lively':'活泼调皮', 'gentle and dependable':'温柔可靠', 'dark and ominous':'阴暗邪气',
  'clean anime character illustration style':'清爽日系立绘', 'Japanese kemono furry character design style':'日系兽设 / Kemono', 'warm storybook illustration style':'温暖绘本风', 'semi-realistic polished illustration style':'半写实插画', 'western cartoon character design style':'欧美卡通感', 'crisp cel-shaded animation style':'赛璐璐动画风', 'painterly concept art style':'厚涂概念图', 'game character concept art style':'游戏角色设定图',
  '0% anthro level, near-human kemonomimi character':'0% 近人类 / 兽耳人', '20% anthro level, lightly animalized kemono character':'20% 轻度兽化', '40% anthro level, balanced standard furry character':'40% 标准 furry', '60% anthro level, strong beastman furry character':'60% 强兽人', '80% anthro level, feral-leaning anthropomorphic beast character':'80% 野兽倾向', '100% anthro level, beast-shaped monster or divine animal character':'100% 兽形 / 怪物感',
  'modern city':'现代都市', 'fantasy beastfolk kingdom':'奇幻兽人王国', 'neon cyberpunk city':'霓虹赛博朋克都市', 'magic academy':'魔法学院', 'post-apocalyptic wasteland':'后末日废土', 'ocean civilization':'海洋文明', 'ancient mythological realm':'远古神话世界', 'spacefaring sci-fi colony':'太空科幻殖民地',
  'minimal clothing with tasteful accessories':'以饰品为主的轻量服装', 'modern streetwear outfit':'现代街头服装', 'fantasy adventurer outfit':'奇幻冒险者服装', 'cyberpunk techwear outfit':'赛博朋克机能服', 'tribal nature-inspired outfit':'自然部落风服装', 'noble formal attire':'贵族礼服', 'battle armor':'战斗装甲', 'mage or priest ceremonial robe':'魔法师或祭司礼袍',
  'slim build':'修长体型', 'athletic build':'运动型体型', 'soft rounded build':'柔和圆润体型', 'strong muscular build':'强壮肌肉体型', 'strong build':'强壮体型', 'tall elegant build':'高挑优雅体型',
  'pure white fur':'纯白色毛发', 'same white fur across the whole body':'全身统一白色毛发', 'pure black fur':'纯黑色毛发', 'same black fur across the whole body':'全身统一黑色毛发', 'pure gray fur':'纯灰色毛发', 'same gray fur across the whole body':'全身统一灰色毛发', 'pure brown fur':'纯棕色毛发', 'same brown fur across the whole body':'全身统一棕色毛发', 'clean solid-color coat':'干净的纯色毛被',
  'gray fur':'灰色毛发', 'white chest and muzzle':'白色胸口与吻部', 'darker back fur and tail tip':'较深的背部毛色与尾尖', 'orange fur':'橙色毛发', 'cream muzzle and belly':'奶油色吻部与腹部', 'dark ear tips and ringed tail':'深色耳尖与环纹尾巴', 'brown fur':'棕色毛发', 'tan chest fur':'浅棕色胸毛', 'subtle facial markings':'细微面部花纹',
  'black fur':'黑色毛发', 'white chest and face markings':'白色胸口与面部花纹', 'sharp high-contrast markings':'锐利的高对比花纹', 'white fur':'白色毛发', 'black ears and tail tip':'黑色耳朵与尾尖', 'clean monochrome pattern':'干净的黑白花纹',
  'golden amber fur':'金琥珀色毛发', 'cream belly':'奶油色腹部', 'soft red-brown accents':'柔和红棕色点缀', 'rust orange fur':'锈橙色毛发', 'warm beige chest':'暖米色胸口', 'copper markings':'铜色花纹',
  'deep blue-gray fur':'深蓝灰色毛发', 'pale icy chest':'浅冰蓝色胸口', 'silver markings':'银色花纹', 'teal fur':'蓝绿色毛发', 'white belly':'白色腹部', 'navy gradients':'海军蓝渐变',
  'lavender fur':'薰衣草紫毛发', 'starry blue markings':'星空蓝花纹', 'cyan fur':'青色毛发', 'purple gradients':'紫色渐变', 'glowing neon stripes':'发光霓虹条纹', 'pink and cream fur':'粉色与奶油色毛发', 'pastel blue accents':'浅蓝色点缀', 'heart-shaped facial marking':'心形面部花纹',
  'charcoal fur':'炭黑色毛发', 'dark red accents':'暗红色点缀', 'subtle shadow markings':'细微暗影花纹', 'midnight blue fur':'午夜蓝毛发', 'silver chest':'银色胸口', 'dim glowing markings':'微弱发光花纹',
  'medium wolf muzzle':'中等长度狼吻', 'pointed wolf ears':'尖狼耳', 'bushy wolf tail':'蓬松狼尾', 'short thick fur':'短而厚实的毛发', 'digitigrade legs':'趾行动物腿', 'paw feet':'爪掌足',
  'slender fox muzzle':'修长狐吻', 'large pointed fox ears':'大而尖的狐耳', 'large fluffy fox tail':'大而蓬松的狐尾', 'soft fluffy fur':'柔软蓬松的毛发',
  'friendly canine muzzle':'亲和的犬科吻部', 'floppy or pointed dog ears':'下垂或尖立的犬耳', 'curled dog tail':'卷曲犬尾', 'short soft fur':'短而柔软的毛发',
  'short feline muzzle':'短猫科吻部', 'pointed feline ears':'尖猫耳', 'long feline tail':'修长猫尾', 'soft sleek fur':'柔顺光滑的毛发', 'paw feet with retractable claws':'带可伸缩爪的爪掌足',
  'rounded tiger ears':'圆虎耳', 'long tiger tail':'长虎尾', 'striped fur':'虎纹毛发', 'large paw feet':'大型爪掌足',
  'rounded lion ears':'圆狮耳', 'tufted lion tail':'带尾簇的狮尾', 'golden fur with mane-like neck fluff':'金色毛发与鬃毛感颈部绒毛',
  'reptilian dragon snout':'爬行动物感龙吻', 'horns and fin-like ears':'角与鳍状耳', 'long dragon tail':'长龙尾', scales:'鳞片', 'digitigrade reptilian legs':'趾行爬行动物腿', 'clawed dragon feet':'龙爪足',
  'gentle deer muzzle':'温和鹿吻', 'side deer ears':'侧向鹿耳', 'short deer tail':'短鹿尾', 'short fur':'短毛', 'hoofed digitigrade legs':'带蹄的趾行腿', hooves:'蹄足',
  'small rabbit muzzle':'小兔吻', 'long rabbit ears':'长兔耳', 'round rabbit tail':'圆兔尾',
  'broad bear muzzle':'宽阔熊吻', 'round bear ears':'圆熊耳', 'short bear tail':'短熊尾', 'dense fur':'浓密毛发', 'plantigrade legs':'跖行动物腿', 'broad paw feet':'宽大爪掌足',
  'short raccoon muzzle':'短浣熊吻', 'rounded raccoon ears':'圆浣熊耳', 'ringed raccoon tail':'环纹浣熊尾',
  beak:'鸟喙', 'feather crest':'羽冠', 'feathered tail':'羽尾', feathers:'羽毛', 'avian legs':'鸟类腿', 'talon feet':'鸟爪足',
  'reptilian snake-like snout':'蛇类爬行动物吻部', 'no external ears':'无外耳', 'long serpentine tail':'细长蛇形尾', 'smooth scales':'光滑鳞片', 'digitigrade legs for turnaround clarity':'便于三视图辨认的趾行腿', 'clawed reptilian feet':'爬行动物爪足',
  'gentle goat muzzle':'温和山羊吻', 'side goat ears':'侧向山羊耳', 'short goat tail':'短山羊尾',
  'strong bovine muzzle':'结实牛科吻部', 'side bovine ears':'侧向牛耳', 'short bovine tail':'短牛尾',
  'long horse muzzle':'长马吻', 'upright horse ears':'竖立马耳', 'horse tail':'马尾', 'short coat':'短被毛',
  'small bat muzzle':'小蝙蝠吻', 'large bat ears':'大蝙蝠耳', 'short tail':'短尾', 'short fur with membrane wing details':'带翼膜细节的短毛', 'clawed feet':'爪足',
  'long crocodile snout':'长鳄鱼吻', 'small reptilian ear openings':'小型爬行动物耳孔', 'thick crocodile tail':'粗壮鳄鱼尾', 'armored scales':'装甲感鳞片',
  'shark-like muzzle':'鲨鱼感吻部', 'small fin-like ears':'小型鳍状耳', 'powerful shark tail':'有力的鲨鱼尾', 'smooth skin with subtle countershading':'带细微背腹渐变的光滑皮肤', 'webbed clawed feet':'带蹼的爪足',
  'reptilian lizard snout':'蜥蜴感爬行动物吻部', 'small fin-like ears':'小型鳍状耳', 'long lizard tail':'长蜥蜴尾',
  'rounded otter muzzle':'圆润水獭吻', 'small round ears':'小圆耳', 'thick otter tail':'粗水獭尾', 'sleek wet-looking fur':'湿润光泽感毛发', 'webbed paw feet':'带蹼爪掌足',
  'small agile build':'小巧灵活体型', 'heavy sturdy build':'厚重敦实体型',
  'charcoal black fur':'炭黑色毛发', 'shadowy color contrast':'暗影感色彩对比', 'sharp high-contrast color blocks':'锐利的高对比色块', 'soft candy-like palette':'柔和糖果色调', 'glowing neon accents':'发光霓虹点缀',
  'clean minimal markings':'干净少花纹', 'clear stripe markings':'清晰条纹', 'spotted markings':'斑点花纹', 'smooth color gradients':'平滑渐变色', 'mask-like facial markings':'面具感面部花纹', 'ring markings on tail and limbs':'尾巴与四肢环纹', 'glowing body markings':'发光身体纹路', 'ornate totem or magic markings':'华丽图腾或魔法纹',
  'amber golden eyes':'琥珀金瞳', 'icy blue eyes':'冰蓝色眼睛', 'emerald green eyes':'翠绿色眼睛', 'red eyes':'红色眼睛', 'purple eyes':'紫色眼睛', 'heterochromia eyes':'异色瞳', 'glowing luminous eyes':'发光瞳', 'deep black eyes':'黑色深瞳',
  'extra expressive tail design':'更有表现力的尾巴设计', 'distinctive ear silhouette':'更有辨识度的耳朵轮廓', 'horns or antlers':'角、鹿角或龙角', 'wings or wing membrane details':'翅膀或翼膜细节', 'mane or thick neck fluff':'鬃毛或厚实颈部蓬毛', 'scales or armor-like plates':'鳞片或甲片细节', 'mechanical prosthetic parts and glowing ports':'机械义体与发光接口', 'no extra special feature':'不额外强化特殊特征',
  'necklace or pendant':'项链或吊坠', earrings:'耳饰', scarf:'围巾', 'gloves or wrist guards':'手套或护腕', 'belt with small pouches':'腰带与小包', 'glasses or goggles':'眼镜或护目镜', 'ribbon or hair ornament':'丝带或发饰', 'no extra accessory':'不加装饰物',
  'light short jacket':'轻便短外套', 'layered clothing and straps':'多层次衣物与绑带', 'cloak or cape':'披风或斗篷', 'uniform-like tailoring':'制服感剪裁', 'partial armor pieces':'局部护甲', 'techwear straps and modular gear':'机能绑带与模块化装备', 'long robe with hanging fabric':'长袍与垂坠布料', 'simple clean clothing details':'简洁干净的服装细节',
  'balanced detail level':'平衡细节密度', 'clean and concise design':'简洁清楚的设计', 'richly detailed design':'细节丰富的设计', 'reference-sheet focused design':'偏角色卡和三视图设定的设计',
  ranger:'巡林者', guardian:'守护者', adventurer:'冒险者', 'street dancer':'街舞者', mage:'法师', priest:'祭司', mechanic:'机械师', captain:'船长', scout:'侦察者', alchemist:'炼金术士', knight:'骑士', idol:'偶像', healer:'治疗者'
};

function cn(value){ return zhTerms[value] || value; }
function cnColor(color){ return color.map(cn); }
function cnJoin(values){ return (Array.isArray(values) ? values : [values]).map(cn).join('、'); }
function enJoin(values){ return (Array.isArray(values) ? values : [values]).filter(Boolean).join(', '); }

let state = {};
let character = null;
let activeTab = 'description';
let locked = new Set();
let selectedEditField = null;
let manualOverrides = {};
let currentStep = 0;
let wizardStarted = false;
let currentImageProvider = 'banana';
const imageProviderConfigs = {
  banana: { label: 'Banana', buttonId: 'bananaGenerateBtn', endpoint: '/api/banana-generate' },
  gpt: { label: 'GPT-Image-2', buttonId: 'gptGenerateBtn', endpoint: '/api/gpt-generate' },
  falGpt: { label: 'GPT fal.ai', buttonId: 'falGptGenerateBtn', endpoint: '/api/fal-gpt-generate' }
};
function imageProviderConfig(provider){ return imageProviderConfigs[provider] || imageProviderConfigs.banana; }

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function resolve(value, options){ return value === 'random' || value === 'auto' ? pick(options) : value; }
function sanitizeCustomInput(value, maxLength = 12){
  return String(value || '').replace(/[<>\[\]{}$"'\\]/g, '').replace(/`/g, '').replace(/[\r\n\t]/g, '').trim().slice(0, maxLength);
}
function appendCustom(base, custom){
  const clean = sanitizeCustomInput(custom);
  if(!clean) return base;
  return base ? base + ', ' + clean : clean;
}
function appendCustomList(list, custom){
  const arr = Array.isArray(list) ? [...list] : (list ? [list] : []);
  const clean = sanitizeCustomInput(custom);
  if(clean) arr.push(clean);
  return arr;
}
function customFurColorDesign(custom, fallback){
  const clean = sanitizeCustomInput(custom);
  if(!clean) return fallback;
  return [clean, '与' + clean + '协调的辅色', '与' + clean + '协调的色彩点缀'];
}
function resolveMulti(value, options, maxCount = Infinity){
  const selected = Array.isArray(value) ? value : [value || 'random'];
  if(selected.includes('none')) return [];
  const usable = options.filter(k => k !== 'none' && k !== 'random');
  if(selected.includes('random')){
    return pickQuestionValues({ multiple: true, maxSelect: maxCount === Infinity ? undefined : maxCount }, usable.map(v => [v, v]));
  }
  return selected.filter(k => usable.includes(k)).slice(0, maxCount);
}

function optionValues(options, includeNone = true){
  return (options || []).map(([value]) => value).filter(value => value !== 'random' && (includeNone || value !== 'none'));
}

function pickQuestionValue(q, options){
  const values = optionValues(options, false);
  return values.length ? pick(values) : (options && options[0] ? options[0][0] : null);
}

function pickQuestionValues(q, options){
  const values = optionValues(options, false);
  if(!values.length) return ['none'];
  const pool = [...values];
  const max = Math.min(q.maxSelect || 3, pool.length);
  const count = q.maxSelect === 2 ? 1 + Math.floor(Math.random() * max) : 1 + Math.floor(Math.random() * Math.min(3, max));
  const picked = [];
  while(picked.length < count && pool.length){
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

function settleQuestionRandom(q, options){
  const current = state[q.id];
  if(q.multiple){
    if(!Array.isArray(current) || current.length === 0 || current.includes('random')){
      state[q.id] = pickQuestionValues(q, options);
    }
  }else if(current === 'random' || current === 'auto' || current === null || current === undefined){
    const picked = pickQuestionValue(q, options);
    if(picked !== null) state[q.id] = picked;
  }
}

function settleAllRandomChoices(){
  questions.forEach(q => {
    settleQuestionRandom(q, getQuestionOptions(q));
  });
}
function characterExportData(){
  const base = character || buildCharacter();
  return {
    ...base,
    state: { ...state },
    locked: Array.from(locked),
    manualOverrides: { ...manualOverrides },
    appVersion: window.APP_VERSION || '',
    chineseSummary: zhSummary(base),
    chineseDescription: zhDescription(base),
    bananaPrompt: bananaPrompt(base),
    negativePrompt: negativePrompt()
  };
}

function promptPairText(){
  const base = character || buildCharacter();
  return '[Positive Prompt]\n' + bananaPrompt(base) + '\n\n[Negative Prompt]\n' + negativePrompt();
}

function restoreFromImportedData(data){
  if(!data || typeof data !== 'object') throw new Error('JSON 格式不正确');
  if(data.state && typeof data.state === 'object') state = { ...state, ...data.state };
  const nextCharacter = data.character && typeof data.character === 'object' ? data.character : data;
  if(!nextCharacter.species && !nextCharacter.chineseSummary && !nextCharacter.bananaPrompt) throw new Error('没有找到可恢复的角色数据');
  character = { ...nextCharacter };
  delete character.state;
  delete character.locked;
  delete character.manualOverrides;
  delete character.appVersion;
  delete character.chineseSummary;
  delete character.chineseDescription;
  delete character.bananaPrompt;
  delete character.negativePrompt;
  locked = new Set(Array.isArray(data.locked) ? data.locked : []);
  manualOverrides = data.manualOverrides && typeof data.manualOverrides === 'object' ? { ...data.manualOverrides } : {};
  selectedEditField = null;
  activeTab = 'description';
  setViewMode('result');
  setHeroVisible(true);
  document.querySelector('.form-panel').style.display = 'none';
  document.querySelector('.result-panel').style.display = 'block';
  renderResult();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindManualCharCounters(){
  document.querySelectorAll('[data-count-for]').forEach(counter => {
    const input = document.getElementById(counter.dataset.countFor);
    if(!input) return;
    const max = Number(input.getAttribute('maxlength')) || 0;
    const update = () => {
      const clean = sanitizeCustomInput(input.value, max);
      if(input.value !== clean) input.value = clean;
      counter.textContent = input.value.length + ' / ' + max;
      counter.classList.toggle('near-limit', max > 0 && input.value.length >= Math.floor(max * 0.8));
    };
    input.addEventListener('input', update);
    update();
  });
}
const editableFieldConfigs = {
  species: { title:'物种 / 品种', desc:'决定角色的基础种族名称。注意：这里默认只替换名称，不会自动重建头部、尾巴、体表和腿脚结构。', risk:true, max:30, placeholder:'如：九尾狐、雪原狮鹫、机械白狼', partial:'species', get:c=>c.species, apply(v,c){ c.species = v; } },
  anthro: { title:'拟人程度 / 形体比例', desc:'这是高风险结构字段，会影响姿态、腿脚、手部、体表覆盖和生图硬约束。建议写成百分比或明确解剖补充。', risk:true, max:60, placeholder:'如：60%左右，腿更像狼，但手仍保留人手结构', partial:'anthro', get:c=>c.anthroLabel || c.anthro, apply(v,c){ c.anthroLabel = v; c.anthroGuidance = (c.anthroGuidance || '') + ' User anatomy override: ' + v; } },
  bodyType: { title:'体型轮廓', desc:'决定三视图剪影和身体比例，例如修长、厚重、运动型、小巧等。', risk:true, max:40, placeholder:'如：修长但有爆发力的体型', partial:'bodyType', get:c=>c.bodyType, apply(v,c){ c.bodyType = v; } },
  temperament: { title:'整体气质', desc:'决定角色第一印象和描述用词，会影响表情、姿态和氛围。', max:30, placeholder:'如：高冷但有恶作剧感', partial:'temperament', get:c=>c.temperament, apply(v,c){ c.temperament = v; } },
  artStyle: { title:'画风倾向', desc:'决定最终图片的视觉风格，例如厚涂、赛璐璐、绘本、半写实等。', risk:true, max:40, placeholder:'如：厚涂日系设定稿', partial:'artStyle', get:c=>c.artStyle, apply(v,c){ c.artStyle = v; state.customArtStyle = v; } },
  world: { title:'世界观', desc:'决定角色出身和环境氛围。多个世界观可以用逗号、顿号或斜杠分隔。', max:40, placeholder:'如：雪原王国，古代遗迹', partial:'world', get:c=>cnJoin(c.worlds || c.world), apply(v,c){ const arr = splitCustomList(v); c.worlds = arr; c.world = enJoin(arr); state.customWorld = v; } },
  color: { title:'毛色 / 主色基调', desc:'决定身体主要毛色、辅色和点缀色，会写入中文描述与正向提示词。', max:30, placeholder:'如：黑蓝渐变毛色，胸口银白', partial:'color', get:c=>cnColor(c.color || []).join('、'), apply(v,c){ c.color = customFurColorDesign(v, c.color || []); state.customFurColor = v; } },
  marking: { title:'花纹类型', desc:'决定条纹、斑点、渐变、面纹、图腾或发光纹等身体标记。', max:30, placeholder:'如：眉心月纹和尾巴环纹', partial:'marking', get:c=>c.marking, apply(v,c){ c.marking = v; state.customMarking = v; } },
  eyeColor: { title:'瞳色', desc:'决定眼睛颜色和辨识度，尤其影响头像、角色卡和三视图一致性。', max:24, placeholder:'如：左金右蓝异色瞳', partial:'eyeColor', get:c=>c.eyeColor, apply(v,c){ c.eyeColor = v; state.customEyeColor = v; } },
  head: { title:'头部特征', desc:'包含吻部、耳朵、头部轮廓等，会影响物种识别度。', risk:true, max:50, placeholder:'如：短吻、单尖耳、左耳缺口、厚颈毛', partial:'head', get:c=>c.headFeature || `${c.muzzle}, ${c.ears}`, apply(v,c){ c.headFeature = v; } },
  specialFeature: { title:'重点外形特征', desc:'用于强化尾巴、耳朵、角、翅膀、鬃毛、鳞片、机械义体等记忆点。多个特征可用逗号分隔。', max:50, placeholder:'如：断角金纹，背部小翼膜', partial:'specialFeature', get:c=>cnJoin(c.specialFeatures || c.specialFeature), apply(v,c){ const arr = splitCustomList(v); c.specialFeatures = arr; c.specialFeature = enJoin(arr); state.customFeature = v; } },
  accessory: { title:'装饰物', desc:'决定项链、耳饰、围巾、护腕、腰包、眼镜、发饰等角色记忆点。多个装饰可用逗号分隔。', max:50, placeholder:'如：铃铛项圈，旧金属护目镜', partial:'accessory', get:c=>cnJoin(c.accessories || c.accessory), apply(v,c){ const arr = splitCustomList(v); c.accessories = arr; c.accessory = enJoin(arr); state.customAccessory = v; } },
  outfit: { title:'服装风格', desc:'决定整体衣装大方向，例如街头、奇幻、赛博、部落、礼服、装甲等。', max:40, placeholder:'如：学院披肩和短靴', partial:'outfit', get:c=>c.outfit, apply(v,c){ c.outfit = v; state.customOutfit = v; } },
  outfitDetail: { title:'服装细节', desc:'补充衣服层次、剪裁、绑带、披风、护甲、机能模块等细节。', max:50, placeholder:'如：多层次衣物与金属绑带', partial:'outfitDetail', get:c=>c.outfitDetail, apply(v,c){ c.outfitDetail = v; state.customOutfitDetail = v; } },
  tail: { title:'尾巴', desc:'决定尾巴形状、数量、蓬松度和标志性轮廓。', risk:true, max:40, placeholder:'如：九条蓬松狐尾，尾尖发光', partial:'head', get:c=>c.tail, apply(v,c){ c.tail = v; } },
  covering: { title:'体表覆盖', desc:'高风险结构字段，决定是皮肤、毛发、羽毛、鳞片、机械外壳还是混合覆盖。', risk:true, max:50, placeholder:'如：胸腹短毛，四肢有厚实长毛', partial:'anthro', get:c=>c.covering, apply(v,c){ c.covering = v; } },
  legStructure: { title:'腿部结构', desc:'高风险结构字段，决定人腿、跖行、趾行、兽腿、蹄足等解剖方向。', risk:true, max:50, placeholder:'如：偏狼的强趾行腿，但站姿仍直立', partial:'anthro', get:c=>c.legStructure, apply(v,c){ c.legStructure = v; } },
  footType: { title:'足部结构', desc:'高风险结构字段，决定人脚、爪足、蹄、鸟爪、蹼足等，会直接影响三视图。', risk:true, max:50, placeholder:'如：大号爪足，有清晰肉垫', partial:'anthro', get:c=>c.footType, apply(v,c){ c.footType = v; } },
  promptTemplate: { title:'最终版式模板', desc:'决定图片版式，例如标准三视图、完整设定板、头像角色卡或模型表。自由输入可能让版式不稳定。', risk:true, max:60, placeholder:'如：三视图+头像+配色板', partial:'detailLevel', get:c=>c.promptTemplateLabel || selectedPromptTemplate(c).cn, apply(v,c){ c.promptTemplateLabel = v; c.promptTemplateCustom = v; } },
  detailLevel: { title:'生成细节密度', desc:'决定描述和设定板细节是简洁、平衡、丰富还是偏角色卡。', max:30, placeholder:'如：细节丰富但保持清楚', partial:'detailLevel', get:c=>c.detailLevel, apply(v,c){ c.detailLevel = v; } }
};

function splitCustomList(value){
  return String(value || '').split(/[，,、/|]/).map(v => sanitizeCustomInput(v, 24)).filter(Boolean);
}

function displayValueForField(key){
  const cfg = editableFieldConfigs[key];
  if(!cfg || !character) return '';
  return cn(cfg.get(character) || '');
}

function selectEditField(key){
  if(!editableFieldConfigs[key]) return;
  selectedEditField = key;
  renderFieldEditor();
}

function renderFieldEditor(){
  const empty = document.getElementById('fieldEditorEmpty');
  const editor = document.getElementById('fieldEditor');
  if(!empty || !editor) return;
  const cfg = editableFieldConfigs[selectedEditField];
  if(!cfg){
    empty.hidden = false;
    editor.hidden = true;
    return;
  }
  empty.hidden = true;
  editor.hidden = false;
  const title = document.getElementById('editFieldTitle');
  const desc = document.getElementById('editFieldDesc');
  const current = document.getElementById('editFieldCurrent');
  const risk = document.getElementById('editFieldRisk');
  const input = document.getElementById('editFieldInput');
  const count = document.getElementById('editFieldCount');
  if(title) title.textContent = cfg.title;
  if(desc){ desc.textContent = cfg.desc; desc.classList.toggle('is-risk', !!cfg.risk); }
  if(current) current.textContent = displayValueForField(selectedEditField) || '暂无内容';
  if(risk) risk.hidden = !cfg.risk;
  if(input){
    input.maxLength = cfg.max || 30;
    input.placeholder = cfg.placeholder || '输入你想替换的内容';
    input.value = manualOverrides[selectedEditField] || '';
  }
  updateFieldEditorCount();
}

function updateFieldEditorCount(){
  const input = document.getElementById('editFieldInput');
  const count = document.getElementById('editFieldCount');
  const cfg = editableFieldConfigs[selectedEditField];
  if(!input || !count || !cfg) return;
  const clean = sanitizeCustomInput(input.value, cfg.max || 30);
  if(input.value !== clean) input.value = clean;
  count.textContent = input.value.length + ' / ' + (cfg.max || 30);
  count.classList.toggle('near-limit', input.value.length >= Math.floor((cfg.max || 30) * 0.8));
}

function applyFieldEdit(){
  const cfg = editableFieldConfigs[selectedEditField];
  const input = document.getElementById('editFieldInput');
  if(!cfg || !input) return;
  if(!character) showResultPage();
  const clean = sanitizeCustomInput(input.value, cfg.max || 30);
  if(!clean) return;
  manualOverrides[selectedEditField] = clean;
  cfg.apply(clean, character);
  locked.add(selectedEditField);
  renderResult();
}

function rerollSelectedField(){
  const cfg = editableFieldConfigs[selectedEditField];
  if(!cfg) return;
  locked.delete(selectedEditField);
  delete manualOverrides[selectedEditField];
  generate({ [cfg.partial || selectedEditField]: true });
}

function unlockSelectedField(){
  if(!selectedEditField) return;
  locked.delete(selectedEditField);
  delete manualOverrides[selectedEditField];
  renderResult();
}
function init(){
  currentStep = 0;
  activeTab = 'description';
  selectedEditField = null;
  manualOverrides = {};
  state = { speciesCategory:null, speciesChoice:null, speciesVariant:null, anthro:'anthro40', bodyTypeChoice:'athletic', temperament:'cool', artStyle:'game-concept', customArtStyle:'', furColor:'random', customFurColor:'', markingChoice:'random', customMarking:'', eyeColor:'random', customEyeColor:'', featureDetail:['random'], customFeature:'', accessory:['random'], customAccessory:'', outfitStyle:'fantasy', customOutfit:'', outfitDetail:'random', customOutfitDetail:'', world:['random'], customWorld:'', detailLevel:'balanced', promptTemplate:'turnaround' };
  wizardStarted = false;
  bindStatic();
  showHomePage();
}

function setViewMode(mode){
  document.body.classList.toggle('is-home', mode === 'home');
  document.body.classList.toggle('is-wizard', mode === 'wizard');
  document.body.classList.toggle('is-result', mode === 'result');
}

function setHeroVisible(visible){
  const hero = document.querySelector('.hero');
  if(hero) hero.style.display = visible ? 'block' : 'none';
}

function showHomePage(){
  wizardStarted = false;
  setViewMode('home');
  setHeroVisible(true);
  document.querySelector('.form-panel').style.display = 'none';
  document.querySelector('.result-panel').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startWizard(){
  currentStep = 0;
  wizardStarted = true;
  renderQuestions();
}

function showQuestionPage(){
  setViewMode('wizard');
  setHeroVisible(false);
  document.querySelector('.form-panel').style.display = 'block';
  document.querySelector('.result-panel').style.display = 'none';
}

function showResultPage(){
  settleAllRandomChoices();
  setViewMode('result');
  setHeroVisible(true);
  document.querySelector('.form-panel').style.display = 'none';
  document.querySelector('.result-panel').style.display = 'block';
  generate();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderQuestions(){
  showQuestionPage();
  const box = document.getElementById('questions');
  const q = questions[currentStep];
  const options = getQuestionOptions(q);
  const progress = Math.round(((currentStep + 1) / questions.length) * 100);
  box.innerHTML = `
    <div class="step-meta">
      <span>第 ${currentStep + 1} / ${questions.length} 步</span>
      <div class="step-bar"><i style="width:${progress}%"></i></div>
      <span>${progress}%</span>
    </div>
    <div class="question wizard-question step-fade">
      <h3>${q.title}</h3>
      <p class="wizard-tip">${q.tip || '每一步只选一个方向；不确定就选“随机 / 随便”，系统会自动补全细节。'}</p>
      ${q.multiple ? '<p class="wizard-tip">可多选；再次点击已选项可取消。</p>' : ''}
      ${q.maxSelect ? '<p class="wizard-tip">最多可选 ' + q.maxSelect + ' 个。</p>' : ''}
      <div class="options"></div>
      ${q.custom ? '<div class="custom-field custom-field-prominent"><div class="custom-title">✍ 也可以自己写</div><label>自定义补充（最多12字）<input id="customInput" maxlength="12" placeholder="' + (q.customPlaceholder || '输入自定义内容') + '" value="' + sanitizeCustomInput(state[q.customKey]) + '"></label><p class="custom-note">如果选项里没有想要的设定，就写在这里；会进入最终描述和 Banana 提示词。</p></div>' : ''}
    </div>
    <div class="wizard-nav">
      <button class="ghost" id="prevStepBtn">上一步</button>
      ${q.required ? '' : '<button class="ghost" id="skipStepBtn">跳过，交给系统随机</button>'}
      <button class="primary right" id="nextStepBtn">${currentStep === questions.length - 1 ? '生成结果' : '下一步'}</button>
    </div>`;
  const opts = box.querySelector('.options');
  options.forEach(([value,label]) => {
    const btn = document.createElement('button');
    const selectedValues = Array.isArray(state[q.id]) ? state[q.id] : [state[q.id]];
    btn.className = 'option' + (selectedValues.includes(value) ? ' active' : '');
    btn.textContent = label;
    btn.onclick = () => {
      if(q.multiple){
        let current = Array.isArray(state[q.id]) ? [...state[q.id]] : [];
        const hasNoneOption = options.some(([optionValue]) => optionValue === 'none');
        if(value === 'random'){
          current = ['random'];
        }else if(value === 'none'){
          current = ['none'];
        }else{
          current = current.filter(v => v !== 'none' && v !== 'random');
          current = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
          if(q.maxSelect && current.length > q.maxSelect) current = current.slice(current.length - q.maxSelect);
          if(current.length === 0) current = hasNoneOption ? ['none'] : ['random'];
        }
        state[q.id] = current;
      }else{
        state[q.id] = value === 'random' ? pickQuestionValue(q, options) : value;
      }
      if(q.id === 'speciesCategory') { state.speciesChoice = null; state.speciesVariant = null; }
      if(q.id === 'speciesChoice') state.speciesVariant = null;
      character = null;
      renderQuestions();
    };
    opts.appendChild(btn);
  });
  const customInput = document.getElementById('customInput');
  if(customInput && q.customKey){
    customInput.oninput = () => {
      const clean = sanitizeCustomInput(customInput.value);
      if(customInput.value !== clean) customInput.value = clean;
      state[q.customKey] = clean;
      character = null;
    };
  }
  document.getElementById('prevStepBtn').disabled = currentStep === 0;
  document.getElementById('prevStepBtn').onclick = () => { if(currentStep > 0){ currentStep--; renderQuestions(); } };
  const skipBtn = document.getElementById('skipStepBtn');
  if(skipBtn){
    skipBtn.onclick = () => {
      state[q.id] = q.multiple ? pickQuestionValues(q, options) : pickQuestionValue(q, options);
      character = null;
      if(currentStep < questions.length - 1){ currentStep++; renderQuestions(); } else { showResultPage(); }
    };
  }
  const nextBtn = document.getElementById('nextStepBtn');
  if(q.required && (state[q.id] === null || state[q.id] === undefined)){
    nextBtn.disabled = true;
    nextBtn.textContent = '请先选择';
  }
  nextBtn.onclick = () => {
    if(q.required && (state[q.id] === null || state[q.id] === undefined)) return;
    settleQuestionRandom(q, options);
    character = null;
    if(currentStep < questions.length - 1){ currentStep++; renderQuestions(); } else { showResultPage(); }
  };
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function getQuestionOptions(q){
  if(q.dynamic === 'species') return speciesDetailOptions[state.speciesCategory || 'common'];
  if(q.dynamic === 'variant') return getVariantOptions(state.speciesChoice || 'random', state.speciesCategory || 'common');
  return q.options;
}

function getVariantOptions(species, category){
  const base = species === 'random' || !species ? pick(pools[category] || pools.common) : species;
  return speciesVariantOptions[base] || [[base, cn(base)], ['random', '随机一个细分']];
}

function pickBaseSpecies(category){
  return pick(pools[category] || pools.common);
}

function pickVariantFor(base){
  const options = speciesVariantOptions[base];
  if(!options) return base;
  return pick(options.filter(([value]) => value !== 'random').map(([value]) => value));
}

function buildSpecies(category){
  let base = state.speciesChoice || 'random';
  if(base === 'random'){
    base = pickBaseSpecies(category);
    state.speciesChoice = base;
  }
  let variant = state.speciesVariant || 'random';
  if(variant === 'random'){
    variant = pickVariantFor(base);
    state.speciesVariant = variant;
  }
  return variant || base;
}

function baseSpeciesName(species){
  if(species.includes('dog')) return 'dog';
  if(species.includes('wolf')) return 'wolf';
  if(species.includes('fox')) return 'fox';
  if(species.includes('cat') || species.includes('lynx')) return 'cat';
  if(species.includes('tiger')) return 'tiger';
  if(species.includes('lion')) return 'lion';
  if(species.includes('dragon') || species.includes('wyvern')) return 'dragon';
  if(species.includes('deer') || species.includes('reindeer') || species.includes('moose')) return 'deer';
  if(species.includes('rabbit') || species.includes('hare') || species.includes('jackrabbit')) return 'rabbit';
  if(species.includes('bear') || species.includes('panda')) return 'bear';
  if(species.includes('raccoon') || species.includes('tanuki')) return 'raccoon';
  if(species.includes('avian') || species.includes('eagle') || species.includes('owl') || species.includes('raven') || species.includes('parrot') || species.includes('crane') || species.includes('penguin') || species.includes('phoenix')) return 'bird';
  if(species.includes('snake') || species.includes('cobra') || species.includes('python') || species.includes('viper')) return 'snake';
  if(species.includes('goat') || species.includes('ibex') || species.includes('ram')) return 'goat';
  if(species.includes('bull') || species.includes('buffalo') || species.includes('yak') || species.includes('bison') || species.includes('cattle')) return 'bull';
  if(species.includes('horse') || species.includes('zebra') || species.includes('mustang') || species.includes('unicorn')) return 'horse';
  if(species.includes('bat')) return 'bat';
  if(species.includes('crocodile') || species.includes('alligator') || species.includes('gharial') || species.includes('caiman')) return 'crocodile';
  if(species.includes('shark')) return 'shark';
  if(species.includes('lizard') || species.includes('gecko') || species.includes('iguana') || species.includes('chameleon') || species.includes('axolotl')) return 'lizard';
  if(species.includes('otter')) return 'otter';
  return species.split(' ')[0].replace(/[^a-z-]/g,'');
}

function buildAccessories(){
  const selected = resolveMulti(state.accessory, Object.keys(maps.accessory), 3);
  const base = selected.length ? selected.map(k => maps.accessory[k]).filter(Boolean) : [maps.accessory.none];
  return appendCustomList(base, state.customAccessory);
}

function buildFeatures(){
  const selected = resolveMulti(state.featureDetail, Object.keys(maps.featureDetail), 3);
  const base = selected.length ? selected.map(k => maps.featureDetail[k]).filter(Boolean) : [maps.featureDetail.none];
  return appendCustomList(base, state.customFeature);
}

function buildWorlds(){
  const selected = resolveMulti(state.world, Object.keys(maps.world), 2);
  const base = selected.length ? selected.map(k => maps.world[k]).filter(Boolean) : [maps.world.modern];
  return appendCustomList(base, state.customWorld);
}

function canUpdate(key, next, partial){
  return !next[key] || partial[key] || partial.all;
}

function canUpdateLocked(key, next, partial){
  return !locked.has(key) && canUpdate(key, next, partial);
}

function buildCharacter(partial = {}){
  const next = character ? {...character} : {};
  const previousSpecies = next.species;
  const category = state.speciesCategory;

  if(canUpdateLocked('species', next, partial)) next.species = buildSpecies(category);
  const speciesChanged = previousSpecies !== next.species;
  const base = speciesDefaults[baseSpeciesName(next.species)] || speciesDefaults.wolf;

  const furKey = resolve(state.furColor, Object.keys(maps.furColor));
  if(canUpdateLocked('color', next, partial)) next.color = customFurColorDesign(state.customFurColor, [...maps.furColor[furKey]]);
  if(canUpdateLocked('marking', next, partial)) next.marking = appendCustom(maps.marking[resolve(state.markingChoice, Object.keys(maps.marking))], state.customMarking);
  if(canUpdateLocked('eyeColor', next, partial)) next.eyeColor = appendCustom(maps.eyeColor[resolve(state.eyeColor, Object.keys(maps.eyeColor))], state.customEyeColor);
  if(!locked.has('specialFeature') && (!next.specialFeatures || partial.specialFeature || partial.all)){
    next.specialFeatures = buildFeatures();
    next.specialFeature = enJoin(next.specialFeatures);
  }
  if(!locked.has('accessory') && (!next.accessories || partial.accessory || partial.all)){
    next.accessories = buildAccessories();
    next.accessory = enJoin(next.accessories);
  }
  if(canUpdateLocked('outfit', next, partial)) next.outfit = appendCustom(maps.outfitStyle[resolve(state.outfitStyle, Object.keys(maps.outfitStyle))], state.customOutfit);
  if(canUpdateLocked('outfitDetail', next, partial)) next.outfitDetail = appendCustom(maps.outfitDetail[resolve(state.outfitDetail, Object.keys(maps.outfitDetail))], state.customOutfitDetail);
  if(canUpdateLocked('detailLevel', next, partial)) next.detailLevel = maps.detailLevel[resolve(state.detailLevel, Object.keys(maps.detailLevel))];
  next.promptTemplate = promptTemplates[state.promptTemplate] ? state.promptTemplate : 'turnaround';
  next.promptTemplateLabel = selectedPromptTemplate(next).cn;
  if(canUpdateLocked('anthro', next, partial)){
    const anthroKey = normalizeAnthroKey(state.anthro);
    const profile = anthroProfiles[anthroKey] || anthroProfiles.anthro40;
    next.anthroKey = anthroKey;
    next.anthroPercent = profile.percent;
    next.anthroLabel = profile.cn;
    next.anthro = maps.anthro[anthroKey];
    next.anthroGuidance = profile.guidance;
    next.anthroPosture = profile.posture;
    next.anthroHandType = profile.handType;
  }
  if(canUpdateLocked('temperament', next, partial)) next.temperament = maps.temperament[resolve(state.temperament, Object.keys(maps.temperament))];
  if(canUpdateLocked('artStyle', next, partial)) next.artStyle = appendCustom(maps.artStyle[resolve(state.artStyle, Object.keys(maps.artStyle))], state.customArtStyle);
  if(!locked.has('world') && (!next.worlds || partial.world || partial.all)){
    next.worlds = buildWorlds();
    next.world = enJoin(next.worlds);
  }
  if(canUpdateLocked('bodyType', next, partial)) next.bodyType = maps.bodyType[resolve(state.bodyTypeChoice, Object.keys(maps.bodyType))];

  if(speciesChanged || !next.muzzle || partial.head || partial.all){
    if(!locked.has('head')){ next.muzzle = base[0]; next.ears = base[1]; }
    if(!locked.has('tail')) next.tail = base[2];
    if(!locked.has('covering')) next.covering = base[3];
    if(!locked.has('legStructure')) next.legStructure = base[4];
    if(!locked.has('footType')) next.footType = base[5];
  }
  if(canUpdateLocked('anthro', next, partial)){
    const profile = anthroProfiles[next.anthroKey] || anthroProfiles.anthro40;
    if(!locked.has('covering')) next.covering = profile.covering;
    if(!locked.has('legStructure')) next.legStructure = profile.legStructure;
    if(!locked.has('footType')) next.footType = profile.footType;
  }
  if(canUpdateLocked('head', next, partial)) next.headFeature = `${next.muzzle}, ${next.ears}`;
  delete next.profession;
  return next;
}

function selectedPromptTemplate(c){
  const id = c.promptTemplate || state.promptTemplate || 'turnaround';
  return promptTemplates[id] ? { id, ...promptTemplates[id] } : { id: 'turnaround', ...promptTemplates.turnaround };
}

function zhSummary(c){
  const color = cnColor(c.color);
  const template = selectedPromptTemplate(c);
  return `一名气质偏${cn(c.temperament)}的${cn(c.species)}角色，拟人程度为${c.anthroLabel || cn(c.anthro)}。体型为${cn(c.bodyType)}，主毛色是${color[0]}，辅色为${color[1]}，色彩点缀为${color[2]}，花纹类型是${cn(c.marking)}，瞳色为${cn(c.eyeColor)}。额外细节为${cn(c.headFeature || `${c.muzzle}, ${c.ears}`)}，尾巴为${cn(c.tail)}，重点特征是${cnJoin(c.specialFeatures || c.specialFeature)}。装饰物为${cnJoin(c.accessories || c.accessory)}，服装为${cn(c.outfit)}，细节是${cn(c.outfitDetail)}，来自${cnJoin(c.worlds || c.world)}。画风倾向为${cn(c.artStyle)}。最终版式为${template.cn}。`;
}

function zhDescription(c){
  const color = cnColor(c.color);
  const template = selectedPromptTemplate(c);
  return `这是一名以${cn(c.species)}为方向的拟人兽人角色，整体气质偏${cn(c.temperament)}。角色采用${c.anthroLabel || cn(c.anthro)}的设计方向，体型轮廓是${cn(c.bodyType)}，姿态为${cn(c.anthroPosture || '')}，腿部结构为${cn(c.legStructure)}，足部为${cn(c.footType)}，手部为${cn(c.anthroHandType || '')}。

外观上，角色身体覆盖${cn(c.covering)}，主毛色是${color[0]}，胸腹、吻部或局部辅色为${color[1]}，整体点缀为${color[2]}。花纹设计采用${cn(c.marking)}，瞳色为${cn(c.eyeColor)}，需要在正面头像和三视图中保持一致。额外补充细节为${cn(c.headFeature || `${c.muzzle}, ${c.ears}`)}，尾巴设计为${cn(c.tail)}，额外强化点是${cnJoin(c.specialFeatures || c.specialFeature)}。

装饰物选择${cnJoin(c.accessories || c.accessory)}，服装方向是${cn(c.outfit)}，并加入${cn(c.outfitDetail)}作为细节层次。服装需要适配兽人身体结构，保持完整穿着，不裸露，同时让关键毛色和花纹仍然可见。角色来自${cnJoin(c.worlds || c.world)}。整体画风倾向为${cn(c.artStyle)}，细节密度为${cn(c.detailLevel)}，最终版式为${template.cn}：${template.description}`;
}

function characterPromptCore(c){
  return `[ANTHRO LEVEL] ${c.anthroLabel || c.anthro} (${c.anthroPercent ?? ''}%). This is a hard anatomy constraint, not a mood label. ${c.anthroGuidance || ''}
[ANATOMY DETAILS] Posture: ${c.anthroPosture || 'upright bipedal posture'}. Legs: ${c.legStructure}. Feet: ${c.footType}. Hands: ${c.anthroHandType || 'readable hands or paws'}. Body covering: ${c.covering}. Keep every view at the same anthro percentage and do not drift toward a generic human body.

STYLIZED CHARACTER based on ${c.species}. The character has a ${c.bodyType}, ${c.legStructure}, ${c.footType}, expressive ${c.eyeColor}, and ${c.tail}. Additional design notes: ${c.headFeature || `${c.muzzle}, ${c.ears}`}. Body covering: ${c.covering}. Color design: ${enJoin(c.color)}. Marking design: ${c.marking}. Special features: ${enJoin(c.specialFeatures || c.specialFeature)}. Accessories: ${enJoin(c.accessories || c.accessory)}. World setting fusion: ${enJoin(c.worlds || c.world)}. Personality impression: ${c.temperament}. Art style: ${c.artStyle}.

[OUTFIT] ${c.outfit}, ${c.outfitDetail}, fully clothed, pants, skirt, or robe clearly visible, no nudity. Clothing adapted for furry anatomy while keeping important body markings visible.

[BODY TYPE] ${c.bodyType}, ${c.anthroPosture || 'neutral standing pose'}, clear readable silhouette, arms slightly away from body. Detail density: ${c.detailLevel}.`;
}

function templatePrompt(c){
  const template = selectedPromptTemplate(c).id;
  if(template === 'designBoard') return `[LAYOUT TEMPLATE] Complete fantasy RPG character design board / character reference sheet on a 16:9 wide horizontal canvas.

Include a large central three-view turnaround of the same character: front view, side view, and back view, arranged left-to-right with consistent proportions and identical outfit. Add a bust portrait close-up panel, several small detail panels for accessories, markings, necklace, arm wraps, tail fur, clothing materials, a separate equipment or weapon design panel, a color palette swatch section, and an emblem / tribal symbol section. Use clean thin panel borders, elegant fantasy UI layout, parchment or artbook presentation. Use empty text boxes and placeholder label areas only; no readable text, no random letters.`;
  if(template === 'profileCard') return `[LAYOUT TEMPLATE] Character profile card presentation on a 16:9 wide horizontal canvas.

Create a large polished bust portrait and a smaller full-body standing view of the same character. Add decorative profile information boxes, color palette swatches, accessory detail callouts, and a clean nameplate area. The layout should feel like a collectible OC profile card / game character archive page. Use empty text boxes and placeholder label areas only; no readable text, no random letters.`;
  if(template === 'modelSheet') return `[LAYOUT TEMPLATE] Clean animation model sheet / production turnaround on a 16:9 wide horizontal canvas.

Show front view, side view, back view, and one small neutral expression head close-up. Use a plain light background, very clear silhouette, minimal decoration, clean spacing, consistent proportions, readable limbs, tail, ears, outfit, markings, and accessories. No information boxes, no complex background, no decorative clutter.`;
  return `[LAYOUT TEMPLATE] Standard full-body furry OC turnaround sheet on a 16:9 wide horizontal canvas.

Show front view, side view, and back view of the same character arranged left-to-right. Plain white background, clean colored character design sheet, high quality lineart, detailed but readable design, no complex background.`;
}

function bananaPrompt(c){
  return `${templatePrompt(c)}

${characterPromptCore(c)}

[CONSISTENCY REQUIREMENTS] Same character in every panel and view, consistent species design, consistent colors and markings, consistent eye color, consistent additional design notes, tail, body proportions, special features, accessories, world-setting motifs, and identical outfit wherever the same character appears.

[STYLE MANDATE] ${c.artStyle}, polished furry OC reference sheet, clean illustration, appealing character design, balanced details.`;
}

function positivePrompt(c){
  return bananaPrompt(c);
}

function negativePrompt(){
  return 'different characters in each view, inconsistent outfit, inconsistent fur pattern, inconsistent eye color, inconsistent accessory, missing tail, missing ears, missing markings, extra limbs, duplicated heads, wrong anatomy, cropped body, hidden feet, dynamic action pose, complex background, text, watermark, logo, blurry, low quality, messy design, inconsistent proportions, nudity, exposed lower body';
}

function renderResult(){
  document.getElementById('summary').textContent = zhSummary(character);
  const tagConfigs = [
    ['species', character.species],
    ['anthro', character.anthroLabel || character.anthro],
    ['bodyType', character.bodyType],
    ['temperament', character.temperament],
    ['artStyle', character.artStyle],
    ['world', enJoin(character.worlds || character.world)],
    ['color', character.color && character.color[0]],
    ['marking', character.marking],
    ['eyeColor', character.eyeColor],
    ['head', character.headFeature || `${character.muzzle}, ${character.ears}`],
    ['covering', character.covering],
    ['legStructure', character.legStructure],
    ['footType', character.footType],
    ['specialFeature', enJoin(character.specialFeatures || character.specialFeature)],
    ['accessory', enJoin(character.accessories || character.accessory)],
    ['outfit', character.outfit],
    ['outfitDetail', character.outfitDetail],
    ['tail', character.tail],
    ['detailLevel', character.detailLevel],
    ['promptTemplate', character.promptTemplateLabel || selectedPromptTemplate(character).cn]
  ];
  const tagBox = document.getElementById('tags');
  tagBox.innerHTML = '';
  tagConfigs.filter(([, value]) => value).forEach(([key, value]) => {
    const cfg = editableFieldConfigs[key];
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'tag' + (locked.has(key) ? ' locked' : '') + (selectedEditField === key ? ' selected' : '') + (cfg && cfg.risk ? ' risk' : '');
    el.dataset.editField = key;
    el.textContent = key === 'accessory' ? cnJoin(character.accessories || character.accessory) : key === 'specialFeature' ? cnJoin(character.specialFeatures || character.specialFeature) : key === 'world' ? cnJoin(character.worlds || character.world) : cn(value);
    el.title = cfg ? cfg.title : '点击编辑';
    el.onclick = () => selectEditField(key);
    tagBox.appendChild(el);
  });
  renderFieldEditor();
  const data = characterExportData();
  const output = document.getElementById('output');
  if(activeTab === 'description') output.value = zhDescription(character);
  if(activeTab === 'banana') output.value = bananaPrompt(character);
  if(activeTab === 'negative') output.value = negativePrompt();
  if(activeTab === 'json') output.value = JSON.stringify(data, null, 2);
}

function openBananaPasswordPanel(provider = 'banana'){
  if(!character){
    showResultPage();
    return;
  }
  currentImageProvider = imageProviderConfigs[provider] ? provider : 'banana';
  const providerLabel = imageProviderConfig(currentImageProvider).label;
  const box = document.getElementById('bananaBox');
  const panel = document.getElementById('bananaPasswordPanel');
  const input = document.getElementById('bananaPasswordInput');
  const status = document.getElementById('bananaStatus');
  const preview = document.getElementById('bananaPreview');
  const label = panel ? panel.querySelector('label') : null;
  if(label && label.firstChild) label.firstChild.textContent = providerLabel + ' 生图密码';
  box.hidden = false;
  if(panel) panel.hidden = false;
  if(preview) preview.innerHTML = '';
  if(status) status.textContent = '请输入密码后提交 ' + providerLabel + ' 生图任务。';
  if(input){
    input.value = '';
    setTimeout(() => input.focus(), 80);
  }
}

async function requestBananaImage(password){
  if(!character){
    showResultPage();
    return;
  }
  const cleanPassword = String(password || '').trim();
  const provider = imageProviderConfigs[currentImageProvider] ? currentImageProvider : 'banana';
  const providerInfo = imageProviderConfig(provider);
  const providerLabel = providerInfo.label;
  const btn = document.getElementById(providerInfo.buttonId);
  const otherBtns = Object.entries(imageProviderConfigs).filter(([key]) => key !== provider).map(([, info]) => document.getElementById(info.buttonId)).filter(Boolean);
  const submitBtn = document.getElementById('bananaPasswordSubmitBtn');
  const panel = document.getElementById('bananaPasswordPanel');
  const box = document.getElementById('bananaBox');
  const status = document.getElementById('bananaStatus');
  const preview = document.getElementById('bananaPreview');
  box.hidden = false;
  if(!cleanPassword){
    status.textContent = '请先输入 ' + providerLabel + ' 生图密码。';
    return;
  }
  preview.innerHTML = '';
  status.textContent = '正在提交 ' + providerLabel + ' 生图任务，请稍等……';
  if(btn) btn.disabled = true;
  otherBtns.forEach(otherBtn => otherBtn.disabled = true);
  if(submitBtn) submitBtn.disabled = true;
  try{
    const resp = await fetch(providerInfo.endpoint, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ password: cleanPassword, prompt: bananaPrompt(character), negativePrompt: negativePrompt(), character })
    });
    const data = await resp.json().catch(() => ({}));
    if(!resp.ok || !data.ok){
      throw new Error(data.error || '提交失败');
    }
    if(panel) panel.hidden = true;
    status.textContent = providerLabel + ' 生图成功！任务ID：' + (data.taskId || '未知') + '\n图片地址：' + data.imageUrl;
    preview.innerHTML = '<a href="' + data.imageUrl + '" target="_blank" rel="noopener">打开原图</a><img src="' + data.imageUrl + '" alt="' + providerLabel + ' 生成结果" />';
  }catch(err){
    status.textContent = '生图失败：' + (err.message || err);
  }finally{
    if(btn) btn.disabled = false;
    otherBtns.forEach(otherBtn => otherBtn.disabled = false);
    if(submitBtn) submitBtn.disabled = false;
  }
}

function generate(partial){ character = buildCharacter(partial); renderResult(); }

function bindStatic(){
  const startBtn = document.getElementById('startWizardBtn');
  if(startBtn) startBtn.onclick = () => startWizard();
  document.getElementById('generateBtn').onclick = () => showResultPage();
  document.getElementById('randomAllBtn').onclick = () => {
    state.randomnessLevel = state.randomnessLevel || 'moderate';
    state.speciesCategory=pick(['common','rare','fantasy','mechanical']);
    state.speciesChoice='random';
    state.speciesVariant='random';
    state.anthro='random';
    state.bodyTypeChoice='random';
    state.temperament='random';
    state.artStyle='random';
    state.furColor='random';
    state.markingChoice='random';
    state.eyeColor='random';
    state.featureDetail=['random'];
    state.accessory=['random'];
    state.outfitStyle='random';
    state.outfitDetail='random';
    state.world=['random'];
    state.detailLevel='random';
    state.promptTemplate=pick(['turnaround','designBoard','profileCard','modelSheet']);
    currentStep = 0;
    settleAllRandomChoices();
    generate({all:true});
    setViewMode('result');
    setHeroVisible(true);
    document.querySelector('.form-panel').style.display = 'none';
    document.querySelector('.result-panel').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  document.getElementById('resetBtn').onclick = () => { locked.clear(); character=null; init(); };
  document.querySelectorAll('.tab').forEach(btn => btn.onclick = () => { document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); activeTab = btn.dataset.tab; renderResult(); });
  document.querySelectorAll('[data-reroll]').forEach(btn => btn.onclick = () => generate({[btn.dataset.reroll]: true}));
  const editFieldInput = document.getElementById('editFieldInput');
  if(editFieldInput) editFieldInput.oninput = () => updateFieldEditorCount();
  const applyFieldEditBtn = document.getElementById('applyFieldEditBtn');
  if(applyFieldEditBtn) applyFieldEditBtn.onclick = () => applyFieldEdit();
  const rerollFieldBtn = document.getElementById('rerollFieldBtn');
  if(rerollFieldBtn) rerollFieldBtn.onclick = () => rerollSelectedField();
  const unlockFieldBtn = document.getElementById('unlockFieldBtn');
  if(unlockFieldBtn) unlockFieldBtn.onclick = () => unlockSelectedField();
  const cancelFieldEditBtn = document.getElementById('cancelFieldEditBtn');
  if(cancelFieldEditBtn) cancelFieldEditBtn.onclick = () => { selectedEditField = null; renderResult(); };
  document.getElementById('copyBtn').onclick = async () => { await navigator.clipboard.writeText(document.getElementById('output').value); document.getElementById('copyBtn').textContent='已复制'; setTimeout(()=>document.getElementById('copyBtn').textContent='复制当前内容',1200); };
  const copyPromptPairBtn = document.getElementById('copyPromptPairBtn');
  if(copyPromptPairBtn) copyPromptPairBtn.onclick = async () => { await navigator.clipboard.writeText(promptPairText()); copyPromptPairBtn.textContent='已复制正+负'; setTimeout(()=>copyPromptPairBtn.textContent='复制正+负提示词',1200); };  document.getElementById('bananaGenerateBtn').onclick = () => openBananaPasswordPanel('banana');
  const gptGenerateBtn = document.getElementById('gptGenerateBtn');
  if(gptGenerateBtn) gptGenerateBtn.onclick = () => openBananaPasswordPanel('gpt');
  const falGptGenerateBtn = document.getElementById('falGptGenerateBtn');
  if(falGptGenerateBtn) falGptGenerateBtn.onclick = () => openBananaPasswordPanel('falGpt');
  const bananaPasswordInput = document.getElementById('bananaPasswordInput');
  const bananaPasswordSubmitBtn = document.getElementById('bananaPasswordSubmitBtn');
  const bananaPasswordCancelBtn = document.getElementById('bananaPasswordCancelBtn');
  if(bananaPasswordSubmitBtn) bananaPasswordSubmitBtn.onclick = () => requestBananaImage(bananaPasswordInput ? bananaPasswordInput.value : '');
  if(bananaPasswordInput) bananaPasswordInput.onkeydown = e => { if(e.key === 'Enter') requestBananaImage(bananaPasswordInput.value); };
  if(bananaPasswordCancelBtn) bananaPasswordCancelBtn.onclick = () => { document.getElementById('bananaBox').hidden = true; if(bananaPasswordInput) bananaPasswordInput.value = ''; };
  document.getElementById('downloadBtn').onclick = () => {
    const data = JSON.stringify(characterExportData(), null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `furry-character-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const importJsonBtn = document.getElementById('importJsonBtn');
  const importJsonInput = document.getElementById('importJsonInput');
  if(importJsonBtn && importJsonInput){
    importJsonBtn.onclick = () => importJsonInput.click();
    importJsonInput.onchange = async () => {
      const file = importJsonInput.files && importJsonInput.files[0];
      if(!file) return;
      try{
        restoreFromImportedData(JSON.parse(await file.text()));
      }catch(err){
        alert('导入失败：' + (err.message || err));
      }finally{
        importJsonInput.value = '';
      }
    };
  }
  bindManualCharCounters();
}

init();

















