
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: false,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "redirectTo": "/index",
    "route": "/"
  },
  {
    "renderMode": 0,
    "route": "/index"
  },
  {
    "renderMode": 0,
    "route": "/blog-list"
  },
  {
    "renderMode": 0,
    "route": "/blog-post/*"
  },
  {
    "renderMode": 0,
    "route": "/about"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 813, hash: '978ea9a1da10a014655403048359ae4a5f2804b09f91e005dd3f0a1297ae460d', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1353, hash: 'f4e0aa901d6408c5ecfcb19e31bd3389074eaee99b9b9d99345b8c94dbf921b8', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
