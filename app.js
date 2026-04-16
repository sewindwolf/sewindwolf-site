// ===== 涓婚鍒囨崲 =====
const themeKey = 'sw_theme';
function initTheme() {
  const saved = localStorage.getItem(themeKey);
  const theme = saved || 'dark';
  applyTheme(theme);
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.textContent = theme === 'light' ? '鈽€锔? : '馃寵';
  }
  localStorage.setItem(themeKey, theme);
}

function toggleTheme() {
  const current = localStorage.getItem(themeKey) || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

// 绔嬪嵆鍒濆鍖栦富棰橈紙闃叉闂儊锛?initTheme();

// ===== 鐘舵€佺鐞?=====
let allPosts = [];
let filteredPosts = [];
let currentWorldFilter = 'all';
let currentCharFilter = 'all';
let displayCount = 10;
const PAGE_SIZE = 10;

// 瑙掕壊鏁版嵁锛堣鑹插崱鍥剧墖绛夛級
let characterData = {};

// 鍙嶅簲鐘舵€侊紙瀛?localStorage锛?const reactionKey = 'sw_reactions';
let reactionState = JSON.parse(localStorage.getItem(reactionKey) || '{}');

// ===== 宸ュ叿鍑芥暟 =====
function getWorldClass(world) {
  if (world && world.includes('娼睈婀?)) return 'tide';
  if (world && world.includes('鐐夌伀闀?)) return 'fire';
  return 'tide';
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return '鍒氬垰';
  if (diff < 3600) return `${Math.floor(diff / 60)} 鍒嗛挓鍓峘;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 灏忔椂鍓峘;
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days} 澶╁墠`;
  return d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ===== 琛ㄦ儏鍥惧伐鍏峰嚱鏁?=====
function getStickerUrl(charName, mood) {
  const charInfo = characterData[charName];
  if (!charInfo || !charInfo.stickers) return null;
  // Prefer thumb (small webp), fallback to original png
  if (charInfo.stickers_thumb) {
    return charInfo.stickers_thumb[mood] || charInfo.stickers_thumb['calm'] || charInfo.stickers[mood] || charInfo.stickers['calm'] || null;
  }
  return charInfo.stickers[mood] || charInfo.stickers['calm'] || null;
}

function getInlineStickerUrl(charName, mood) {
  const charInfo = characterData[charName];
  if (!charInfo) return null;
  // Prefer inline (medium webp), fallback to original png
  if (charInfo.stickers_inline) {
    return charInfo.stickers_inline[mood] || charInfo.stickers_inline['calm'] || null;
  }
  if (charInfo.stickers) {
    return charInfo.stickers[mood] || charInfo.stickers['calm'] || null;
  }
  return null;
}

const moodLabels = {
  happy: '寮€蹇?, calm: '骞抽潤', sad: '闅捐繃', angry: '鐢熸皵',
  shy: '瀹崇緸', surprised: '鎯婅', thinking: '娌夋€?, sleepy: '鍥板€?
};

function renderContentWithStickers(text) {
  let html = escapeHtml(text);
  html = html.replace(/:([^:_]+)_([a-z]+):/g, (match, charRef, mood) => {
    let charName = charRef;
    if (!characterData[charName]) {
      for (const [cn, info] of Object.entries(characterData)) {
        if (info.character_en && info.character_en.toLowerCase().replace(/\s/g,'') === charRef.toLowerCase().replace(/\s/g,'')) {
          charName = cn;
          break;
        }
      }
    }
    const url = getInlineStickerUrl(charName, mood);
    if (url) {
      const label = moodLabels[mood] || mood;
      return `<img class="inline-sticker" src="${url}" alt="${charName}${label}" title="${charName} 路 ${label}" />`;
    }
    return match;
  });
  return html;
}

// ===== 娓叉煋瑙掕壊绛涢€夋寜閽?=====
function buildCharFilter(posts) {
  const chars = {};
  posts.forEach(p => {
    if (!chars[p.character]) {
      chars[p.character] = { symbol: p.avatar_symbol, color: p.avatar_color };
    }
  });

  const container = document.getElementById('characterFilter');
  // 淇濈暀"鍏ㄩ儴"鎸夐挳
  const allBtn = container.querySelector('[data-char="all"]');
  container.innerHTML = '';
  container.appendChild(allBtn);


  // 给'全部'按钮绑定点击事件
  allBtn.addEventListener('click', () => filterByChar('all', allBtn));
  Object.entries(chars).forEach(([name, info]) => {
    const btn = document.createElement('button');
    btn.className = 'char-btn';
    btn.dataset.char = name;
    const charInfo = characterData[name];
    const miniAvatarUrl = charInfo && charInfo.avatar ? charInfo.avatar : null;
    const miniAvatarHtml = miniAvatarUrl
      ? `<img class="char-filter-avatar" src="${miniAvatarUrl}" alt="${escapeHtml(name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><span class="char-avatar-mini" style="display:none;background:${info.color}22;color:${info.color}">${info.symbol}</span>`
      : `<span class="char-avatar-mini" style="background:${info.color}22;color:${info.color}">${info.symbol}</span>`;
    btn.innerHTML = `${miniAvatarHtml} ${escapeHtml(name)}`;
    btn.addEventListener('click', () => filterByChar(name, btn));
    container.appendChild(btn);
  });
}

// ===== 娓叉煋鍗曞紶鍗＄墖 =====
function renderCard(post) {
  const worldClass = getWorldClass(post.world);
  const timeStr = formatTime(post.timestamp);
  const reactions = post.reactions || { heart: 0, paw: 0, star: 0 };
  const userReacted = reactionState[post.id] || {};

  // 澶勭悊鍥剧墖
  const hasImage = post.image_url && post.image_url.trim() !== '';
  const imageHtml = hasImage ? `
    <div class="card-image-wrap" onclick="openLightbox('${escapeHtml(post.image_url)}')">
      <img src="${escapeHtml(post.image_url)}" alt="${escapeHtml(post.character)} 路 ${escapeHtml(post.location || '')}" loading="lazy" onerror="this.parentElement.style.display='none'" />
    </div>` : '';

  // 澶勭悊鏍囩
  const tagsHtml = (post.tags && post.tags.length > 0)
    ? `<div class="card-tags">${post.tags.map(t => `<span class="tag"># ${escapeHtml(t)}</span>`).join('')}</div>`
    : '';

  // 鍒ゆ柇鏄惁鏈夎鑹插崱鍥剧墖
  const charInfo = characterData[post.character];
  const hasCard = charInfo && charInfo.card_image;
  const clickableClass = hasCard ? 'clickable' : '';
  const onClickAvatar = hasCard ? `onclick="openCharCard('${escapeHtml(post.character)}')"` : '';

  // 浣跨敤鍥哄畾瑙掕壊澶村儚鍥?  const avatarUrl = charInfo && charInfo.avatar ? charInfo.avatar : null;
  const avatarInnerHtml = avatarUrl
    ? `<img class="avatar-sticker" src="${avatarUrl}" alt="${escapeHtml(post.character)}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" /><span class="avatar-emoji-fallback" style="display:none">${post.avatar_symbol || '?'}</span>`
    : (post.avatar_symbol || '?');

  const card = document.createElement('article');
  card.className = 'post-card';
  card.dataset.id = post.id;
  card.dataset.world = post.world;
  card.dataset.char = post.character;

  card.innerHTML = `
    <div class="card-header">
      <div class="char-avatar ${clickableClass}" style="background:${post.avatar_color}22;color:${post.avatar_color}" ${onClickAvatar}>
        ${avatarInnerHtml}
        ${hasCard ? '<span class="char-avatar-tip">鏌ョ湅瑙掕壊鍗?/span>' : ''}
      </div>
      <div class="card-meta">
        <div class="card-meta-top">
          <span class="char-name">${escapeHtml(post.character)}</span>
          <span class="world-tag ${worldClass}">${escapeHtml(post.world)}</span>
        </div>
        <div class="card-location">
          <span class="card-location-icon">馃搷</span>
          <span>${escapeHtml(post.location || '')}${post.game_time ? ' 路 ' + escapeHtml(post.game_time) : ''}</span>
        </div>
      </div>
    </div>
    <div class="card-body">
      <p class="card-content">${renderContentWithStickers(post.content)}</p>
      ${imageHtml}
      ${tagsHtml}
    </div>
    <div class="card-footer">
      <span class="card-time">${timeStr}</span>
      <div class="card-reactions">
        <button class="reaction-btn${userReacted.heart ? ' reacted' : ''}" onclick="toggleReaction('${post.id}','heart',this)" title="蹇冨姩">
          <span class="reaction-icon">${userReacted.heart ? '鉂わ笍' : '馃'}</span>
          <span class="reaction-count" id="react_heart_${post.id}">${(reactions.heart || 0) + (userReacted.heart ? 1 : 0)}</span>
        </button>
        <button class="reaction-btn${userReacted.paw ? ' reacted' : ''}" onclick="toggleReaction('${post.id}','paw',this)" title="鐖嵃">
          <span class="reaction-icon">${userReacted.paw ? '馃惥' : '馃惥'}</span>
          <span class="reaction-count" id="react_paw_${post.id}">${(reactions.paw || 0) + (userReacted.paw ? 1 : 0)}</span>
        </button>
        <button class="reaction-btn${userReacted.star ? ' reacted' : ''}" onclick="toggleReaction('${post.id}','star',this)" title="鏀惰棌">
          <span class="reaction-icon">${userReacted.star ? '猸? : '鈽?}</span>
          <span class="reaction-count" id="react_star_${post.id}">${(reactions.star || 0) + (userReacted.star ? 1 : 0)}</span>
        </button>
      </div>
    </div>
  `;

  return card;
}

// ===== 娓叉煋鍔ㄦ€佸垪琛?=====
function renderFeed(reset = false) {
  const container = document.getElementById('feedContainer');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const emptyState = document.getElementById('emptyState');

  if (reset) {
    container.innerHTML = '';
    displayCount = PAGE_SIZE;
  }

  const slice = filteredPosts.slice(0, displayCount);

  if (slice.length === 0) {
    emptyState.style.display = 'block';
    loadMoreWrap.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';

  // 鍙拷鍔犳柊澧炵殑閮ㄥ垎
  const existingCount = container.children.length;
  const toRender = slice.slice(existingCount);
  toRender.forEach((post, i) => {
    const card = renderCard(post);
    card.style.animationDelay = `${i * 60}ms`;
    container.appendChild(card);
  });

  // 鎺у埗鍔犺浇鏇村鎸夐挳
  if (displayCount >= filteredPosts.length) {
    loadMoreWrap.style.display = filteredPosts.length > 0 ? 'block' : 'none';
    const btn = document.getElementById('loadMoreBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '宸叉樉绀哄叏閮ㄥ姩鎬?;
    }
  } else {
    loadMoreWrap.style.display = 'block';
    const btn = document.getElementById('loadMoreBtn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = `鍔犺浇鏇村 鈫擄紙杩樻湁 ${filteredPosts.length - displayCount} 鏉★級`;
    }
  }
}

// ===== 杩囨护閫昏緫 =====
function applyFilters() {
  filteredPosts = allPosts.filter(p => {
    const worldOk = currentWorldFilter === 'all' || p.world === currentWorldFilter;
    const charOk = currentCharFilter === 'all' || p.character === currentCharFilter;
    return worldOk && charOk;
  });
  // 鎸夋椂闂存帓搴忥紙鏈€鏂板湪鍓嶏級
  filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  renderFeed(true);
}

function filterByWorld(world, btn) {
  currentWorldFilter = world;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // 鍚屾涓栫晫鍗＄偣鍑绘€?  document.querySelectorAll('.world-card').forEach(c => c.classList.remove('active'));
  applyFilters();
}

function filterByChar(char, btn) {
  currentCharFilter = char;
  document.querySelectorAll('.char-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

// ===== 鍙嶅簲鍔熻兘 =====
function toggleReaction(postId, type, btn) {
  if (!reactionState[postId]) reactionState[postId] = {};
  const wasReacted = !!reactionState[postId][type];
  reactionState[postId][type] = !wasReacted;
  localStorage.setItem(reactionKey, JSON.stringify(reactionState));

  // 鏇存柊鎸夐挳鐘舵€?  const countEl = document.getElementById(`react_${type}_${postId}`);
  const post = allPosts.find(p => p.id === postId);
  if (!post) return;
  const base = (post.reactions && post.reactions[type]) || 0;
  const newCount = base + (reactionState[postId][type] ? 1 : 0);
  if (countEl) countEl.textContent = newCount;

  btn.classList.toggle('reacted', reactionState[postId][type]);

  // 鏇存柊 emoji
  const icons = { heart: ['馃', '鉂わ笍'], paw: ['馃惥', '馃惥'], star: ['鈽?, '猸?] };
  const iconEl = btn.querySelector('.reaction-icon');
  if (iconEl && icons[type]) {
    iconEl.textContent = reactionState[postId][type] ? icons[type][1] : icons[type][0];
  }
}

// ===== 瑙掕壊鍗″脊绐?=====
function openCharCard(charName) {
  const charInfo = characterData[charName];
  if (!charInfo || !charInfo.card_image) return;
  const modal = document.getElementById('charCardModal');
  const img = document.getElementById('charCardImg');
  img.src = charInfo.card_image;
  img.alt = charName + ' 瑙掕壊鍗?;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCharCard() {
  const modal = document.getElementById('charCardModal');
  modal.classList.remove('open');
  if (!document.getElementById('lightbox').classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

// ===== 鐏 =====
function openLightbox(url) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = url;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCharCard();
    closeLightbox();
  }
});

// ===== 鍒濆鍖?=====
async function init() {
  // 鏄剧ず楠ㄦ灦灞?  const container = document.getElementById('feedContainer');
  for (let i = 0; i < 3; i++) {
    const sk = document.createElement('div');
    sk.className = 'skeleton';
    container.appendChild(sk);
  }

  try {
    // 骞惰鍔犺浇鏁版嵁
    const [postsRes, charsRes] = await Promise.all([
      fetch(`data/posts.json?t=${Date.now()}`),
      fetch(`data/characters.json?t=${Date.now()}`)
    ]);
    if (postsRes.ok) allPosts = await postsRes.json();
    if (charsRes.ok) characterData = await charsRes.json();
  } catch (e) {
    console.warn('鍔犺浇鏁版嵁澶辫触:', e);
    allPosts = [];
  }

  // 娓呴櫎楠ㄦ灦灞?  container.innerHTML = '';

  // 鏋勫缓瑙掕壊绛涢€?  buildCharFilter(allPosts);

  // 涓栫晫鍗＄偣鍑?  document.querySelectorAll('.world-card').forEach(card => {
    card.addEventListener('click', () => {
      const w = card.dataset.world;
      currentWorldFilter = currentWorldFilter === w ? 'all' : w;
      // 鍚屾椤堕儴瀵艰埅鎸夐挳
      document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === currentWorldFilter);
      });
      applyFilters();
    });
  });

  // 椤堕儴瀵艰埅绛涢€?  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => filterByWorld(btn.dataset.filter, btn));
  });

  // 鍔犺浇鏇村
  document.getElementById('loadMoreBtn').addEventListener('click', () => {
    displayCount += PAGE_SIZE;
    renderFeed(false);
  });

  // 涓婚鍒囨崲鎸夐挳
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // 鍒濆娓叉煋
  applyFilters();
}

// 鍚姩
document.addEventListener('DOMContentLoaded', init);
