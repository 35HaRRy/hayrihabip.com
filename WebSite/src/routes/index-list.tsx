import React, { Suspense } from 'react';
import { Await, useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { getPosts } from '../services/blog.server';
import { parsePage } from '../services/blogParams';
import { BlogListPage } from '../pages/BlogListPage';
import { ColdStartLoading } from '../components/ColdStartLoading';
import { ContentError } from '../components/ContentError';

const STREAM_AFTER_MS = 2_000;

export async function loader({ request }: LoaderFunctionArgs) {
  const pager = getPosts(parsePage(new URL(request.url).searchParams), request.signal);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const slow = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), STREAM_AFTER_MS);
  });
  // A cold API start means the request is still pending after 2s: hand the
  // promise to the route so the shell streams with the loading fallback.
  const fast = await Promise.race([pager, slow]);
  clearTimeout(timer);
  return { pager: fast ?? pager };
}

export default function ListRoute() {
  const { pager } = useLoaderData<typeof loader>();
  if (!(pager instanceof Promise)) return <BlogListPage pager={pager} />;
  return (
    <Suspense fallback={<ColdStartLoading />}>
      <Await resolve={pager} errorElement={<ContentError />}>
        {(resolved) => <BlogListPage pager={resolved} />}
      </Await>
    </Suspense>
  );
}
