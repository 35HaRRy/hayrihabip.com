import React from 'react';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

export const Footer: React.FC = () => {
  const { currentTheme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="font-bold text-slate-900 tracking-tight">
              Hayri HABİP
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Çizikli küçük kutucuklar peşinde... Yazılımın her aşamasına meraklı bir yazılım mühendisi.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600">
            <Link to="/index" className="hover:text-slate-900 transition-colors">
              Anasayfa
            </Link>
            <Link to="/blog-post/latest" className="hover:text-slate-900 transition-colors">
              Son Yazı
            </Link>
            <Link to="/about" className="hover:text-slate-900 transition-colors">
              Hakkımda
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-500">
              <a
                href="https://github.com/35HaRRy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="GitHub"
                aria-label="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} className="text-sm" />
              </a>
              <a
                href="https://www.linkedin.com/in/hayri-habip/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedin} className="text-sm" />
              </a>
              <a
                href="https://twitter.com/35_HaRRy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Twitter"
                aria-label="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-sm" />
              </a>
              <a
                href="https://www.instagram.com/hayrihabip/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Instagram"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-sm" />
              </a>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title="Yukarı Çık"
              aria-label="Sayfanın başına dön"
            >
              <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Hayri HABİP · Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};
