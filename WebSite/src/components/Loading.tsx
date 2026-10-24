import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface LoadingProps {
  message?: string;
  minHeight?: number;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Yükleniyor...',
  minHeight = 240,
}) => {
  const { currentTheme } = useTheme();

  return (
    <div
      className="flex flex-col items-center justify-center p-8"
      style={{ minHeight: `${minHeight}px` }}
    >
      <div
        className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-transparent animate-spin mb-3"
        style={{ borderTopColor: currentTheme.color }}
      />
      <div className="text-xs font-mono text-slate-500">{message}</div>
    </div>
  );
};
