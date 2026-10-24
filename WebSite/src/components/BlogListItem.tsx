import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types/blog';
import { BlogPostInfo } from './BlogPostInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

interface Props {
  data: BlogPost;
}

export const BlogListItem: React.FC<Props> = ({ data }) => {
  const { currentTheme } = useTheme();
  const imgSrc = data.imageName?.startsWith('/')
    ? data.imageName
    : `/assets/images/blog/${data.imageName}`;

  return (
    <article className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Post Thumbnail */}
        <Link
          to={`/blog-post/${data.id}`}
          className="w-full sm:w-48 sm:h-32 h-44 rounded-xl overflow-hidden bg-slate-100 shrink-0 block relative"
        >
          <img
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={imgSrc}
            alt={data.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/blog/blog-post-thumb-1.jpg';
            }}
          />
        </Link>

        {/* Post Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <BlogPostInfo data={data.info} className="mb-2" />

            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
              <Link to={`/blog-post/${data.id}`} className="hover:underline">
                {data.title}
              </Link>
            </h2>

            <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {data.intro}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              to={`/blog-post/${data.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors"
              style={{ color: currentTheme.color }}
            >
              <span>Yazıyı Oku</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-[10px] transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
