import type { APIResult, BlogPost, BlogPostItem, Page, Pager } from '../types/blog';
import { fetchApi } from './api.server';
import { parsePostId } from './blogParams';

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function bodyItem(value: unknown, depth = 0): value is BlogPostItem | string {
  if (typeof value === 'string') return true;
  return depth < 50 && record(value) && typeof value.component === 'string'
    && (value.attributes == null || record(value.attributes))
    && (value.children == null || (Array.isArray(value.children) && value.children.every((child) => bodyItem(child, depth + 1))));
}

function post(value: unknown): value is BlogPost {
  return record(value) && typeof value.id === 'string' && /^[a-f\d]{24}$/i.test(value.id)
    && ['title', 'intro', 'imageName'].every((key) => typeof value[key] === 'string')
    && record(value.info) && typeof value.info.regDate === 'string'
    && typeof value.info.readMin === 'string' && typeof value.info.commentCount === 'number'
    && (value.info.publishDate == null || typeof value.info.publishDate === 'string')
    && record(value.navigator)
    && ['previousPostId', 'nextPostId'].every((key) => value.navigator![key] == null || typeof value.navigator![key] === 'string')
    && (value.body == null || (Array.isArray(value.body) && value.body.every((item) => bodyItem(item))));
}

async function json(response: Response): Promise<unknown> {
  try { return await response.json(); }
  catch (error) {
    throw new Response('API yanıtı okunamadı.', { status: error instanceof Error && error.name === 'TimeoutError' ? 504 : 502 });
  }
}

export async function getPosts(page: Page, signal?: AbortSignal): Promise<Pager<BlogPost>> {
  const query = new URLSearchParams({ pageIndex: String(page.PageIndex), pageSize: String(page.PageSize) });
  const response = await fetchApi(`/BlogPosts?${query}`, { signal });
  if (!response.ok) throw new Response('Yazılar yüklenemedi.', { status: 502 });
  const data = await json(response);
  const counts = ['PageIndex', 'PageSize', 'ShowingFirstRowIndex', 'ShowingLastRowIndex', 'TotalPageCount', 'TotalRecord', 'ViewingRecord'];
  if (!record(data) || !counts.every((key) => Number.isSafeInteger(data[key]) && Number(data[key]) >= 0)
    || Number(data.PageSize) < 1 || !Array.isArray(data.Rows) || !data.Rows.every(post)) {
    throw new Response('API liste yanıtı geçersiz.', { status: 502 });
  }
  return data as unknown as Pager<BlogPost>;
}

export async function getPostById(id: string, signal?: AbortSignal): Promise<BlogPost> {
  const response = await fetchApi(`/BlogPosts/${parsePostId(id)}`, { signal });
  if (response.status === 404) throw new Response('Yazı bulunamadı.', { status: 404 });
  if (!response.ok) throw new Response('Yazı yüklenemedi.', { status: 502 });
  const data = await json(response);
  if (record(data) && data.MessageType === 0) throw new Response('Yazı bulunamadı.', { status: 404 });
  if (!record(data) || typeof data.MessageType !== 'number' || !post(data.Result)) {
    throw new Response('API yazı yanıtı geçersiz.', { status: 502 });
  }
  return (data as unknown as APIResult<BlogPost>).Result!;
}
