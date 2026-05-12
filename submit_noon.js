// Submit one nano-banana-pro task with multiple reference images
// Usage: node submit_noon.js <tag> <promptFile> <ref1> <ref2> ...
const fs = require('fs');
const https = require('https');

const OFFICIAL_KEY = 'sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp';
const SUBMIT_URL = 'https://nanobananapro.cloud/api/v1/image/nano-banana';

const [,, tag, promptFile, ...refs] = process.argv;

if (!tag || !promptFile || refs.length === 0) {
  console.error('Usage: node submit_noon.js <tag> <promptFile> <ref1> [ref2] ...');
  process.exit(2);
}

const prompt = fs.readFileSync(promptFile, 'utf8');
console.log(`[${tag}] prompt len=${prompt.length}, refs=${refs.length}`);

function buildMultipart(boundary, fields) {
  const lines = [];
  for (const [k, v] of fields) {
    lines.push(`--${boundary}`);
    lines.push(`Content-Disposition: form-data; name="${k}"`);
    lines.push('');
    lines.push(v);
  }
  lines.push(`--${boundary}--`);
  return Buffer.from(lines.join('\r\n'), 'utf8');
}

async function submit() {
  const boundary = '----NanoBanana' + Date.now();
  const fields = [
    ['prompt', prompt],
    ['model', 'nano-banana-pro'],
    ['mode', 'image-to-image'],
    ['aspectRatio', '16:9'],
    ['imageSize', '1K']
  ];
  for (const r of refs) fields.push(['imageUrl', r]);
  const body = buildMultipart(boundary, fields);

  return new Promise((resolve, reject) => {
    const url = new URL(SUBMIT_URL);
    const opts = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + OFFICIAL_KEY,
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': body.length
      },
      timeout: 45000
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.data && j.data.id) resolve(j.data.id);
          else reject(new Error('No taskId: ' + data.slice(0, 400)));
        } catch (e) {
          reject(new Error('Parse fail: ' + data.slice(0, 400)));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

(async () => {
  for (let i = 1; i <= 3; i++) {
    try {
      const id = await submit();
      console.log(`[${tag}] submitted taskId=${id}`);
      fs.writeFileSync(`task_${tag}.txt`, id, 'utf8');
      process.exit(0);
    } catch (e) {
      console.log(`[${tag}] attempt ${i} failed: ${e.message}`);
      if (i < 3) await new Promise(r => setTimeout(r, 5000));
    }
  }
  fs.writeFileSync(`task_${tag}.txt`, '', 'utf8');
  process.exit(1);
})();
