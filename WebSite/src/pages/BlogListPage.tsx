import React from 'react';
import { BlogPost, Pager } from '../types/blog';
import { BlogListItem } from '../components/BlogListItem';
import { BlogNavigator } from '../components/BlogNavigator';
import { AuthorHero } from '../components/AuthorHero';
import { ProjectsSection } from '../components/ProjectsSection';

export const BlogListPage: React.FC<{ pager: Pager<BlogPost> }> = ({ pager }) => {
  const posts = pager.Rows ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Software Engineer Author Hero */}
      <AuthorHero />
      <ProjectsSection />

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Son Yazılar
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Teknik notlar, mimari kararlar ve yazılım deneyimleri
          </p>
        </div>

        {pager && (
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            {pager.TotalRecord} gönderi
          </span>
        )}
      </div>

      {/* Blog Posts List */}
      {(
        <>
          {posts && posts.length > 0 ? (
            <div className="space-y-5">
              {posts.map((post) => (
                <BlogListItem key={post.id} data={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
              <p className="text-slate-600 font-medium">Henüz yayınlanmış yazı bulunmuyor.</p>
              <p className="text-xs text-slate-400 mt-1">Lütfen daha sonra tekrar kontrol edin.</p>
            </div>
          )}

          {pager && <BlogNavigator pager={pager} isForList={true} />}
        </>
      )}
    </div>
  );
};
