import React from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Loading } from './components/Loading';

export const App: React.FC = () => {
  const navigation = useNavigation();
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Header />
        <main className="flex-1">
          {navigation.state !== 'idle' && <Loading message="Yükleniyor..." />}
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};
