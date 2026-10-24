import React from 'react';
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { BlogListPage } from '../src/pages/BlogListPage';
import { BlogPostPage } from '../src/pages/BlogPostPage';
import { ThemeProvider } from '../src/context/ThemeContext';
import type { BlogPost, Pager } from '../src/types/blog';

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
