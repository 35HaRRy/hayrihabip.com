import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { parsePage, parsePostId } from '../src/services/blogParams';
import { forwardApi, fetchApi, getApiBaseUrl } from '../src/services/api.server';
import { getPosts, getPostById } from '../src/services/blog.server';

const post = { id: '0123456789abcdef01234567', title: 'API title', intro: 'Intro', imageName: 'a.jpg',
  info: { regDate: '2026-01-01', publishDate: 'yesterday', readMin: '5 min', commentCount: 0 },
  navigator: {}, body: [{ component: 'p', children: ['API body'] }] };
const pager = { PageIndex: 0, PageSize: 25, ShowingFirstRowIndex: 1, ShowingLastRowIndex: 1,
  TotalPageCount: 1, TotalRecord: 1, ViewingRecord: 1, Rows: [post] };
const status = (expected: number) => (error: unknown) => error instanceof Response && error.status === expected;

test('parses safe paging and post identities', () => {
  for (const query of ['', 'pageIndex=-1&pageSize=0', 'pageIndex=x&pageSize=1.5', 'pageIndex=1e20&pageSize=Infinity']) {
    assert.deepEqual(parsePage(new URLSearchParams(query)), { PageIndex: 0, PageSize: 25 });
  }
  assert.deepEqual(parsePage(new URLSearchParams('pageIndex=2&pageSize=10')), { PageIndex: 2, PageSize: 10 });
  assert.equal(parsePostId('0'), 'latest');
  assert.equal(parsePostId(post.id), post.id);
  assert.throws(() => parsePostId('bad'), status(404));
});

test('real HTTP API contract and proxy preserve paths, bodies and errors', async (t) => {
  let code = 200;
  let payload: unknown = pager;
  let raw: string | undefined;
  let seen = { url: '', method: '', body: '', secret: undefined as string | undefined };
  const server = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    seen = { url: req.url!, method: req.method!, body: Buffer.concat(chunks).toString(), secret: req.headers['x-hop'] as string | undefined };
    res.writeHead(code, { 'content-type': raw ? 'text/xml' : 'application/json', connection: 'close' });
    res.end(raw ?? JSON.stringify(payload));
  }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const previous = process.env.API_URL;
  process.env.API_URL = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  t.after(() => { if (previous === undefined) delete process.env.API_URL; else process.env.API_URL = previous; server.closeAllConnections(); server.close(); });
  assert.equal((await getPosts({ PageIndex: 0, PageSize: 25 })).Rows![0].title, 'API title');
  assert.equal(seen.url, '/BlogPosts?pageIndex=0&pageSize=25');
  payload = { MessageType: 1, Result: post };
  assert.equal((await getPostById('latest')).body![0].component, 'p');
  payload = { ...pager, Rows: [], TotalRecord: 0, TotalPageCount: 0, ViewingRecord: 0 };
  assert.deepEqual((await getPosts({ PageIndex: 0, PageSize: 25 })).Rows, []);
  payload = {};
  await assert.rejects(getPosts({ PageIndex: 0, PageSize: 25 }), status(502));
  payload = { MessageType: 0 };
  await assert.rejects(getPostById('latest'), status(404));
  code = 404;
  await assert.rejects(getPostById(post.id), status(404));
  code = 500;
  await assert.rejects(getPosts({ PageIndex: 0, PageSize: 25 }), status(502));
  code = 200; raw = 'not json';
  await assert.rejects(getPosts({ PageIndex: 0, PageSize: 25 }), status(502));
  raw = '<feed>missing</feed>'; code = 404;
  const response = await forwardApi(new Request('http://site/api/BlogPosts/feed?x=1&url=https://evil.test', { headers: { connection: 'x-hop', 'x-hop': 'secret' } }));
  assert.equal(response.status, 404);
  assert.equal(response.headers.get('content-type'), 'text/xml');
  assert.equal(await response.text(), '<feed>missing</feed>');
  assert.equal(seen.url, '/BlogPosts/feed?x=1&url=https://evil.test');
  assert.equal(seen.secret, undefined);
  assert.equal(response.headers.get('connection'), null);
  code = 503; raw = undefined; payload = { error: 'offline' };
  const unavailable = await forwardApi(new Request('http://site/api/BlogPosts'));
  assert.equal(unavailable.status, 503);
  assert.deepEqual(await unavailable.json(), { error: 'offline' });
  code = 200;
  await forwardApi(new Request('http://site/api/echo', { method: 'POST', body: 'hello' }));
  assert.equal(seen.method, 'POST'); assert.equal(seen.body, 'hello');
  const head = await forwardApi(new Request('http://site/api/echo', { method: 'HEAD' }));
  assert.equal(await head.text(), '');
  await assert.rejects(fetchApi('https://evil.test'), status(502));
  const controller = new AbortController(); controller.abort();
  await assert.rejects(fetchApi('/BlogPosts', { signal: controller.signal }));
  process.env.API_URL = 'file:///etc/passwd';
  assert.throws(() => getApiBaseUrl(), status(502));
});
