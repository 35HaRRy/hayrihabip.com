import React from 'react';
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { BlogListPage } from '../src/pages/BlogListPage';
import { BlogPostPage } from '../src/pages/BlogPostPage';
import { ThemeProvider } from '../src/context/ThemeContext';
import type { BlogPost, Pager } from '../src/types/blog';
import { BlogPostItemRenderer } from '../src/components/BlogPostItemRenderer';
import hljs from 'highlight.js';

const post: BlogPost = { id: '0123456789abcdef01234567', title: 'SSR fixture title', intro: 'Fixture intro', imageName: 'a.jpg',
  info: { regDate: '2026-01-01', publishDate: 'yesterday', readMin: '5 min', commentCount: 0 },
  navigator: {}, body: [{ component: 'p', children: ['SSR fixture body'] }] };
const pager: Pager<BlogPost> = { PageIndex: 0, PageSize: 25, ShowingFirstRowIndex: 1, ShowingLastRowIndex: 1,
  TotalPageCount: 2, TotalRecord: 26, ViewingRecord: 1, Rows: [post] };
const render = (element: React.ReactNode, path = '/index') => renderToStaticMarkup(
  <MemoryRouter initialEntries={[path]}><ThemeProvider>{element}</ThemeProvider></MemoryRouter>);

test('list renders API data on server and preserves blog-list paging URL', () => {
  const html = render(<BlogListPage pager={pager} />, '/blog-list');
  assert.match(html, /SSR fixture title/);
  assert.match(html, /href="\/blog-list\?pageIndex=1&amp;pageSize=25"/);
});
test('list introduces four projects with previews and accessible external links before posts', () => {
  const html = render(<BlogListPage pager={pager} />);
  const section = html.match(/<section[^>]*aria-labelledby="projects-title"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, 'Project showcase is rendered on the list page');
  assert.equal((section.match(/<article\b/g) ?? []).length, 4);
  assert.equal((section.match(/<img\b/g) ?? []).length, 2);
  assert.match(section, /data-icon="podcast"/);
  assert.match(section, /data-icon="brain"/);
  for (const url of [
    'https://github.com/35HaRRy/aisomedo', 'http://aisomedo.hayrihabip.com/',
    'https://github.com/35HaRRy/odi-bid-battle', 'https://odibb.hayrihabip.com/',
    'https://github.com/35HaRRy/hayrihabip.com/blob/main/API/Controllers/PodcastsController.cs',
    'https://api.hayrihabip.com/podcasts',
    'https://github.com/35HaRRy/hayrihabip.com/tree/main/AI', 'http://ai.hayrihabip.com/',
  ]) {
    const anchor = section.match(new RegExp(`<a\\b[^>]*href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`))?.[0];
    assert.ok(anchor, `Link exists: ${url}`);
    assert.match(anchor, /target="_blank"/);
    assert.match(anchor, /rel="noopener noreferrer"/);
    assert.match(anchor, /aria-label="[^"]+"/);
  }
  assert.ok(html.indexOf('id="projects-title"') < html.indexOf('Son Yazılar'));
});
test('post renders title and body without browser globals', () => {
  const html = render(<BlogPostPage post={post} />);
  assert.match(html, /SSR fixture title/);
  assert.match(html, /SSR fixture body/);
  // Disqus cannot parse Tailwind v4 oklch() colors; keep explicit rgb-compatible values.
  assert.match(html, /id="disqus_thread"[^>]*style="color:#1e293b;background-color:#f8fafc"/);
});
test('post navigator shows neighbouring post titles instead of generic text', () => {
  const html = render(<BlogPostPage post={{ ...post, navigator: {
    previousPostId: '1123456789abcdef01234567', previousPostTitle: 'Previous fixture title',
    nextPostId: '2123456789abcdef01234567', nextPostTitle: 'Next fixture title' } }} />);
  assert.match(html, /Previous fixture title/);
  assert.match(html, /Next fixture title/);
  assert.doesNotMatch(html, /blog gönderisini oku/);
});

test('archive content renders icons, nested text, tables, media and escaped code', () => {
  const html = render(<BlogPostItemRenderer data={[
    { component: 'figure', children: [{ component: 'img', attributes: { src: 'assets/a.jpg', alt: 'Photo' } }, { component: 'figcaption', children: ['Caption'] }] },
    { component: 'a', attributes: { href: 'https://example.com', target: '_blank' }, children: [{ component: 'icon', attributes: { icon: ['fab', 'github'] } }, 'Repository'] },
    { component: 'table', attributes: { rows: [{ Name: 'Cell text' }] } },
    { component: 'code', children: ['<script>alert(1)</script>'] },
    { component: 'video', attributes: { src: 'https://www.youtube.com/embed/test' } },
    { component: 'tweet', attributes: { tweetId: '1234' } },
  ]} />);
  assert.match(html, /data-icon="github"/);
  assert.match(html, /Cell text/); assert.match(html, /Caption/);
  assert.match(html, /youtube.com\/embed\/test/); assert.match(html, /twitter.com\/i\/status\/1234/);
  assert.doesNotMatch(html, /<script>alert/);
});

test('dangerous content URLs and failed highlighting never create executable markup', (t) => {
  t.mock.method(hljs, 'highlightAuto', () => { throw new Error('Highlight failed'); });
  const html = render(<BlogPostItemRenderer data={[
    { component: 'code', children: ['<script>alert(1)</script>'] },
    { component: 'a', attributes: { href: 'javascript:alert(1)' }, children: ['Unsafe'] },
    { component: 'video', attributes: { src: 'data:text/html,<script>alert(1)</script>' } },
    { component: 'img', attributes: { src: 'javascript:alert(1)' } },
  ]} />);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>|javascript:|data:text\/html/);
});
