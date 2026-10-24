import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { startFixture } from './fixture-api.mjs';

test('runtime configuration exposes SSR commands and preserves API debug', async () => {
  const json = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
  const pkg = await json('../package.json');
  for (const name of ['dev:ssr', 'build:ssr', 'serve:ssr']) assert.ok(pkg.scripts[name]);
  const vercel = await json('../vercel.json');
  assert.equal(vercel.rewrites?.some((rule) => rule.destination === '/' || rule.destination.includes('api.hayrihabip.com')) ?? false, false);
  const launch = await json('../../.vscode/launch.json');
  assert.ok(launch.configurations.some((item) => item.name === 'API: Debug' && item.env.ASPNETCORE_URLS === 'http://localhost:5050'));
  assert.ok(launch.configurations.some((item) => item.name === 'WebSite: SSR Debug'));
  assert.ok(launch.compounds.some((item) => item.name === 'WebSite + API: Debug'));
});

test('production SSR and proxy preserve data, routes and failure statuses', { timeout: 45_000 }, async (t) => {
  const fixture = await startFixture();
  t.after(fixture.close);
  const socket = createServer().listen(0, '127.0.0.1');
  await once(socket, 'listening');
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  const child = spawn(process.execPath, ['node_modules/@react-router/serve/bin.js', 'build/server/index.js'], {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    env: { ...process.env, API_URL: fixture.url, PORT: String(port), HOST: '127.0.0.1', NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (data) => { output += data; });
  child.stderr.on('data', (data) => { output += data; });
  t.after(async () => { if (child.exitCode === null) { child.kill(); await once(child, 'exit'); } });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) assert.fail(`Server exited: ${output}`);
    try { if ((await fetch(`${base}/about`)).ok) break; } catch { /* Wait for startup only. */ }
    if (i === 99) assert.fail(`Server not ready: ${output}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const get = (path, init) => fetch(base + path, init);
  assert.equal(fixture.state.calls.length, 0, 'about must not call API');
  if (process.env.SMOKE_MUTATION) fixture.state.title = 'Wrong fixture payload';
  let response = await get('/index');
  assert.equal(response.status, 200);
  assert.match(await response.text(), /SSR fixture title/);
  fixture.state.title = 'Updated fixture title';
  assert.match(await (await get('/index')).text(), /Updated fixture title/);
  response = await get('/blog-post/latest');
  const html = await response.text();
  assert.equal(response.status, 200); assert.match(html, /SSR fixture body/);
  assert.match(html, /<title>Updated fixture title · Hayri HABİP<\/title>/);
  assert.match(html, /data-icon="github"/);
  assert.match(await (await get('/blog-list?pageIndex=1&pageSize=10')).text(), /pageIndex=0&amp;pageSize=10/);
  for (const [path, destination] of [['/', '/index'], ['/blog-post', '/blog-post/latest'], ['/unknown', '/index']]) {
    response = await get(path, { redirect: 'manual' });
    assert.equal(response.status, 302); assert.equal(response.headers.get('location'), destination);
  }
  const calls = fixture.state.calls.length;
  assert.equal((await get('/blog-post/bad')).status, 404);
  assert.equal(fixture.state.calls.length, calls);
  assert.equal((await get('/blog-post/0')).status, 200);
  fixture.state.mode = 'missing';
  assert.equal((await get('/blog-post/latest')).status, 404);
  fixture.state.mode = 'empty';
  response = await get('/index'); assert.equal(response.status, 200);
  assert.match(await response.text(), /Henüz yayınlanmış yazı bulunmuyor/);
  for (const mode of ['error', 'malformed']) {
    fixture.state.mode = mode;
    response = await get('/index'); assert.equal(response.status, 502);
    assert.match(await response.text(), /İçerik yüklenemedi/);
  }
  fixture.state.mode = 'slow';
  assert.equal((await get('/index')).status, 504);
  fixture.state.mode = 'ok';
  response = await get('/api/BlogPosts/feed?x=1');
  assert.match(response.headers.get('content-type'), /^text\/xml(?:; charset=utf-8)?$/);
  assert.equal(await response.text(), '<feed>fixture</feed>');
  assert.equal(fixture.state.calls.at(-1).path, '/BlogPosts/feed?x=1');
  assert.equal((await get('/api/missing')).status, 404);
  response = await get('/api/echo', { method: 'POST', body: 'echo body' });
  assert.deepEqual(await response.json(), { path: '/echo', method: 'POST', body: 'echo body' });
  assert.equal(await (await get('/api/echo', { method: 'HEAD' })).text(), '');
  fixture.state.mode = 'error';
  response = await get('/api/BlogPosts');
  assert.equal(response.status, 503); assert.deepEqual(await response.json(), { error: 'offline' });
  fixture.state.mode = 'ok';
  for (const path of ['/favicon.ico', '/robots933456.txt', '/zohoverify/verifyforzoho.html', '/assets/images/blog/Angular%26SSR%26AWS.jpeg']) {
    assert.equal((await get(path)).status, 200, path);
  }
});
