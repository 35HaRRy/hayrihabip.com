const hopHeaders = ['connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization',
  'te', 'trailer', 'transfer-encoding', 'upgrade', 'host', 'content-length'];

function cleanHeaders(input: HeadersInit): Headers {
  const headers = new Headers(input);
  const connection = headers.get('connection')?.split(',').map((name) => name.trim()) ?? [];
  for (const name of [...hopHeaders, ...connection]) if (name) headers.delete(name);
  return headers;
}

export function getApiBaseUrl(): URL {
  try {
    const url = new URL(process.env.API_URL || 'http://localhost:5050');
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Invalid API_URL');
    url.pathname = `${url.pathname.replace(/\/+$/, '')}/`;
    return url;
  } catch {
    throw new Response('API yapılandırması geçersiz.', { status: 502 });
  }
}

export async function fetchApi(path: string, init: RequestInit = {}): Promise<Response> {
  const base = getApiBaseUrl();
  // Never resolve caller-supplied absolute URLs or traversal outside the configured API root.
  if (!path.startsWith('/') || path.startsWith('//') || /\\|(?:^|\/)\.{1,2}(?:\/|\?|$)|%2e|%2f|%5c/i.test(path.split('?')[0])) {
    throw new Response('Geçersiz API yolu.', { status: 502 });
  }
  const timeout = AbortSignal.timeout(10_000);
  try {
    return await fetch(new URL(path.slice(1), base), {
      ...init, redirect: 'manual',
      signal: init.signal ? AbortSignal.any([init.signal, timeout]) : timeout,
    });
  } catch (error) {
    if (init.signal?.aborted) throw error;
    throw new Response('API şu anda erişilebilir değil.', { status: timeout.aborted ? 504 : 502 });
  }
}

export async function forwardApi(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api(?:\/|$)/, '/');
  try {
    const headers = cleanHeaders(request.headers);
    headers.set('accept-encoding', 'identity');
    const init: RequestInit & { duplex?: 'half' } = { method: request.method, headers, signal: request.signal };
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.body) {
      init.body = request.body; init.duplex = 'half';
    }
    const upstream = await fetchApi(path + url.search, init);
    const responseHeaders = cleanHeaders(upstream.headers);
    responseHeaders.delete('content-encoding'); // fetch transparently decompresses responses.
    return new Response(request.method === 'HEAD' ? null : upstream.body, {
      status: upstream.status, statusText: upstream.statusText, headers: responseHeaders,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    if (request.signal.aborted) throw error;
    return new Response('API yanıtı alınamadı.', { status: 502 });
  }
}
