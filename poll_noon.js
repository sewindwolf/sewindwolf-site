// Poll one nano-banana-pro task until done
// Usage: node poll_noon.js <tag>
const fs = require('fs');
const https = require('https');

const OFFICIAL_KEY = 'sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp';
const POLL_URL = 'https://nanobananapro.cloud/api/v1/image/nano-banana/result';

const [,, tag] = process.argv;
const taskId = fs.readFileSync(`task_${tag}.txt`, 'utf8').trim();

if (!tag || !taskId) {
  console.error('Usage: node poll_noon.js <tag>');
  process.exit(2);
}

console.log(`[${tag}] polling taskId=${taskId}`);

function poll() {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ taskId });
    const url = new URL(POLL_URL);
    const opts = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + OFFICIAL_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      timeout: 20000
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Parse fail: ' + data.slice(0, 300))); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

(async () => {
  for (let i = 1; i <= 40; i++) {
    try {
      const j = await poll();
      const d = j.data || {};
      const status = d.status;
      if (status === 'succeeded') {
        const url = d.results && d.results[0] && d.results[0].url;
        if (url) {
          console.log(`[${tag}] SUCCESS ${url}`);
          fs.writeFileSync(`url_${tag}.txt`, url, 'utf8');
          process.exit(0);
        } else {
          console.log(`[${tag}] success but no url: ${JSON.stringify(j).slice(0,300)}`);
        }
      } else if (status === 'failed') {
        console.log(`[${tag}] FAILED ${JSON.stringify(j).slice(0, 300)}`);
        process.exit(2);
      } else {
        if (i % 3 === 0) console.log(`[${tag}] poll ${i}: ${status}`);
      }
    } catch (e) {
      console.log(`[${tag}] poll ${i} err: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 6000));
  }
  console.log(`[${tag}] TIMEOUT`);
  process.exit(3);
})();
