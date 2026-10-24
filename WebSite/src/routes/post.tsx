import React from 'react';
import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from 'react-router';
import { getPostById } from '../services/blog.server';
import { BlogPostPage } from '../pages/BlogPostPage';
export async function loader({ request, params }: LoaderFunctionArgs) {
  return { post: await getPostById(params.id ?? 'latest', request.signal) };
}
export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data ? `${data.post.title} · Hayri HABİP` : 'Yazı · Hayri HABİP' },
  { name: 'description', content: data?.post.intro ?? '' },
  { property: 'og:title', content: data?.post.title ?? 'Hayri HABİP' },
  { property: 'og:description', content: data?.post.intro ?? '' },
];
export default function PostRoute() { return <BlogPostPage post={useLoaderData<typeof loader>().post} />; }
