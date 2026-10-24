import React from 'react';
import { Link, useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Pager, PostNavigator } from '../types/blog';
import { useTheme } from '../context/ThemeContext';

interface Props {
  isForList?: boolean;
  pager?: Pager<any>;
  navigator?: PostNavigator;
}

export const BlogNavigator: React.FC<Props> = ({ isForList, pager, navigator }) => {
  const { currentTheme } = useTheme();
  const { pathname } = useLocation();
  const listPath = pathname === '/blog-list' ? '/blog-list' : '/index';

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isForList && pager) {
    const hasPrev = pager.PageIndex > 0;
    const hasNext = pager.PageIndex + 1 < pager.TotalPageCount;

    if (!hasPrev && !hasNext) return null;

    return (
      <nav className="flex items-center justify-between gap-4 my-8 pt-6 border-t border-slate-200">
        {hasPrev ? (
          <Link
            to={`${listPath}?pageIndex=${pager.PageIndex - 1}&pageSize=${pager.PageSize}`}
            onClick={scrollTop}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            <span>Önceki Sayfa</span>
          </Link>
        ) : (
          <div />
        )}

        <div className="text-xs font-mono text-slate-500 tabular-nums">
          Sayfa {pager.PageIndex + 1} / {pager.TotalPageCount || 1}
        </div>

        {hasNext ? (
          <Link
            to={`${listPath}?pageIndex=${pager.PageIndex + 1}&pageSize=${pager.PageSize}`}
            onClick={scrollTop}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
          >
            <span>Sonraki Sayfa</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    );
  }

  if (!isForList && navigator) {
    const hasPrev = Boolean(navigator.previousPostId);
    const hasNext = Boolean(navigator.nextPostId);

    if (!hasPrev && !hasNext) return null;

    return (
      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 pt-8 border-t border-slate-200">
        {hasPrev ? (
          <Link
            to={`/blog-post/${navigator.previousPostId}`}
            onClick={scrollTop}
            className="group flex flex-col p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all text-left"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-[10px] transition-transform group-hover:-translate-x-1"
                style={{ color: currentTheme.color }}
              />
              <span>Önceki Yazı</span>
            </div>
            <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-950 transition-colors line-clamp-1">
              {navigator.previousPostTitle ?? 'Önceki blog gönderisini oku'}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {hasNext ? (
          <Link
            to={`/blog-post/${navigator.nextPostId}`}
            onClick={scrollTop}
            className="group flex flex-col p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all text-right sm:col-start-2"
          >
            <div className="flex items-center justify-end gap-2 text-xs font-mono text-slate-500 mb-1">
              <span>Sonraki Yazı</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-[10px] transition-transform group-hover:translate-x-1"
                style={{ color: currentTheme.color }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-950 transition-colors line-clamp-1">
              {navigator.nextPostTitle ?? 'Sonraki blog gönderisini oku'}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    );
  }

  return null;
};
