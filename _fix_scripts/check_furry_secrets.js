const https = require('https');

const password = process.argv[2] || process.env.FURRY_CREATOR_PASSWORD;
if (!password) {
  console.error('Usage: node _fix_scripts/check_furry_secrets.js <password>');
  process.exit(2);
}

function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const payload = Buffer.from(JSON.stringify(body));
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'content-length': payload.length
      }
    }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        try { resolve({ status: res.statusCode, data: JSON.parse(text), text }); }
        catch { resolve({ status: res.statusCode, data: null, text }); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

(async () => {
  const res = await postJson('https://sewindwolf.art/api/furry-config-status', { password });
  console.log('status=' + res.status);
  console.log('body=' + JSON.stringify(res.data || res.text));
  if (res.status !== 200 || !res.data || !res.data.ok || !res.data.hasBananaKey || !res.data.hasGptImage2Key) process.exit(1);
})().catch(err => {
  console.error(err);
  process.exit(1);
});