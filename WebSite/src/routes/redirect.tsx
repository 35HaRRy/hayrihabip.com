import { redirect, type LoaderFunctionArgs } from 'react-router';
export function loader({ request }: LoaderFunctionArgs) {
  return redirect(new URL(request.url).pathname === '/blog-post' ? '/blog-post/latest' : '/index');
}
