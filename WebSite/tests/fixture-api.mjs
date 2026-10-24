import { createServer } from 'node:http';
import { once } from 'node:events';
import { pathToFileURL } from 'node:url';

export async function startFixture(port = 0) {
  const state = { mode: 'ok', title: 'SSR fixture title', calls: [] };
  const id = '0123456789abcdef01234567';
  const nextId = '1123456789abcdef01234567';
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://fixture');
    if (url.pathname === '/__state') { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(state)); return; }
    if (url.pathname === '/__mode') { state.mode = url.searchParams.get('mode') || 'ok'; res.end('ok'); return; }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    state.calls.push({ path: req.url, method: req.method, body: Buffer.concat(chunks).toString() });
    if (state.mode === 'slow') { await new Promise((resolve) => { const timer = setTimeout(resolve, 11_000); timer.unref(); res.on('close', () => { clearTimeout(timer); resolve(); }); }); }
    res.setHeader('content-type', 'application/json');
    if (state.mode === 'error') { res.writeHead(503); res.end('{"error":"offline"}'); return; }
    if (state.mode === 'malformed') { res.end('not json'); return; }
    if (url.pathname === '/BlogPosts/feed') { res.setHeader('content-type', 'text/xml'); res.end('<feed>fixture</feed>'); return; }
    if (url.pathname === '/echo') { res.end(JSON.stringify(state.calls.at(-1))); return; }
    const second = url.pathname.endsWith(nextId);
    const post = { id: second ? nextId : id, title: second ? 'Second fixture title' : state.title,
      intro: 'Fixture intro', imageName: 'blog-post-thumb-1.jpg',
      info: { regDate: '2026-01-01', publishDate: 'yesterday', readMin: '5 min', commentCount: 0 },
      navigator: second ? { previousPostId: id } : { nextPostId: nextId },
      body: [{ component: 'p', children: [second ? 'Second fixture body' : 'SSR fixture body'] },
        { component: 'a', attributes: { href: 'https://github.com/35HaRRy/hayrihabip.com' }, children: [{ component: 'icon', attributes: { icon: ['fab', 'github'] } }, 'Repository'] },
        { component: 'tweet', attributes: { tweetId: second ? '5678' : '1234' } },
        { component: 'tweet', attributes: { tweetId: '9999' } }] };
    if (url.pathname === '/BlogPosts') {
      const pageIndex = Number(url.searchParams.get('pageIndex') || 0);
      const pageSize = Number(url.searchParams.get('pageSize') || 25);
      const empty = state.mode === 'empty';
      res.end(JSON.stringify({ PageIndex: pageIndex, PageSize: pageSize,
        ShowingFirstRowIndex: empty ? 0 : pageIndex * pageSize + 1,
        ShowingLastRowIndex: empty ? 0 : pageIndex * pageSize + 1,
        TotalPageCount: empty ? 0 : 2, TotalRecord: empty ? 0 : 26, ViewingRecord: empty ? 0 : 1, Rows: empty ? [] : [post] }));
    } else if (url.pathname === `/BlogPosts/latest` || url.pathname === `/BlogPosts/${id}` || second) {
      if (state.mode === 'missing') { res.writeHead(404); res.end('{"MessageType":0}'); }
      else res.end(JSON.stringify({ MessageType: 1, Result: post }));
    } else { res.writeHead(404); res.end('{"MessageType":0}'); }
  }).listen(port, '127.0.0.1');
  await once(server, 'listening');
  return { state, url: `http://127.0.0.1:${server.address().port}`, close: () => { server.closeAllConnections(); server.close(); } };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const fixture = await startFixture(Number(process.env.FIXTURE_PORT || 5059));
  console.log(`Fixture API: ${fixture.url}`);
}
