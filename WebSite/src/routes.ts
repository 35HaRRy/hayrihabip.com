import { type RouteConfig, route, index } from '@react-router/dev/routes';
export default [
  index('routes/redirect.tsx'),
  route('index', 'routes/index-list.tsx'),
  route('blog-list', 'routes/blog-list.tsx'),
  route('blog-post', 'routes/redirect.tsx', { id: 'post-shortcut' }),
  route('blog-post/:id', 'routes/post.tsx'),
  route('about', 'routes/about.tsx'),
  route('api/*', 'routes/api.tsx'),
  route('*', 'routes/redirect.tsx', { id: 'fallback' }),
] satisfies RouteConfig;
