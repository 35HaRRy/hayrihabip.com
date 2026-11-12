import React from 'react';
import { Link } from 'react-router';

export const ContentError: React.FC<{ missing?: boolean }> = ({ missing = false }) => (
  <div className="max-w-2xl mx-auto px-4 py-20 text-center" role="alert">
    <h1 className="text-2xl font-bold mb-4">{missing ? 'Yazı Bulunamadı' : 'İçerik yüklenemedi'}</h1>
    <p className="mb-6">{missing ? 'Aradığınız yazı mevcut değil.' : 'Lütfen daha sonra tekrar deneyin.'}</p>
    <Link to="/index" className="underline">Tüm Yazılara Dön</Link>
  </div>
);
