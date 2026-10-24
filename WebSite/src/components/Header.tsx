import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faPalette, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useTheme } from '../context/ThemeContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const { currentTheme, setTheme, themes } = useTheme();

  const isHomeActive = path === '/' || path.startsWith('/index') || path.startsWith('/blog-list');
  const isPostActive = path.startsWith('/blog-post');
  const isAboutActive = path.startsWith('/about');

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand / Wordmark */}
          <Link
            to="/index"
            className="flex items-center gap-2.5 text-slate-900 group whitespace-nowrap shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-mono font-bold shadow-xs transition-transform duration-200 group-hover:scale-105"
              style={{ backgroundColor: currentTheme.color }}
            >
              <FontAwesomeIcon icon={faTerminal} className="text-xs" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                Hayri HABİP
              </span>
              <span className="text-[11px] font-mono text-slate-500 tracking-wider">
                software engineer
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link
              to="/index"
              className={`transition-colors whitespace-nowrap py-1 relative ${
                isHomeActive
                  ? 'text-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Anasayfa
              {isHomeActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: currentTheme.color }}
                />
              )}
            </Link>

            <Link
              to="/blog-post/latest"
              className={`transition-colors whitespace-nowrap py-1 relative ${
                isPostActive
                  ? 'text-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Son Yazı
              {isPostActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: currentTheme.color }}
                />
              )}
            </Link>

            <Link
              to="/about"
              className={`transition-colors whitespace-nowrap py-1 relative ${
                isAboutActive
                  ? 'text-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Hakkımda
              {isAboutActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: currentTheme.color }}
                />
              )}
            </Link>
          </nav>

          {/* Zone 3: Social & Theme Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Social Icons */}
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
              <a
                href="https://github.com/35HaRRy"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="GitHub profili"
              >
                <FontAwesomeIcon icon={faGithub} className="text-sm" />
              </a>
              <a
                href="https://www.linkedin.com/in/hayri-habip/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="LinkedIn profili"
              >
                <FontAwesomeIcon icon={faLinkedin} className="text-sm" />
              </a>
              <a
                href="https://twitter.com/35_HaRRy"
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter / X"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Twitter profili"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-sm" />
              </a>
              <a
                href="https://www.instagram.com/hayrihabip/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Instagram profili"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-sm" />
              </a>
            </div>

            <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1" />

            {/* Theme Palette Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPaletteOpen(!paletteOpen)}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                title="Renk Paleti Değiştir"
                aria-label="Renk teması seç"
                aria-expanded={paletteOpen}
                aria-controls="theme-palette"
              >
                <FontAwesomeIcon
                  icon={faPalette}
                  className="text-sm"
                  style={{ color: currentTheme.color }}
                />
              </button>

              {/* Theme Palette Popover */}
              {paletteOpen && (
                <>
                  <div
                    className="fixed inset-0 z-50"
                    onClick={() => setPaletteOpen(false)}
                  />
                  <div id="theme-palette" className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-3 px-3 z-50">
                    <div className="text-xs font-semibold text-slate-700 mb-2 px-1">
                      Vurgu Rengi
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {themes.map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => {
                            setTheme(theme.id);
                            setPaletteOpen(false);
                          }}
                           title={theme.name}
                           aria-label={theme.name}
                           aria-pressed={currentTheme.id === theme.id}
                          className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform hover:scale-105 relative"
                          style={{ backgroundColor: theme.color }}
                        >
                          {currentTheme.id === theme.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="md:hidden w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menüyü aç/kapa"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-md animate-in fade-in duration-150">
          <nav className="flex flex-col space-y-2 text-base font-medium">
            <Link
              to="/index"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                isHomeActive
                  ? 'bg-slate-100 font-semibold text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Anasayfa
            </Link>
            <Link
              to="/blog-post/latest"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                isPostActive
                  ? 'bg-slate-100 font-semibold text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Son Yazı
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                isAboutActive
                  ? 'bg-slate-100 font-semibold text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Hakkımda
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Sosyal Bağlantılar</span>
            <div className="flex items-center gap-3 text-slate-600">
              <a
                href="https://github.com/35HaRRy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a
                href="https://www.linkedin.com/in/hayri-habip/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a
                href="https://twitter.com/35_HaRRy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                href="https://www.instagram.com/hayrihabip/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
