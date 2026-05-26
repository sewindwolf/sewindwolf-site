const express = require('express');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const app = express();
const PORT = 3939;

const POSTS_PATH = path.join(__dirname, '..', 'data', 'posts.json');
const PUBLIC_POSTS_PATH = path.join(__dirname, '..', 'public', 'data', 'posts.json');
const SITE_ROOT = path.join(__dirname, '..');
const GEN_SCRIPT = path.join('C:', 'Users', 'Administrator', '.agent', 'skills', 'ai-image-generator', 'references', 'gen_nano_banana.js');
const REGEN_DIR = path.join('D:', 'KnotClaw_User', 'images', 'characters', 'regen');
const REFS_BASE = 'https://raw.githubusercontent.com/sewindwolf/sewindwolf-site/main/public/images/refs';

const CHAR_REF_MAP = {
  'fengya': 'fengya_ref.png',
  'feng ya': 'fengya_ref.png',
  'tilion': 'tilion_ref.png',
  'foxlanz': 'foxlanz_ref.png',
  'yufeng': 'yufeng_ref.png',
  'yu feng': 'yufeng_ref.png',
  'theron': 'yufeng_ref.png',
  'aki': 'aki_ref.png',
  'wolvol': 'wolvol_ref.png'
};

function getRefUrl(characterEn) {
  const key = (characterEn || '').toLowerCase();
  const file = CHAR_REF_MAP[key];
  if (!file) return null;
  return REFS_BASE + '/' + file;
}

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

if (!fs.existsSync(REGEN_DIR)) fs.mkdirSync(REGEN_DIR, { recursive: true });

// === Helper: ensure post.image_history exists and contains current image_url ===
function ensureImageHistory(post) {
  let mutated = false;
  if (!Array.isArray(post.image_history)) { post.image_history = []; mutated = true; }
  if (post.image_url && !post.image_history.includes(post.image_url)) {
    post.image_history.push(post.image_url);
    mutated = true;
  }
  return mutated;
}
function pushHistoryAndSetCurrent(post, newUrl) {
  ensureImageHistory(post);
  if (newUrl && !post.image_history.includes(newUrl)) post.image_history.push(newUrl);
  post.image_url = newUrl;
}
function addToHistoryOnly(post, newUrl) {
  ensureImageHistory(post);
  if (newUrl && !post.image_history.includes(newUrl)) post.image_history.push(newUrl);
}
function writePosts(posts) {
  const json = JSON.stringify(posts, null, 2);
  fs.writeFileSync(POSTS_PATH, json, 'utf8');
  fs.writeFileSync(PUBLIC_POSTS_PATH, json, 'utf8');
}

function summarizePost(post) {
  const history = Array.isArray(post.image_history) ? post.image_history : (post.image_url ? [post.image_url] : []);
  return {
    id: post.id,
    character: post.character,
    character_en: post.character_en,
    world: post.world,
    avatar_color: post.avatar_color,
    avatar_symbol: post.avatar_symbol,
    mood: post.mood,
    location: post.location,
    game_time: post.game_time,
    timestamp: post.timestamp,
    content: post.content,
    image_url: post.image_url,
    image_prompt_preview: post.image_prompt ? String(post.image_prompt).slice(0, 220) : '',
    has_image_prompt: !!(post.image_prompt && String(post.image_prompt).trim()),
    image_history_count: history.length,
    tags: Array.isArray(post.tags) ? post.tags : [],
    reactions: post.reactions || {},
    comments_count: Array.isArray(post.comments) ? post.comments.length : 0
  };
}

function runGit(command) {
  return execSync(command, { cwd: SITE_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function safeGit(command) {
  try { return runGit(command); }
  catch (e) { return (e.stderr ? e.stderr.toString() : e.message || String(e)).trim(); }
}


// === Helper: extract gen result URL from script stdout ===
function extractResultUrl(stdout) {
  // Priority 1: Match the success line format from gen_nano_banana.js
  const successMatch = stdout.match(/\u2705\s*\u751F\u56FE\u6210\u529F\uFF1A(https:\/\/[^\s]+)/);
  if (successMatch) return successMatch[1];
  // Priority 2: Match nanobananapro URL
  const nanoMatch = stdout.match(/https:\/\/file\.nanobananapro\.cloud\/[^\s"']+/);
  if (nanoMatch) return nanoMatch[0];
  // Priority 3: Match webstatic.aiproxy URL
  const proxyMatch = stdout.match(/https:\/\/webstatic\.aiproxy\.[^\s"']+/);
  if (proxyMatch) return proxyMatch[0];
  // Priority 4: Any URL that is NOT the ref image
  const anyUrl = stdout.match(/https:\/\/(?!raw\.githubusercontent)[^\s"']+\.(png|jpg|jpeg|webp)/i);
  if (anyUrl) return anyUrl[0];
  return null;
}

// === Helper: run gen script and return URL ===
function runGenScript(prompt, refUrl, outFile) {
  return new Promise((resolve, reject) => {
    const promptFile = outFile.replace(/\.png$/, '_prompt.txt');
    fs.writeFileSync(promptFile, prompt, 'utf8');
    const args = [GEN_SCRIPT, promptFile, '--ref', refUrl, '--aspect', '16:9', '--no-polish', '-o', outFile, '--force'];
    const child = spawn('node', args, { cwd: REGEN_DIR, stdio: 'pipe' });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', d => { stdout += d.toString(); });
    child.stderr.on('data', d => { stderr += d.toString(); });
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(stderr || stdout || 'exit code ' + code));
      const url = extractResultUrl(stdout);
      if (!url) return reject(new Error('No result URL found in output. Last 300 chars: ' + stdout.slice(-300)));
      resolve(url);
    });
  });
}

app.get('/api/posts', (req, res) => {
  try {
    const raw = fs.readFileSync(POSTS_PATH, 'utf8');
    let posts = JSON.parse(raw);
    posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const total = posts.length;
    const character = req.query.character || 'all';
    const q = String(req.query.q || '').trim().toLowerCase();
    if (character && character !== 'all') posts = posts.filter(p => p.character === character);
    if (q) {
      posts = posts.filter(p => {
        const hay = [p.content, p.id, p.location, p.game_time, p.character, (p.tags || []).join(' '), p.image_prompt]
          .filter(Boolean).join(' ').toLowerCase();
        return hay.includes(q);
      });
    }

    const filteredTotal = posts.length;
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize) || 50, 1), 100);
    const totalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));
    const page = Math.min(Math.max(parseInt(req.query.page) || 1, 1), totalPages);
    const start = (page - 1) * pageSize;
    const pagePosts = posts.slice(start, start + pageSize).map(summarizePost);
    res.json({ total, filteredTotal, page, pageSize, totalPages, posts: pagePosts });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/posts/:id', (req, res) => {
  try {
    const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    ensureImageHistory(post);
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/posts/:id/history', (req, res) => {
  try {
    const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    ensureImageHistory(post);
    res.json({ id: post.id, image_url: post.image_url || '', image_history: post.image_history || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/posts/:id', (req, res) => {
  try {
    const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
    const idx = posts.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const updates = req.body;
    const allowedFields = ['content', 'image_url', 'image_prompt', 'location', 'mood', 'tags', 'game_time', 'comments'];
    for (const field of allowedFields) {
      if (updates[field] !== undefined) posts[idx][field] = updates[field];
    }
    // If image_url was changed via manual edit, make sure it's also in history
    ensureImageHistory(posts[idx]);
    writePosts(posts);
    res.json({ success: true, post: posts[idx] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/posts/:id', (req, res) => {
  try {
    let posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
    const idx = posts.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const removed = posts.splice(idx, 1)[0];
    writePosts(posts);
    res.json({ success: true, removed: removed.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// === Regen Image (single - quick mode, auto-replace) ===
app.post('/api/posts/:id/regen', (req, res) => {
  try {
    const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const prompt = post.image_prompt;
    if (!prompt || !prompt.trim()) return res.status(400).json({ error: 'No image_prompt found.' });
    const refUrl = getRefUrl(post.character_en);
    if (!refUrl) return res.status(400).json({ error: 'Cannot determine ref for: ' + (post.character_en || post.character) });

    const outFile = path.join(REGEN_DIR, post.id + '_regen.png');
    // Clear old status
    const statusFile = path.join(REGEN_DIR, post.id + '_regen_status.json');
    if (fs.existsSync(statusFile)) fs.unlinkSync(statusFile);

    res.json({ success: true, message: 'Regen started', postId: post.id });

    runGenScript(prompt, refUrl, outFile).then(newUrl => {
      const freshPosts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
      const freshIdx = freshPosts.findIndex(p => p.id === post.id);
      if (freshIdx !== -1) {
        pushHistoryAndSetCurrent(freshPosts[freshIdx], newUrl);
        writePosts(freshPosts);
      }
      fs.writeFileSync(statusFile, JSON.stringify({ status: 'done', newUrl, time: new Date().toISOString() }));
      console.log('[REGEN OK]', post.id, newUrl);
    }).catch(err => {
      fs.writeFileSync(statusFile, JSON.stringify({ status: 'error', error: err.message, time: new Date().toISOString() }));
      console.error('[REGEN FAIL]', post.id, err.message);
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/posts/:id/regen-status', (req, res) => {
  const statusFile = path.join(REGEN_DIR, req.params.id + '_regen_status.json');
  if (!fs.existsSync(statusFile)) return res.json({ status: 'pending' });
  try { res.json(JSON.parse(fs.readFileSync(statusFile, 'utf8'))); }
  catch (e) { res.json({ status: 'unknown' }); }
});

// =================================================================
// === Multi-Regen: Generate N candidates, let user pick the best ===
// =================================================================
app.post('/api/posts/:id/regen-multi', (req, res) => {
  try {
    const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const prompt = post.image_prompt;
    if (!prompt || !prompt.trim()) return res.status(400).json({ error: 'No image_prompt.' });
    const refUrl = getRefUrl(post.character_en);
    if (!refUrl) return res.status(400).json({ error: 'Cannot determine ref for: ' + (post.character_en || post.character) });

    const count = Math.min(Math.max(parseInt(req.body.count) || 3, 1), 4);
    const batchId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const batchDir = path.join(REGEN_DIR, 'batch_' + batchId);
    fs.mkdirSync(batchDir, { recursive: true });

    const batchStatusFile = path.join(batchDir, '_status.json');
    const initStatus = {
      postId: post.id, batchId, count,
      candidates: Array.from({length: count}, (_, i) => ({ index: i, status: 'pending', url: null, error: null })),
      startTime: new Date().toISOString()
    };
    fs.writeFileSync(batchStatusFile, JSON.stringify(initStatus, null, 2));
    res.json({ success: true, batchId, count, message: 'Multi-regen started' });

    // Launch all generations in parallel
    for (let i = 0; i < count; i++) {
      const outFile = path.join(batchDir, 'candidate_' + i + '.png');
      runGenScript(prompt, refUrl, outFile).then(url => {
        const status = JSON.parse(fs.readFileSync(batchStatusFile, 'utf8'));
        status.candidates[i] = { index: i, status: 'done', url, error: null };
        fs.writeFileSync(batchStatusFile, JSON.stringify(status, null, 2));
        // Auto-archive every successful candidate into post.image_history (do NOT switch current)
        try {
          const fp = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
          const fi = fp.findIndex(p => p.id === post.id);
          if (fi !== -1) { addToHistoryOnly(fp[fi], url); writePosts(fp); }
        } catch (e) { console.error('[MULTI-REGEN] archive failed:', e.message); }
        console.log('[MULTI-REGEN]', post.id, 'candidate', i, 'done:', url);
      }).catch(err => {
        const status = JSON.parse(fs.readFileSync(batchStatusFile, 'utf8'));
        status.candidates[i] = { index: i, status: 'error', url: null, error: err.message };
        fs.writeFileSync(batchStatusFile, JSON.stringify(status, null, 2));
        console.error('[MULTI-REGEN]', post.id, 'candidate', i, 'failed:', err.message);
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/posts/:id/regen-multi-status/:batchId', (req, res) => {
  const batchDir = path.join(REGEN_DIR, 'batch_' + req.params.batchId);
  const batchStatusFile = path.join(batchDir, '_status.json');
  if (!fs.existsSync(batchStatusFile)) return res.json({ status: 'not_found' });
  try {
    const data = JSON.parse(fs.readFileSync(batchStatusFile, 'utf8'));
    const allDone = data.candidates.every(c => c.status === 'done' || c.status === 'error');
    data.overall = allDone ? 'complete' : 'in_progress';
    data.doneCount = data.candidates.filter(c => c.status === 'done').length;
    data.errorCount = data.candidates.filter(c => c.status === 'error').length;
    res.json(data);
  } catch (e) {
    res.json({ status: 'error', error: e.message });
  }
});

app.post('/api/posts/:id/apply-candidate', (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing url' });
    const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
    const idx = posts.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Post not found' });
    pushHistoryAndSetCurrent(posts[idx], url);
    writePosts(posts);
    res.json({ success: true, newUrl: url, image_history: posts[idx].image_history });
    console.log('[APPLY]', req.params.id, url);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// === Image History Management ===

// Switch the current displayed image to an existing url in history.
app.post('/api/posts/:id/set-current-image', (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing url' });
    const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
    const idx = posts.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    ensureImageHistory(posts[idx]);
    if (!posts[idx].image_history.includes(url)) {
      // Accept unknown urls too (e.g. manual paste) - add them to history
      posts[idx].image_history.push(url);
    }
    posts[idx].image_url = url;
    writePosts(posts);
    res.json({ success: true, image_url: url, image_history: posts[idx].image_history });
    console.log('[SET-CURRENT]', req.params.id, url);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Remove a url from image_history. If it is the current image_url, caller must pick a replacement.
app.post('/api/posts/:id/history-image/remove', (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing url' });
    const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
    const idx = posts.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    ensureImageHistory(posts[idx]);
    if (posts[idx].image_url === url) {
      return res.status(400).json({ error: 'Cannot delete the current image. Switch to another one first.' });
    }
    posts[idx].image_history = posts[idx].image_history.filter(u => u !== url);
    writePosts(posts);
    res.json({ success: true, image_history: posts[idx].image_history });
    console.log('[HISTORY-REMOVE]', req.params.id, url);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// === Deploy ===
app.get('/api/deploy-status', (req, res) => {
  try {
    const branch = safeGit('git branch --show-current');
    const statusShort = safeGit('git status --short');
    const statusBranch = safeGit('git status --short --branch');
    const latestCommit = safeGit('git log -1 --pretty=format:%h%x20%s%x20(%cr)');
    const upstream = safeGit('git rev-parse --abbrev-ref --symbolic-full-name @{u}');
    const ahead = /^\d+$/.test(safeGit('git rev-list --count @{u}..HEAD')) ? Number(safeGit('git rev-list --count @{u}..HEAD')) : null;
    const behind = /^\d+$/.test(safeGit('git rev-list --count HEAD..@{u}')) ? Number(safeGit('git rev-list --count HEAD..@{u}')) : null;
    res.json({ success: true, branch, upstream, ahead, behind, latestCommit, statusShort, statusBranch, checkedAt: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ success: false, error: e.stderr ? e.stderr.toString() : e.message });
  }
});

app.post('/api/deploy', (req, res) => {
  try {
    const msg = (req.body.message || 'admin: update site data and admin').replace(/"/g, '');
    const before = safeGit('git status --short --branch');
    execSync('git add data/posts.json public/data/posts.json admin/server.js admin/public/app.js admin/public/style.css admin/public/index.html', { cwd: SITE_ROOT });
    let commitOutput = '';
    try {
      commitOutput = execSync('git commit -m "' + msg + '"', { cwd: SITE_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    } catch (commitErr) {
      const combined = ((commitErr.stdout || '') + '\n' + (commitErr.stderr || '') + '\n' + commitErr.message).toString();
      if (combined.includes('nothing to commit')) {
        return res.json({ success: true, message: 'Nothing changed', before, after: safeGit('git status --short --branch') });
      }
      throw commitErr;
    }
    const pushOutput = execSync('git push', { cwd: SITE_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    res.json({ success: true, message: 'Deployed!', commitOutput, pushOutput, before, after: safeGit('git status --short --branch') });
  } catch (e) {
    const err = (e.stderr ? e.stderr.toString() : e.message || String(e));
    res.status(500).json({ error: err, hint: /Authentication failed|could not read Username|token|403|401/i.test(err) ? '可能是 GitHub token/凭证过期或权限不足。' : '请查看原始错误判断是 commit、push 还是网络问题。', status: safeGit('git status --short --branch') });
  }
});

app.get('/api/characters', (req, res) => {
  try {
    const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
    const chars = [...new Set(posts.map(p => p.character).filter(Boolean))];
    res.json(chars);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
  console.log('');
  console.log('  OC Posts Editor running at http://127.0.0.1:' + PORT);
  console.log('  Total posts: ' + posts.length);
  console.log('  Multi-regen enabled (1-4 candidates)');
  console.log('  Image history tracking: ON');
  console.log('');
});