// 单次查询所有任务状态 - 正确端点 POST /result with {taskId}
const fs = require('fs');
const API_KEY = 'sk-7CxvP9MAoku42ywQLM8EBHtW1EjkG4wp';
const QUERY_URL = 'https://nanobananapro.cloud/api/v1/image/nano-banana/result';
const all = JSON.parse(fs.readFileSync('d32_eve_all_tasks.json','utf8'));

(async () => {
  for (const [name, r] of Object.entries(all)) {
    const id = r?.data?.id;
    if (!id) continue;
    try {
      const resp = await fetch(QUERY_URL, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: id })
      });
      const j = await resp.json();
      const st = j?.data?.status;
      const pg = j?.data?.progress;
      const urls = j?.data?.results || [];
      const firstUrl = urls[0]?.url || urls[0];
      console.log(`${name}: status=${st} progress=${pg} urls=${urls.length} ${firstUrl ? String(firstUrl).slice(0,100) : ''}`);
    } catch(e) {
      console.log(`${name}: ERROR ${e.message}`);
    }
  }
})();
