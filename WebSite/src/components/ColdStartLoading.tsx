import React from 'react';

export const ColdStartLoading: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8" style={{ minHeight: 320 }} role="status" aria-live="polite">
    <img
      src="/assets/images/coder.gif"
      alt=""
      width={539}
      height={355}
      className="w-64 h-auto rounded-2xl border border-slate-200 shadow-sm"
    />
    <div className="text-xs font-mono text-slate-500 mt-4">Yazılar yükleniyor...</div>
  </div>
);
