import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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
