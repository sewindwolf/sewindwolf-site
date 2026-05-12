// 下载6张图
const fs = require('fs');
const path = require('path');
const API_KEY = 'sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp';
const QUERY_URL = 'https://nanobananapro.cloud/api/v1/image/nano-banana/result';
const all = JSON.parse(fs.readFileSync('d32_eve_all_tasks.json','utf8'));

(async () => {
  if (!fs.existsSync('d32_eve_imgs')) fs.mkdirSync('d32_eve_imgs');
  const urls = {};
  for (const [name, r] of Object.entries(all)) {
    const id = r?.data?.id;
    const resp = await fetch(QUERY_URL, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: id })
    });
    const j = await resp.json();
    const url = j?.data?.results?.[0]?.url;
    if (!url) { console.log(name, 'NO URL'); continue; }
    urls[name] = url;
    const imgResp = await fetch(url);
    const buf = Buffer.from(await imgResp.arrayBuffer());
    const dest = path.join('d32_eve_imgs', name + '.png');
    fs.writeFileSync(dest, buf);
    console.log(`${name} -> ${dest} (${(buf.length/1024).toFixed(0)}KB)`);
  }
  fs.writeFileSync('d32_eve_urls.json', JSON.stringify(urls, null, 2));
})();
