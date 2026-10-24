import type { Page } from '../types/blog';

export function parsePage(search: URLSearchParams): Page {
  const integer = (name: string, fallback: number, min: number) => {
    const raw = search.get(name);
    const value = raw?.trim() ? Number(raw) : NaN;
    return Number.isSafeInteger(value) && value >= min && value <= 2147483647 ? value : fallback;
  };
  const page = { PageIndex: integer('pageIndex', 0, 0), PageSize: integer('pageSize', 25, 1) };
  if (page.PageIndex * page.PageSize > 2147483647) page.PageIndex = 0;
  return page;
}

export function parsePostId(value: string): string {
  if (value === '0' || value === 'latest') return 'latest';
  if (/^[a-f\d]{24}$/i.test(value)) return value;
  throw new Response('Yazı bulunamadı.', { status: 404 });
}
