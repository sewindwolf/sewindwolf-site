// 轮询第32天暮色波次6个生图任务
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp';
const QUERY_URL = 'https://nanobananapro.cloud/api/v1/image/nano-banana/';

const all = JSON.parse(fs.readFileSync('d32_eve_all_tasks.json','utf8'));
const tasks = {};
for (const [name,r] of Object.entries(all)) {
  if (r?.data?.id) tasks[name] = { id: r.data.id, done: false };
}

async function query(id) {
  const resp = await fetch(QUERY_URL + id, {
    headers: { 'Authorization': 'Bearer ' + API_KEY }
  });
  return await resp.json();
}

async function downloadImage(url, dest) {
  const resp = await fetch(url);
  const buf = Buffer.from(await resp.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

(async () => {
  const maxWait = 180; // 最多等180次 * 5秒 = 15分钟
  let results = {};
  for (let i = 0; i < maxWait; i++) {
    let allDone = true;
    for (const [name, t] of Object.entries(tasks)) {
      if (t.done) continue;
      try {
        const r = await query(t.id);
        const st = r?.data?.status;
        const pg = r?.data?.progress;
        process.stdout.write(`${name}:${st}(${pg}) `);
        if (st === 'succeeded' || st === 'completed' || (r?.data?.results?.length > 0 && st !== 'running')) {
          const url = r.data.results?.[0]?.url || r.data.results?.[0];
          if (url) {
            t.done = true;
            t.url = url;
            results[name] = url;
            const dest = path.join('d32_eve_imgs', name + '.png');
            if (!fs.existsSync('d32_eve_imgs')) fs.mkdirSync('d32_eve_imgs');
            await downloadImage(url, dest);
            console.log(`\n  [${name}] DONE -> ${dest}`);
          } else {
            allDone = false;
          }
        } else if (st === 'failed' || st === 'error') {
          t.done = true;
          t.error = r;
          console.log(`\n  [${name}] FAILED`, JSON.stringify(r).slice(0,200));
        } else {
          allDone = false;
        }
      } catch (e) {
        console.error(`\n  [${name}] query error`, e.message);
        allDone = false;
      }
    }
    console.log();
    if (allDone) break;
    await new Promise(r => setTimeout(r, 5000));
  }
  fs.writeFileSync('d32_eve_results.json', JSON.stringify({tasks, results}, null, 2));
  console.log('FINAL:', results);
})();
