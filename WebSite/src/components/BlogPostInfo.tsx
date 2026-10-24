import React from 'react';
import { BlogPostInfo as BlogPostInfoType } from '../types/blog';

interface Props {
  data: BlogPostInfoType;
  className?: string;
}

export const BlogPostInfo: React.FC<Props> = ({ data, className = '' }) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono ${className}`}>
      <span>Yayınlanma: {data.publishDate}</span>
      <span aria-hidden="true" className="text-slate-300">·</span>
      <span className="tabular-nums">{data.readMin} okuma</span>
      <span aria-hidden="true" className="text-slate-300">·</span>
      <span className="tabular-nums">{data.commentCount} yorum</span>
    </div>
  );
};
