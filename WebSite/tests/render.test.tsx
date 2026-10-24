import React from 'react';
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
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
test('post renders title and body without browser globals', () => {
  const html = render(<BlogPostPage post={post} />);
  assert.match(html, /SSR fixture title/);
  assert.match(html, /SSR fixture body/);
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
