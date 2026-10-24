import React from 'react';
import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { getPosts } from '../services/blog.server';
import { parsePage } from '../services/blogParams';
import { BlogListPage } from '../pages/BlogListPage';
export async function loader({ request }: LoaderFunctionArgs) {
  return { pager: await getPosts(parsePage(new URL(request.url).searchParams), request.signal) };
}
export default function ListRoute() { return <BlogListPage pager={useLoaderData<typeof loader>().pager} />; }
