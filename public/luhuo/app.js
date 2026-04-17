// ===== 主题切换 =====
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
    icon.textContent = theme === 'light' ? '☀️' : '🌙';
  }
  localStorage.setItem(themeKey, theme);
}

function toggleTheme() {
  const current = localStorage.getItem(themeKey) || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

// 立即初始化主题（防止闪烁）
initTheme();

// ===== 状态管理 =====
let allPosts = [];
let filteredPosts = [];
let currentWorldFilter = 'all';
let currentCharFilter = 'all';
let displayCount = 10;
const PAGE_SIZE = 10;

// 角色数据（角色卡图片等）
let characterData = {};

// 反应状态（存 localStorage）
const reactionKey = 'sw_reactions';
let reactionState = JSON.parse(localStorage.getItem(reactionKey) || '{}');

// ===== 概况面板 =====
let locationData = {};
let currentOverviewTab = 'locations';

function openOverview() {
  const modal = document.getElementById('overviewModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderOverviewTab(currentOverviewTab);
}

function closeOverview() {
  const modal = document.getElementById('overviewModal');
  modal.classList.remove('open');
  if (!document.getElementById('lightbox').classList.contains('open') &&
      !document.getElementById('charCardModal').classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

function switchOverviewTab(tab, btn) {
  currentOverviewTab = tab;
  document.querySelectorAll('.overview-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderOverviewTab(tab);
}

function renderOverviewTab(tab) {
  const body = document.getElementById('overviewBody');
  if (tab === 'locations') {
    renderLocationsList(body);
  } else {
    renderCharactersList(body);
  }
}

function getCharactersAtLocation(locName) {
  // 从最新动态中找出在该地点的角色
  const charMap = {};
  allPosts.forEach(p => {
    if (!p.location) return;
    // 匹配地点名（location可能包含"炉火镇 · 广场"格式，取最后部分）
    const loc = p.location.replace(/^.*[·]\s*/, '').trim();
    const fullLoc = p.location.trim();
    if (loc === locName || fullLoc === locName || p.location.includes(locName)) {
      if (!charMap[p.character]) {
        charMap[p.character] = { timestamp: p.timestamp, location: p.location };
      } else if (new Date(p.timestamp) > new Date(charMap[p.character].timestamp)) {
        charMap[p.character] = { timestamp: p.timestamp, location: p.location };
      }
    }
  });
  return charMap;
}

function getCharacterCurrentLocation(charName) {
  // 找到该角色最近一条动态的地点
  const charPosts = allPosts
    .filter(p => p.character === charName && p.location)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  if (charPosts.length > 0) {
    return { location: charPosts[0].location, timestamp: charPosts[0].timestamp };
  }
  return null;
}

function renderLocationsList(container) {
  // 当前页面是炉火镇，取炉火镇的地点
  const worldKey = '炉火镇';
  const worldData = locationData[worldKey];
  if (!worldData || !worldData.locations) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">📍</span><p>暂无地点数据</p></div>';
    return;
  }

  const locs = worldData.locations;
  let html = '<div class="overview-list">';
  for (const [name, info] of Object.entries(locs)) {
    const charsHere = getCharactersAtLocation(name);
    const charCount = Object.keys(charsHere).length;
    const subText = charCount > 0 ? `${charCount} 位角色近期到访` : '暂无角色到访记录';
    html += `
      <div class="overview-item" onclick="showLocationDetail('${escapeHtml(name)}')">
        <div class="overview-item-icon">${info.icon}</div>
        <div class="overview-item-info">
          <div class="overview-item-name">${escapeHtml(name)}</div>
          <div class="overview-item-sub">${subText}</div>
        </div>
        <span class="overview-item-arrow">→</span>
      </div>`;
  }
  html += '</div>';
  container.innerHTML = html;
}

function renderCharactersList(container) {
  // 获取炉火镇的角色
  const chars = Object.entries(characterData).filter(([name, info]) => info.world === '炉火镇');
  if (chars.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">👥</span><p>暂无角色数据</p></div>';
    return;
  }

  let html = '<div class="overview-list">';
  for (const [name, info] of chars) {
    const avatarUrl = info.avatar ? info.avatar : null;
    const locInfo = getCharacterCurrentLocation(name);
    const subText = locInfo ? `📍 ${locInfo.location}` : '位置未知';
    const avatarHtml = avatarUrl
      ? `<img class="overview-item-avatar" src="${avatarUrl}" alt="${escapeHtml(name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="overview-item-icon" style="display:none">${info.avatar_symbol}</div>`
      : `<div class="overview-item-icon">${info.avatar_symbol}</div>`;
    html += `
      <div class="overview-item" onclick="showCharacterDetail('${escapeHtml(name)}')">
        ${avatarHtml}
        <div class="overview-item-info">
          <div class="overview-item-name">${escapeHtml(name)}</div>
          <div class="overview-item-sub">${subText}</div>
        </div>
        <span class="overview-item-arrow">→</span>
      </div>`;
  }
  html += '</div>';
  container.innerHTML = html;
}

function showLocationDetail(locName) {
  const worldKey = '炉火镇';
  const worldData = locationData[worldKey];
  if (!worldData || !worldData.locations || !worldData.locations[locName]) return;

  const loc = worldData.locations[locName];
  const charsHere = getCharactersAtLocation(locName);
  const body = document.getElementById('overviewBody');

  let tagsHtml = '';
  if (loc.tags && loc.tags.length > 0) {
    tagsHtml = '<div class="overview-detail-tags">' +
      loc.tags.map(t => `<span class="tag"># ${escapeHtml(t)}</span>`).join('') +
      '</div>';
  }

  let charsHtml = '';
  const charEntries = Object.entries(charsHere);
  if (charEntries.length > 0) {
    charsHtml = `<div class="overview-section-title">👥 近期到访的角色</div><div class="overview-char-list">`;
    for (const [charName, info] of charEntries) {
      const ci = characterData[charName];
      const avatarUrl = ci && ci.avatar ? ci.avatar : null;
      const avatarHtml = avatarUrl
        ? `<img class="char-mini-avatar" src="${avatarUrl}" alt="${escapeHtml(charName)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><span class="char-mini-emoji" style="display:none;background:${ci.avatar_color}22;color:${ci.avatar_color}">${ci.avatar_symbol}</span>`
        : `<span class="char-mini-emoji" style="background:${ci ? ci.avatar_color : '#666'}22;color:${ci ? ci.avatar_color : '#666'}">${ci ? ci.avatar_symbol : '?'}</span>`;
      charsHtml += `
        <div class="overview-char-item" onclick="showCharacterDetail('${escapeHtml(charName)}')">
          ${avatarHtml}
          <span class="overview-char-item-name">${escapeHtml(charName)}</span>
          <span class="overview-char-item-arrow">→</span>
        </div>`;
    }
    charsHtml += '</div>';
  } else {
    charsHtml = '<div class="overview-section-title">👥 近期到访的角色</div><div style="font-size:13px;color:var(--text-muted);padding:8px 0">暂无角色到访记录</div>';
  }

  body.innerHTML = `
    <div class="overview-detail">
      <button class="overview-back" onclick="renderOverviewTab('locations')">← 返回地点列表</button>
      <div class="overview-detail-header">
        <div class="overview-detail-icon">${loc.icon}</div>
        <div>
          <div class="overview-detail-title">${escapeHtml(locName)}</div>
          <div class="overview-detail-subtitle">炉火镇</div>
        </div>
      </div>
      <div class="overview-detail-desc">${escapeHtml(loc.description)}</div>
      ${tagsHtml}
      ${charsHtml}
    </div>`;
}

function showCharacterDetail(charName) {
  const ci = characterData[charName];
  if (!ci) return;

  const body = document.getElementById('overviewBody');
  const locInfo = getCharacterCurrentLocation(charName);
  const avatarUrl = ci.avatar ? ci.avatar : null;

  const avatarHtml = avatarUrl
    ? `<img class="overview-detail-avatar" src="${avatarUrl}" alt="${escapeHtml(charName)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="overview-detail-icon" style="display:none">${ci.avatar_symbol}</div>`
    : `<div class="overview-detail-icon">${ci.avatar_symbol}</div>`;

  // 角色简介：根据 characterData 信息组装
  const worldText = ci.world || '未知';
  const friendsText = ci.friends && ci.friends.length > 0 ? ci.friends.join('、') : '暂无';
  const locText = locInfo ? locInfo.location : '位置未知';

  // 查找该角色去过的所有地点
  const visitedLocs = {};
  allPosts.forEach(p => {
    if (p.character === charName && p.location) {
      const loc = p.location.trim();
      if (!visitedLocs[loc]) {
        visitedLocs[loc] = { count: 1, latest: p.timestamp };
      } else {
        visitedLocs[loc].count++;
        if (new Date(p.timestamp) > new Date(visitedLocs[loc].latest)) {
          visitedLocs[loc].latest = p.timestamp;
        }
      }
    }
  });

  // 按最近时间排序
  const sortedLocs = Object.entries(visitedLocs).sort((a, b) => new Date(b[1].latest) - new Date(a[1].latest));

  let locsHtml = '';
  if (sortedLocs.length > 0) {
    locsHtml = `<div class="overview-section-title" style="margin-top:20px">📍 活动地点</div><div class="overview-loc-list">`;
    for (const [loc, info] of sortedLocs) {
      // 尝试匹配 locationData 中的地点
      const locKey = loc.replace(/^.*[·]\s*/, '').trim();
      const worldData = locationData['炉火镇'];
      const locData = worldData && worldData.locations ? worldData.locations[locKey] : null;
      const icon = locData ? locData.icon : '📍';
      const isCurrentLoc = locInfo && locInfo.location === loc;
      locsHtml += `
        <div class="overview-loc-item" ${locData ? `onclick="showLocationDetail('${escapeHtml(locKey)}')"` : ''}>
          <span style="font-size:20px">${icon}</span>
          <span class="overview-loc-item-name">${escapeHtml(loc)}${isCurrentLoc ? ' <span style="color:var(--accent);font-size:11px">（当前）</span>' : ''}</span>
          <span class="overview-loc-item-arrow" style="font-size:11px;color:var(--text-muted)">${info.count}条动态</span>
        </div>`;
    }
    locsHtml += '</div>';
  }

  // 好友列表
  let friendsHtml = '';
  if (ci.friends && ci.friends.length > 0) {
    friendsHtml = `<div class="overview-section-title" style="margin-top:20px">💛 好友</div><div class="overview-char-list">`;
    for (const friendName of ci.friends) {
      const fi = characterData[friendName];
      if (!fi) continue;
      const fAvatarUrl = fi.avatar ? fi.avatar : null;
      const fAvatarHtml = fAvatarUrl
        ? `<img class="char-mini-avatar" src="${fAvatarUrl}" alt="${escapeHtml(friendName)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><span class="char-mini-emoji" style="display:none;background:${fi.avatar_color}22;color:${fi.avatar_color}">${fi.avatar_symbol}</span>`
        : `<span class="char-mini-emoji" style="background:${fi.avatar_color}22;color:${fi.avatar_color}">${fi.avatar_symbol}</span>`;
      friendsHtml += `
        <div class="overview-char-item" onclick="showCharacterDetail('${escapeHtml(friendName)}')">
          ${fAvatarHtml}
          <span class="overview-char-item-name">${escapeHtml(friendName)}</span>
          <span class="overview-char-item-arrow">→</span>
        </div>`;
    }
    friendsHtml += '</div>';
  }

  // 角色卡按钮
  const cardBtnHtml = ci.card_image
    ? `<div style="margin-top:16px"><button class="load-more-btn" onclick="closeOverview();setTimeout(()=>openCharCard('${escapeHtml(charName)}'),300)" style="font-size:12px;padding:8px 20px">🎴 查看角色卡</button></div>`
    : '';

  body.innerHTML = `
    <div class="overview-detail">
      <button class="overview-back" onclick="renderOverviewTab('characters')">← 返回角色列表</button>
      <div class="overview-detail-header">
        ${avatarHtml}
        <div>
          <div class="overview-detail-title">${escapeHtml(charName)}</div>
          <div class="overview-detail-subtitle">${ci.character_en || ''} · ${worldText}</div>
        </div>
      </div>
      <div class="overview-detail-desc">
        <strong>当前位置：</strong>${escapeHtml(locText)}<br/>
        <strong>所属世界：</strong>${escapeHtml(worldText)}<br/>
        <strong>好友：</strong>${escapeHtml(friendsText)}
      </div>
      ${cardBtnHtml}
      ${locsHtml}
      ${friendsHtml}
    </div>`;
}

// ===== 工具函数 =====
function getWorldClass(world) {
  if (world && world.includes('潮汐湾')) return 'tide';
  if (world && world.includes('炉火镇')) return 'fire';
  return 'tide';
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days} 天前`;
  return d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ===== 表情图工具函数 =====
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
  happy: '开心', calm: '平静', sad: '难过', angry: '生气',
  shy: '害羞', surprised: '惊讶', thinking: '沉思', sleepy: '困倦'
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
      return `<img class="inline-sticker" src="${url}" alt="${charName}${label}" title="${charName} · ${label}" />`;
    }
    return match;
  });
  return html;
}

// ===== 渲染角色筛选按钮 =====
function buildCharFilter(posts) {
  const chars = {};
  posts.forEach(p => {
    if (!chars[p.character]) {
      chars[p.character] = { symbol: p.avatar_symbol, color: p.avatar_color };
    }
  });

  const container = document.getElementById('characterFilter');
  // 保留"全部"按钮
  const allBtn = container.querySelector('[data-char="all"]');
  container.innerHTML = '';
  container.appendChild(allBtn);

  // Bind click event to All button
  allBtn.addEventListener("click", () => filterByChar("all", allBtn));

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


// ===== 评论区 & 回复栏 =====
function renderComments(post) {
  const comments = post.comments || [];
  let commentsListHtml = "";
  comments.forEach(c => {
    const ci = characterData[c.from];
    const avUrl = ci && ci.avatar ? ci.avatar : null;
    const sym = ci ? ci.avatar_symbol : "?";
    let avHtml;
    if (avUrl) {
      avHtml = '<img class="comment-avatar-img" src="' + avUrl + '" alt="' + escapeHtml(c.from) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'" />' + '<span class="comment-avatar-emoji" style="display:none">' + sym + '</span>';
    } else {
      avHtml = '<span class="comment-avatar-emoji">' + sym + '</span>';
    }
    commentsListHtml += '<div class="comment-item">' + '<div class="comment-avatar">' + avHtml + '</div>' + '<div class="comment-body">' + '<span class="comment-name">' + escapeHtml(c.from) + '</span>' + '<span class="comment-text">' + renderContentWithStickers(c.text) + '</span>' + '</div>' + '</div>';
  });

  return '<div class="card-comments">' + (commentsListHtml ? '<div class="comments-list">' + commentsListHtml + '</div>' : "") + '<div class="reply-bar"><div class="reply-input-fake"><span class="reply-lock-icon">🔒</span><span class="reply-placeholder">你不是该用户的好友，无法发言</span></div></div></div>';
}

// ===== 渲染单张卡片 =====
function renderCard(post) {
  const worldClass = getWorldClass(post.world);
  const timeStr = formatTime(post.timestamp);
  const reactions = post.reactions || { heart: 0, paw: 0, star: 0 };
  const userReacted = reactionState[post.id] || {};

  // 处理图片
  const hasImage = post.image_url && post.image_url.trim() !== '';
  const imageHtml = hasImage ? `
    <div class="card-image-wrap" onclick="openLightbox('${escapeHtml(post.image_url)}')">
      <img src="${escapeHtml(post.image_url)}" alt="${escapeHtml(post.character)} · ${escapeHtml(post.location || '')}" loading="lazy" onerror="this.parentElement.style.display='none'" />
    </div>` : '';

  // 处理标签
  const tagsHtml = (post.tags && post.tags.length > 0)
    ? `<div class="card-tags">${post.tags.map(t => `<span class="tag"># ${escapeHtml(t)}</span>`).join('')}</div>`
    : '';

  // 判断是否有角色卡图片
  const charInfo = characterData[post.character];
  const hasCard = charInfo && charInfo.card_image;
  const clickableClass = hasCard ? 'clickable' : '';
  const onClickAvatar = hasCard ? `onclick="openCharCard('${escapeHtml(post.character)}')"` : '';

  // 使用固定角色头像图
  const avatarUrl = charInfo && charInfo.avatar ? charInfo.avatar : null;
  const avatarInnerHtml = avatarUrl
    ? `<img class="avatar-sticker" src="${avatarUrl}" alt="${escapeHtml(post.character)}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" /><span class="avatar-emoji-fallback" style="display:none">${post.avatar_symbol || '?'}</span>`
    : (post.avatar_symbol || '?');

  const card = document.createElement('article');
  card.className = 'post-card';
  card.dataset.id = post.id;
  card.dataset.world = post.world;
  card.dataset.char = post.character;

  const commentsHtml = renderComments(post);

  card.innerHTML = `
    <div class="card-header">
      <div class="char-avatar ${clickableClass}" style="background:${post.avatar_color}22;color:${post.avatar_color}" ${onClickAvatar}>
        ${avatarInnerHtml}
        ${hasCard ? '<span class="char-avatar-tip">查看角色卡</span>' : ''}
      </div>
      <div class="card-meta">
        <div class="card-meta-top">
          <span class="char-name">${escapeHtml(post.character)}</span>
          <span class="world-tag ${worldClass}">${escapeHtml(post.world)}</span>
        </div>
        <div class="card-location">
          <span class="card-location-icon">📍</span>
          <span>${escapeHtml(post.location || '')}${post.game_time ? ' · ' + escapeHtml(post.game_time) : ''}</span>
        </div>
      </div>
    </div>
    <div class="card-body">
      <p class="card-content">${renderContentWithStickers(post.content)}</p>
      ${imageHtml}
      ${tagsHtml}
    </div>
    ${commentsHtml}
    <div class="card-footer">
      <span class="card-time">${timeStr}</span>
      <div class="card-reactions">
        <button class="reaction-btn${userReacted.heart ? ' reacted' : ''}" onclick="toggleReaction('${post.id}','heart',this)" title="心动">
          <span class="reaction-icon">${userReacted.heart ? '❤️' : '🤍'}</span>
          <span class="reaction-count" id="react_heart_${post.id}">${(reactions.heart || 0) + (userReacted.heart ? 1 : 0)}</span>
        </button>
        <button class="reaction-btn${userReacted.paw ? ' reacted' : ''}" onclick="toggleReaction('${post.id}','paw',this)" title="爪印">
          <span class="reaction-icon">${userReacted.paw ? '🐾' : '🐾'}</span>
          <span class="reaction-count" id="react_paw_${post.id}">${(reactions.paw || 0) + (userReacted.paw ? 1 : 0)}</span>
        </button>
        <button class="reaction-btn${userReacted.star ? ' reacted' : ''}" onclick="toggleReaction('${post.id}','star',this)" title="收藏">
          <span class="reaction-icon">${userReacted.star ? '⭐' : '☆'}</span>
          <span class="reaction-count" id="react_star_${post.id}">${(reactions.star || 0) + (userReacted.star ? 1 : 0)}</span>
        </button>
      </div>
    </div>
  `;

  return card;
}

// ===== 渲染动态列表 =====
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

  // 只追加新增的部分
  const existingCount = container.children.length;
  const toRender = slice.slice(existingCount);
  toRender.forEach((post, i) => {
    const card = renderCard(post);
    card.style.animationDelay = `${i * 60}ms`;
    container.appendChild(card);
  });

  // 控制加载更多按钮
  if (displayCount >= filteredPosts.length) {
    loadMoreWrap.style.display = filteredPosts.length > 0 ? 'block' : 'none';
    const btn = document.getElementById('loadMoreBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '已显示全部动态';
    }
  } else {
    loadMoreWrap.style.display = 'block';
    const btn = document.getElementById('loadMoreBtn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = `加载更多 ↓（还有 ${filteredPosts.length - displayCount} 条）`;
    }
  }
}

// ===== 过滤逻辑 =====
function applyFilters() {
  filteredPosts = allPosts.filter(p => {
    const worldOk = currentWorldFilter === 'all' || p.world === currentWorldFilter;
    const charOk = currentCharFilter === 'all' || p.character === currentCharFilter;
    return worldOk && charOk;
  });
  // 按时间排序（最新在前）
  filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  renderFeed(true);
}

function filterByWorld(world, btn) {
  currentWorldFilter = world;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // 同步世界卡点击态
  document.querySelectorAll('.world-card').forEach(c => c.classList.remove('active'));
  applyFilters();
}

function filterByChar(char, btn) {
  currentCharFilter = char;
  document.querySelectorAll('.char-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

// ===== 反应功能 =====
function toggleReaction(postId, type, btn) {
  if (!reactionState[postId]) reactionState[postId] = {};
  const wasReacted = !!reactionState[postId][type];
  reactionState[postId][type] = !wasReacted;
  localStorage.setItem(reactionKey, JSON.stringify(reactionState));

  // 更新按钮状态
  const countEl = document.getElementById(`react_${type}_${postId}`);
  const post = allPosts.find(p => p.id === postId);
  if (!post) return;
  const base = (post.reactions && post.reactions[type]) || 0;
  const newCount = base + (reactionState[postId][type] ? 1 : 0);
  if (countEl) countEl.textContent = newCount;

  btn.classList.toggle('reacted', reactionState[postId][type]);

  // 更新 emoji
  const icons = { heart: ['🤍', '❤️'], paw: ['🐾', '🐾'], star: ['☆', '⭐'] };
  const iconEl = btn.querySelector('.reaction-icon');
  if (iconEl && icons[type]) {
    iconEl.textContent = reactionState[postId][type] ? icons[type][1] : icons[type][0];
  }
}

// ===== 角色卡弹窗 =====
function openCharCard(charName) {
  const charInfo = characterData[charName];
  if (!charInfo || !charInfo.card_image) return;
  const modal = document.getElementById('charCardModal');
  const img = document.getElementById('charCardImg');
  img.src = charInfo.card_image;
  img.alt = charName + ' 角色卡';
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

// ===== 灯箱 =====
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

// ===== 初始化 =====
async function init() {
  // 显示骨架屏
  const container = document.getElementById('feedContainer');
  for (let i = 0; i < 3; i++) {
    const sk = document.createElement('div');
    sk.className = 'skeleton';
    container.appendChild(sk);
  }

  try {
    // 并行加载数据
    const [postsRes, charsRes, locsRes] = await Promise.all([
      fetch(`../../data/posts.json?t=${Date.now()}`),
      fetch(`../../data/characters.json?t=${Date.now()}`),
      fetch(`../../data/locations.json?t=${Date.now()}`)
    ]);
    if (postsRes.ok) allPosts = await postsRes.json();
    if (charsRes.ok) {
      characterData = await charsRes.json();
      // Fix relative image paths for sub-directory
      for (const [name, info] of Object.entries(characterData)) {
        for (const [key, val] of Object.entries(info)) {
          if (typeof val === 'string' && val.startsWith('images/')) {
            info[key] = '../' + val;
          } else if (typeof val === 'object' && val !== null) {
            for (const [k2, v2] of Object.entries(val)) {
              if (typeof v2 === 'string' && v2.startsWith('images/')) {
                val[k2] = '../' + v2;
              }
            }
          }
        }
      }
    }
    if (locsRes.ok) {
      locationData = await locsRes.json();
    }
  } catch (e) {
    console.warn('加载数据失败:', e);
    allPosts = [];
  }

  // 清除骨架屏
  container.innerHTML = '';

  // 构建角色筛选
  buildCharFilter(allPosts);

  // 世界卡点击
  document.querySelectorAll('.world-card').forEach(card => {
    card.addEventListener('click', () => {
      const w = card.dataset.world;
      currentWorldFilter = currentWorldFilter === w ? 'all' : w;
      // 同步顶部导航按钮
      document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === currentWorldFilter);
      });
      applyFilters();
    });
  });

  // 顶部导航筛选
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => filterByWorld(btn.dataset.filter, btn));
  });

  // 加载更多
  document.getElementById('loadMoreBtn').addEventListener('click', () => {
    displayCount += PAGE_SIZE;
    renderFeed(false);
  });

  // 主题切换按钮
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // 概况按钮
  const overviewBtn = document.getElementById('overviewBtn');
  if (overviewBtn) {
    overviewBtn.addEventListener('click', openOverview);
  }

  // 初始渲染
  applyFilters();
}

// 启动
document.addEventListener('DOMContentLoaded', init);