import React from 'react';
import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from 'react-router';
import { getPostById } from '../services/blog.server';
import { BlogPostPage } from '../pages/BlogPostPage';
export async function loader({ request, params }: LoaderFunctionArgs) {
  return { post: await getPostById(params.id ?? 'latest', request.signal) };
}
export const meta: MetaFunction<typeof loader> = ({ loaderData }) => [
  { title: loaderData ? `${loaderData.post.title} · Hayri HABİP` : 'Yazı · Hayri HABİP' },
  { name: 'description', content: loaderData?.post.intro ?? '' },
  { property: 'og:title', content: loaderData?.post.title ?? 'Hayri HABİP' },
  { property: 'og:description', content: loaderData?.post.intro ?? '' },
];
export default function PostRoute() { return <BlogPostPage post={useLoaderData<typeof loader>().post} />; }
