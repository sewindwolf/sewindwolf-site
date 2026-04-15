// ===== 状态管理 =====
let allPosts = [];
let filteredPosts = [];
let currentWorldFilter = 'all';
let currentCharFilter = 'all';
let displayCount = 10;
const PAGE_SIZE = 10;

// 反应状态（存 localStorage）
const reactionKey = 'sw_reactions';
let reactionState = JSON.parse(localStorage.getItem(reactionKey) || '{}');

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

  Object.entries(chars).forEach(([name, info]) => {
    const btn = document.createElement('button');
    btn.className = 'char-btn';
    btn.dataset.char = name;
    btn.innerHTML = `
      <span class="char-avatar-mini" style="background:${info.color}22;color:${info.color}">${info.symbol}</span>
      ${escapeHtml(name)}
    `;
    btn.addEventListener('click', () => filterByChar(name, btn));
    container.appendChild(btn);
  });
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

  const card = document.createElement('article');
  card.className = 'post-card';
  card.dataset.id = post.id;
  card.dataset.world = post.world;
  card.dataset.char = post.character;

  card.innerHTML = `
    <div class="card-header">
      <div class="char-avatar" style="background:${post.avatar_color}22;color:${post.avatar_color}">${post.avatar_symbol || '?'}</div>
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
      <p class="card-content">${escapeHtml(post.content)}</p>
      ${imageHtml}
      ${tagsHtml}
    </div>
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
  slice.slice(existingCount).forEach((post, i) => {
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
  if (e.key === 'Escape') closeLightbox();
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
    // 加载数据（加时间戳防缓存）
    const res = await fetch(`data/posts.json?t=${Date.now()}`);
    if (!res.ok) throw new Error('加载失败');
    allPosts = await res.json();
  } catch (e) {
    console.warn('加载 posts.json 失败，使用空数据', e);
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

  // 初始渲染
  applyFilters();
}

// 启动
document.addEventListener('DOMContentLoaded', init);
