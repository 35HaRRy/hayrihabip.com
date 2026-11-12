import React from 'react';
import { Links, Meta, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError } from 'react-router';
import { App } from './App';
import { ContentError } from './components/ContentError';
import './index.css';
import 'highlight.js/styles/github.css';

export const meta = () => [
  { title: 'Hayri HABİP · Software Engineer' },
  { name: 'description', content: 'Hayri HABİP, çizikli küçük kutucuklar peşinde... Yazılımın her aşamasına meraklı bir yazılım mühendisinin kişisel blogu.' },
  { name: 'author', content: 'Hayri HABİP' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="tr"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta /><link rel="icon" href="/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <Links /></head><body className="bg-slate-50 text-slate-800 antialiased selection:bg-teal-500/20 selection:text-teal-900 min-h-screen">
    {children}<ScrollRestoration /><Scripts /></body></html>;
}

export default App;

export function ErrorBoundary() {
  const error = useRouteError();
  return <ContentError missing={isRouteErrorResponse(error) && error.status === 404} />;
}
