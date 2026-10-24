import React from 'react';
import { Link } from 'react-router';
import { BlogPost } from '../types/blog';
import { BlogPostInfo } from '../components/BlogPostInfo';
import { BlogPostItemRenderer } from '../components/BlogPostItemRenderer';
import { BlogNavigator } from '../components/BlogNavigator';
import { DisqusThread } from '../components/DisqusThread';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

export const BlogPostPage: React.FC<{ post: BlogPost }> = ({ post }) => {
  const { currentTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Back to Blog List Navigation */}
      <div className="mb-6">
        <Link
          to="/index"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" />
          <span>Tüm Yazılar</span>
        </Link>
      </div>

      <article className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 md:p-12 shadow-xs">
        {/* Article Header */}
        <header className="pb-8 border-b border-slate-100">
          <BlogPostInfo data={post.info} className="mb-3" />

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {post.title}
          </h1>

          {/* Author Badge */}
          <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100">
            <img
              src="/assets/images/profile.jpg"
              alt="Hayri Habip"
              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/profile.png';
              }}
            />
            <div className="text-xs">
              <div className="font-bold text-slate-900">Hayri HABİP</div>
              <div className="text-slate-500 font-mono">Software Engineer</div>
            </div>
          </div>
        </header>

        {/* Structured JSON Body Renderer (Preserved view and structure) */}
        <div className="blog-post-body mt-8">
          <BlogPostItemRenderer data={post.body} />
        </div>

        {/* Post Previous/Next Navigator */}
        <BlogNavigator navigator={post.navigator} isForList={false} />

        {/* Comments Section */}
        <div className="mt-12 pt-8 border-t border-slate-200" id="comments">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Yorumlar</h3>
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-6">
            <DisqusThread key={post.id} identifier={post.id} title={post.title} />
            <noscript>
              Please enable JavaScript to view the{' '}
              <a href="https://disqus.com/?ref_noscript" rel="nofollow">
                comments powered by Disqus.
              </a>
            </noscript>
          </div>
        </div>
      </article>
    </div>
  );
};
