// === OC Posts Editor Frontend ===

let allPosts = [];
let filtered = [];
let currentFilter = 'all';
let searchQuery = '';
let editingId = null;
let hasUnsaved = false;
let regenTargetId = null;
let regenCount = 1;
let regenBatchId = null;
let selectedCandidateUrl = null;
let regenTargetPost = null;
let currentPage = 1;
const PAGE_SIZE = 50;
let serverTotal = 0;
let serverFilteredTotal = 0;
let serverTotalPages = 1;
let thumbObserver = null;

async function init() {
  await loadCharacters();
  bindEvents();
  await loadPosts();
  await loadDeployStatus();
}

async function loadPosts() {
  const params = new URLSearchParams({
    page: String(currentPage),
    pageSize: String(PAGE_SIZE),
    character: currentFilter,
    q: searchQuery
  });
  const res = await fetch('/api/posts?' + params.toString());
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'load posts failed');
  allPosts = data.posts || [];
  filtered = allPosts;
  serverTotal = data.total || 0;
  serverFilteredTotal = data.filteredTotal || allPosts.length;
  serverTotalPages = data.totalPages || 1;
  currentPage = data.page || currentPage;
  renderPosts();
}

async function loadCharacters() {
  const res = await fetch('/api/characters');
  const chars = await res.json();
  const sel = document.getElementById('charFilter');
  while (sel.options.length > 1) sel.remove(1);
  chars.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
}

function bindEvents() {
  document.getElementById('charFilter').addEventListener('change', e => {
    currentFilter = e.target.value;
    applyFilters();
  });
  document.getElementById('searchInput').addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase();
    applyFilters();
  });
  document.getElementById('deployBtn').addEventListener('click', deploy);
  const refreshDeployBtn = document.getElementById('refreshDeployStatusBtn');
  if (refreshDeployBtn) refreshDeployBtn.addEventListener('click', loadDeployStatus);

  // Count buttons
  document.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      regenCount = parseInt(btn.dataset.count);
    });
  });
}

function applyFilters() {
  currentPage = 1;
  loadPosts().catch(e => toast('加载失败: ' + e.message, true));
}

function renderPosts() {
  const container = document.getElementById('postsList');
  const stats = document.getElementById('stats');
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagePosts = filtered.slice(startIndex, startIndex + PAGE_SIZE);
  const rangeText = filtered.length
    ? ' | 第 ' + (startIndex + 1) + '-' + (startIndex + pagePosts.length) + ' 条'
    : '';
  stats.textContent = '显示 ' + filtered.length + ' / ' + allPosts.length + ' 条动态' + rangeText + ' | 第 ' + currentPage + '/' + totalPages + ' 页' + (hasUnsaved ? ' | ⚠️ 有未部署的修改' : '');

  let html = '';
  for (const p of pagePosts) {
    const imgTag = p.image_url
      ? '<img class="post-thumb lazy-thumb" data-src="' + escapeHtml(p.image_url) + '" decoding="async" width="160" height="100" onerror="this.className=&quot;post-thumb no-img&quot;;this.alt=&quot;图片加载失败&quot;;">'
      : '<div class="post-thumb no-img">无图</div>';
    const contentPreview = escapeHtml(p.content || '').replace(/\n/g, ' ').slice(0, 120);
    const fullPrompt = p.image_prompt || '';
    const promptPreviewSource = fullPrompt || p.image_prompt_preview || '';
    const hasPrompt = !!(p.has_image_prompt || (fullPrompt && fullPrompt.trim()) || (promptPreviewSource && promptPreviewSource.trim()));
    const promptPreview = hasPrompt ? escapeHtml(promptPreviewSource).slice(0, 150) + (promptPreviewSource.length > 150 ? '...' : '') : '<em style="color:var(--text-dim);">无提示词</em>';

    const historyBlock = renderHistoryBlock(p);

    html += '<div class="post-card" data-id="' + p.id + '">'
      + imgTag
      + '<div class="post-info">'
      + '<div class="post-meta">'
      + '<span class="char-badge">' + (p.character || '') + '</span>'
      + '<span>' + (p.game_time || '') + '</span>'
      + '<span>' + (p.location || '') + '</span>'
      + '<span>' + (p.timestamp ? p.timestamp.slice(0,16) : '') + '</span>'
      + '<span>' + (p.mood || '') + '</span>'
      + '</div>'
      + '<div class="post-content-preview">' + contentPreview + '</div>'
      + '<details class="prompt-details">'
      + '<summary class="prompt-summary">🎨 提示词</summary>'
      + '<div class="prompt-content">' + promptPreview + '</div>'
      + '</details>'
      + historyBlock
      + '</div>'
      + '<div class="post-actions">'
      + '<button class="btn-edit" onclick="openEdit(\'' + p.id + '\')">编辑</button>'
      + '<button class="btn-regen-sm" onclick="openRegen(\'' + p.id + '\')" ' + (hasPrompt ? '' : 'disabled title="请先在编辑中填写提示词"') + '>🔄 重新生图</button>'
      + '<button class="btn-delete" onclick="confirmDelete(\'' + p.id + '\')">删除</button>'
      + '</div>'
      + '</div>';
  }
  const pagination = renderPagination(totalPages);
  container.innerHTML = pagination + html + pagination;
  activateLazyThumbs(container);
}

function renderPagination(totalPages) {
  if (totalPages <= 1) return '';
  let html = '<nav class="pagination" aria-label="分页">';
  html += '<button class="page-btn" onclick="setPage(' + (currentPage - 1) + ')" ' + (currentPage <= 1 ? 'disabled' : '') + '>上一页</button>';
  const from = Math.max(1, currentPage - 3);
  const to = Math.min(totalPages, currentPage + 3);
  if (from > 1) {
    html += '<button class="page-btn" onclick="setPage(1)">1</button>';
    if (from > 2) html += '<span class="page-ellipsis">...</span>';
  }
  for (let p = from; p <= to; p++) {
    html += '<button class="page-btn ' + (p === currentPage ? 'active' : '') + '" onclick="setPage(' + p + ')">' + p + '</button>';
  }
  if (to < totalPages) {
    if (to < totalPages - 1) html += '<span class="page-ellipsis">...</span>';
    html += '<button class="page-btn" onclick="setPage(' + totalPages + ')">' + totalPages + '</button>';
  }
  html += '<button class="page-btn" onclick="setPage(' + (currentPage + 1) + ')" ' + (currentPage >= totalPages ? 'disabled' : '') + '>下一页</button>';
  html += '</nav>';
  return html;
}

function setPage(page) {
  currentPage = page;
  loadPosts().then(() => window.scrollTo({ top: 0, behavior: 'auto' })).catch(e => toast('翻页失败: ' + e.message, true));
}

function activateLazyThumbs(root) {
  if (thumbObserver) thumbObserver.disconnect();
  const imgs = root.querySelectorAll('img.lazy-thumb[data-src]');
  if (!('IntersectionObserver' in window)) {
    imgs.forEach(loadLazyThumb);
    return;
  }
  thumbObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadLazyThumb(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '300px 0px', threshold: 0.01 });
  imgs.forEach(img => thumbObserver.observe(img));
}

function loadLazyThumb(img) {
  const src = img.getAttribute('data-src');
  if (!src) return;
  img.src = src;
  img.removeAttribute('data-src');
}

// === Render image history block (per-card) ===
// 获取所有历史生图，当前图标绿边框，其他可点击切换
function renderHistoryBlock(p) {
  const count = Array.isArray(p.image_history) ? p.image_history.length : (p.image_history_count || (p.image_url ? 1 : 0));
  if (count <= 1) {
    return '<details class="history-details" style="opacity:0.6;">'
      + '<summary class="history-summary">📚 历史图 (' + count + ' 张)</summary>'
      + '<div class="history-content"><em style="color:var(--text-dim);">当前只有 1 张图，后台重新生图后候选图会自动留存在这里</em></div>'
      + '</details>';
  }
  return '<details class="history-details" data-post-id="' + p.id + '" ontoggle="onHistoryToggle(this)">'
    + '<summary class="history-summary">📚 历史图 (' + count + ' 张，展开后加载)</summary>'
    + '<div class="history-content"><em style="color:var(--text-dim);">展开后加载历史缩略图...</em></div>'
    + '</details>';
}

function renderHistoryGrid(pid, imageUrl, history) {
  let thumbs = '';
  for (let i = 0; i < history.length; i++) {
    const url = history[i];
    const isCurrent = (url === imageUrl);
    const urlEsc = encodeURIComponent(url);
    thumbs += '<div class="history-thumb ' + (isCurrent ? 'current' : '') + '">'
      + '<img data-src="' + escapeHtml(url) + '" decoding="async" width="140" height="90" alt="" onclick="previewFullImage(\'' + urlEsc + '\')">'
      + '<div class="history-thumb-actions">'
      + (isCurrent
          ? '<span class="history-current-tag">✓ 当前</span>'
          : '<button class="btn-xs btn-set-current" onclick="setCurrentImage(\'' + pid + '\',\'' + urlEsc + '\')">设为当前</button>'
              + '<button class="btn-xs btn-del-history" onclick="removeHistoryImage(\'' + pid + '\',\'' + urlEsc + '\')">删除</button>'
        )
      + '</div>'
      + '</div>';
  }
  return '<div class="history-grid">' + thumbs + '</div>';
}

async function onHistoryToggle(detailsEl) {
  const imgs = detailsEl.querySelectorAll('img[data-src]');
  if (detailsEl.open) {
    if (detailsEl.dataset.postId && !detailsEl.dataset.loaded) {
      const content = detailsEl.querySelector('.history-content');
      try {
        const res = await fetch('/api/posts/' + detailsEl.dataset.postId + '/history');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'load history failed');
        content.innerHTML = renderHistoryGrid(data.id, data.image_url, data.image_history || []);
        detailsEl.dataset.loaded = '1';
      } catch (e) {
        content.innerHTML = '<em style="color:var(--danger);">历史图加载失败：' + escapeHtml(e.message) + '</em>';
      }
    }
    detailsEl.querySelectorAll('img[data-src]').forEach(img => { if (!img.src) img.src = img.getAttribute('data-src'); });
  } else {
    detailsEl.querySelectorAll('img[data-src]').forEach(img => { img.removeAttribute('src'); });
  }
}

// 页内模态预览全图（不再新标签页打开原图，避免高清 PNG 占满内存）
async function setCurrentImage(postId, url) {
  const realUrl = decodeURIComponent(url);
  try {
    const res = await fetch('/api/posts/' + postId + '/set-current-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: realUrl })
    });
    const data = await res.json();
    if (data.success) {
      hasUnsaved = true;
      toast('✅ 已切换当前图！记得点部署');
      await loadPosts();
    } else {
      toast('切换失败: ' + (data.error || ''), true);
    }
  } catch (e) {
    toast('网络错误: ' + e.message, true);
  }
}

async function removeHistoryImage(postId, url) {
  const realUrl = decodeURIComponent(url);
  if (!confirm('确定从历史中删除这张图吗？（图本身在图床仍会保留）')) return;
  try {
    const res = await fetch('/api/posts/' + postId + '/history-image/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: realUrl })
    });
    const data = await res.json();
    if (data.success) {
      hasUnsaved = true;
      toast('已删除');
      await loadPosts();
    } else {
      toast('删除失败: ' + (data.error || ''), true);
    }
  } catch (e) {
    toast('网络错误: ' + e.message, true);
  }
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// === Edit Modal ===
async function openEdit(id) {
  let post = allPosts.find(p => p.id === id);
  try {
    const res = await fetch('/api/posts/' + id);
    const full = await res.json();
    if (res.ok) post = full;
  } catch (e) {
    toast('详情加载失败，使用列表摘要打开: ' + e.message, true);
  }
  if (!post) return;
  editingId = id;
  document.getElementById('editId').value = post.id;
  document.getElementById('editChar').value = post.character || '';
  document.getElementById('editTime').value = post.timestamp || '';
  document.getElementById('editGameTime').value = post.game_time || '';
  document.getElementById('editLocation').value = post.location || '';
  document.getElementById('editMood').value = post.mood || '';
  document.getElementById('editTags').value = (post.tags || []).join(', ');
  document.getElementById('editImageUrl').value = post.image_url || '';
  document.getElementById('editImagePrompt').value = post.image_prompt || '';
  document.getElementById('editContent').value = post.content || '';
  const img = document.getElementById('imagePreview');
  img.removeAttribute('src');
  img.style.display = 'none';
  document.getElementById('editModal').classList.add('open');
}

function closeModal() {
  document.getElementById('editModal').classList.remove('open');
  const img = document.getElementById('imagePreview');
  if (img) {
    img.removeAttribute('src');
    img.style.display = 'none';
  }
  editingId = null;
}

function previewImage() {
  const url = document.getElementById('editImageUrl').value;
  const img = document.getElementById('imagePreview');
  if (url) { img.src = url; img.style.display = 'block'; }
  else { img.style.display = 'none'; }
}

async function savePost() {
  if (!editingId) return;
  const tagsRaw = document.getElementById('editTags').value;
  const tags = tagsRaw.split(/[,\uFF0C]/).map(t => t.trim()).filter(Boolean);
  const body = {
    content: document.getElementById('editContent').value,
    image_url: document.getElementById('editImageUrl').value,
    image_prompt: document.getElementById('editImagePrompt').value,
    location: document.getElementById('editLocation').value,
    mood: document.getElementById('editMood').value,
    game_time: document.getElementById('editGameTime').value,
    tags: tags
  };
  try {
    const res = await fetch('/api/posts/' + editingId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      hasUnsaved = true;
      toast('\u4FDD\u5B58\u6210\u529F\uFF01\u8BB0\u5F97\u70B9\u90E8\u7F72');
      closeModal();
      await loadPosts();
    } else {
      toast('\u4FDD\u5B58\u5931\u8D25: ' + (data.error || ''), true);
    }
  } catch (e) {
    toast('\u7F51\u7EDC\u9519\u8BEF: ' + e.message, true);
  }
}

// === Regen Modal (Multi-mode) ===
async function openRegen(id) {
  let post = allPosts.find(p => p.id === id);
  try {
    const res = await fetch('/api/posts/' + id);
    const full = await res.json();
    if (res.ok) post = full;
  } catch (e) {
    toast('详情加载失败: ' + e.message, true);
  }
  if (!post) return;
  if (!post.image_prompt || !post.image_prompt.trim()) {
    toast('请先在编辑中填写 image_prompt', true);
    return;
  }
  regenTargetId = id;
  regenTargetPost = post;
  regenBatchId = null;
  selectedCandidateUrl = null;
  regenCount = 1;

  document.getElementById('regenChar').textContent = post.character + ' (' + (post.character_en || '') + ')';
  document.getElementById('regenId').textContent = post.id;
  document.getElementById('regenPromptPreview').value = post.image_prompt;

  // Reset UI state
  document.getElementById('candidatesSection').style.display = 'none';
  document.getElementById('candidatesGrid').innerHTML = '';
  document.getElementById('regenStartBtn').style.display = '';
  document.getElementById('regenStartBtn').disabled = false;
  document.getElementById('regenStartBtn').textContent = '开始生成';
  document.getElementById('regenApplyBtn').style.display = 'none';
  document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.count-btn[data-count="1"]').classList.add('active');

  document.getElementById('regenModal').classList.add('open');
}

function closeRegenModal() {
  document.getElementById('regenModal').classList.remove('open');
  regenTargetId = null;
  regenTargetPost = null;
  regenBatchId = null;
  selectedCandidateUrl = null;
}

async function startRegen() {
  if (!regenTargetId) return;
  const btn = document.getElementById('regenStartBtn');
  btn.textContent = '\u751F\u6210\u4E2D...';
  btn.disabled = true;

  // If user edited the prompt in the modal, save it first
  const editedPrompt = document.getElementById('regenPromptPreview').value.trim();
  const post = regenTargetPost || allPosts.find(p => p.id === regenTargetId);
  if (editedPrompt && post && editedPrompt !== post.image_prompt) {
    // Save the updated prompt
    await fetch('/api/posts/' + regenTargetId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_prompt: editedPrompt })
    });
    post.image_prompt = editedPrompt;
  }

  if (regenCount === 1) {
    // Single mode: quick auto-replace (existing behavior)
    try {
      const res = await fetch('/api/posts/' + regenTargetId + '/regen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success) {
        toast('\u91CD\u65B0\u751F\u56FE\u5DF2\u542F\u52A8\uFF0C\u7EA6 1~3 \u5206\u949F\u540E\u5B8C\u6210');
        closeRegenModal();
        pollRegenStatus(regenTargetId);
      } else {
        toast('\u542F\u52A8\u5931\u8D25: ' + data.error, true);
        btn.textContent = '\u5F00\u59CB\u751F\u6210';
        btn.disabled = false;
      }
    } catch (e) {
      toast('\u7F51\u7EDC\u9519\u8BEF: ' + e.message, true);
      btn.textContent = '\u5F00\u59CB\u751F\u6210';
      btn.disabled = false;
    }
  } else {
    // Multi mode: generate N candidates
    try {
      const res = await fetch('/api/posts/' + regenTargetId + '/regen-multi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: regenCount })
      });
      const data = await res.json();
      if (data.success) {
        regenBatchId = data.batchId;
        toast('\u6B63\u5728\u751F\u6210 ' + regenCount + ' \u5F20\u5019\u9009\u56FE...');
        showCandidatesSection();
        pollMultiRegenStatus();
      } else {
        toast('\u542F\u52A8\u5931\u8D25: ' + data.error, true);
        btn.textContent = '\u5F00\u59CB\u751F\u6210';
        btn.disabled = false;
      }
    } catch (e) {
      toast('\u7F51\u7EDC\u9519\u8BEF: ' + e.message, true);
      btn.textContent = '\u5F00\u59CB\u751F\u6210';
      btn.disabled = false;
    }
  }
}

function showCandidatesSection() {
  const section = document.getElementById('candidatesSection');
  section.style.display = 'block';
  const grid = document.getElementById('candidatesGrid');
  // Show placeholder cards
  let html = '';
  for (let i = 0; i < regenCount; i++) {
    html += '<div class="candidate-card" id="candidate_' + i + '">'
      + '<div class="candidate-img-wrapper">'
      + '<div class="candidate-loading"><div class="spinner"></div><span>\u751F\u6210\u4E2D...</span></div>'
      + '</div>'
      + '<div class="candidate-label">\u5019\u9009 ' + (i+1) + '</div>'
      + '</div>';
  }
  grid.innerHTML = html;
  document.getElementById('candidatesProgress').textContent = '0/' + regenCount + ' \u5B8C\u6210';
}

async function pollMultiRegenStatus() {
  if (!regenBatchId || !regenTargetId) return;
  const maxAttempts = 120; // 10 minutes max
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 5000));
    try {
      const res = await fetch('/api/posts/' + regenTargetId + '/regen-multi-status/' + regenBatchId);
      const data = await res.json();

      if (data.candidates) {
        updateCandidatesUI(data);
      }

      if (data.overall === 'complete') {
        document.getElementById('candidatesProgress').textContent = data.doneCount + '/' + data.count + ' \u5B8C\u6210' + (data.errorCount > 0 ? ' (' + data.errorCount + ' \u5931\u8D25)' : '');
        const startBtn = document.getElementById('regenStartBtn');
        startBtn.textContent = '\u91CD\u65B0\u751F\u6210';
        startBtn.disabled = false;

        if (data.doneCount > 0) {
          toast('\u2705 ' + data.doneCount + ' \u5F20\u5019\u9009\u56FE\u5DF2\u5B8C\u6210\uFF0C\u70B9\u51FB\u9009\u62E9\u6700\u4F73\u56FE\u7247');
        } else {
          toast('\u274C \u6240\u6709\u751F\u6210\u5747\u5931\u8D25', true);
        }
        return;
      }

      // Update progress
      if (data.doneCount !== undefined) {
        document.getElementById('candidatesProgress').textContent = data.doneCount + '/' + data.count + ' \u5B8C\u6210...';
      }
    } catch (e) {
      // ignore poll errors
    }
  }
  toast('\u751F\u6210\u8D85\u65F6\uFF0C\u8BF7\u624B\u52A8\u68C0\u67E5', true);
}

function updateCandidatesUI(data) {
  for (const c of data.candidates) {
    const card = document.getElementById('candidate_' + c.index);
    if (!card) continue;
    const wrapper = card.querySelector('.candidate-img-wrapper');

    if (c.status === 'done' && c.url) {
      wrapper.innerHTML = '<img class="candidate-img" src="' + c.url + '" onclick="selectCandidate(' + c.index + ', \'' + c.url + '\')">';
      card.classList.add('ready');
    } else if (c.status === 'error') {
      wrapper.innerHTML = '<div class="candidate-error">\u274C \u5931\u8D25</div>';
      card.classList.add('failed');
    }
    // pending: keep spinner
  }
}

function selectCandidate(index, url) {
  selectedCandidateUrl = url;
  // Highlight selected
  document.querySelectorAll('.candidate-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById('candidate_' + index);
  if (card) card.classList.add('selected');
  // Show apply button
  document.getElementById('regenApplyBtn').style.display = '';
}

async function applySelected() {
  if (!selectedCandidateUrl || !regenTargetId) return;
  const btn = document.getElementById('regenApplyBtn');
  btn.textContent = '\u5E94\u7528\u4E2D...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/posts/' + regenTargetId + '/apply-candidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: selectedCandidateUrl })
    });
    const data = await res.json();
    if (data.success) {
      hasUnsaved = true;
      toast('\u2705 \u5DF2\u66FF\u6362\u56FE\u7247\uFF01\u8BB0\u5F97\u70B9\u90E8\u7F72');
      closeRegenModal();
      await loadPosts();
    } else {
      toast('\u5E94\u7528\u5931\u8D25: ' + data.error, true);
    }
  } catch (e) {
    toast('\u7F51\u7EDC\u9519\u8BEF: ' + e.message, true);
  } finally {
    btn.textContent = '\u2705 \u4F7F\u7528\u9009\u4E2D\u56FE\u7247';
    btn.disabled = false;
  }
}

// === Single Regen Polling (for count=1 quick mode) ===
async function pollRegenStatus(postId) {
  const maxAttempts = 60;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 5000));
    try {
      const res = await fetch('/api/posts/' + postId + '/regen-status');
      const data = await res.json();
      if (data.status === 'done') {
        toast('\u2705 \u91CD\u65B0\u751F\u56FE\u5B8C\u6210\uFF01\u5DF2\u66FF\u6362\u3002\u8BB0\u5F97\u70B9\u90E8\u7F72');
        hasUnsaved = true;
        await loadPosts();
        return;
      } else if (data.status === 'error') {
        toast('\u274C \u751F\u56FE\u5931\u8D25: ' + (data.error || '').slice(0, 120), true);
        return;
      }
    } catch (e) { /* ignore */ }
  }
  toast('\u751F\u56FE\u8D85\u65F6\uFF0C\u8BF7\u624B\u52A8\u68C0\u67E5', true);
}

// === Delete ===
function confirmDelete(id) {
  const post = allPosts.find(p => p.id === id);
  document.getElementById('confirmText').textContent = '\u786E\u5B9A\u5220\u9664 "' + post.character + ' - ' + (post.content||'').slice(0,30) + '..." \u5417\uFF1F';
  document.getElementById('confirmModal').classList.add('open');
  document.getElementById('confirmOk').onclick = () => doDelete(id);
}

function closeConfirm() {
  document.getElementById('confirmModal').classList.remove('open');
}

async function doDelete(id) {
  closeConfirm();
  try {
    const res = await fetch('/api/posts/' + id, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      hasUnsaved = true;
      toast('\u5DF2\u5220\u9664');
      await loadPosts();
    } else {
      toast('\u5220\u9664\u5931\u8D25', true);
    }
  } catch (e) {
    toast('\u7F51\u7EDC\u9519\u8BEF', true);
  }
}

// === Deploy ===
async function loadDeployStatus() {
  const panel = document.getElementById('deployStatusPanel');
  if (!panel) return;
  panel.textContent = '读取部署状态中...';
  try {
    const res = await fetch('/api/deploy-status');
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'deploy status failed');
    const dirty = data.statusShort && data.statusShort.trim();
    panel.innerHTML = '<div><strong>分支：</strong>' + escapeHtml(data.branch || '-') + ' → ' + escapeHtml(data.upstream || '-') + '</div>'
      + '<div><strong>同步：</strong>ahead ' + (data.ahead ?? '-') + ' / behind ' + (data.behind ?? '-') + '</div>'
      + '<div><strong>最近提交：</strong>' + escapeHtml(data.latestCommit || '-') + '</div>'
      + '<div><strong>本地变更：</strong>' + (dirty ? '<pre>' + escapeHtml(data.statusShort) + '</pre>' : '干净') + '</div>';
  } catch (e) {
    panel.innerHTML = '<span class="deploy-error">部署状态读取失败：' + escapeHtml(e.message) + '</span>';
  }
}

async function deploy() {
  if (!confirm('确认提交并推送到线上？')) return;
  const btn = document.getElementById('deployBtn');
  btn.textContent = '部署中...';
  btn.disabled = true;
  try {
    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'admin: manual edit via editor' })
    });
    const data = await res.json();
    if (data.success) {
      hasUnsaved = false;
      toast('部署成功! ' + data.message);
      await loadDeployStatus();
      renderPosts();
    } else {
      toast('部署失败: ' + (data.error || data.hint || ''), true);
      await loadDeployStatus();
    }
  } catch (e) {
    toast('部署错误: ' + e.message, true);
    await loadDeployStatus();
  } finally {
    btn.textContent = 'Git Push 部署';
    btn.disabled = false;
  }
}

// === Toast ===
function toast(msg, isError) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show' + (isError ? ' error' : '');
  setTimeout(() => { el.className = 'toast'; }, 4000);
}

init();
