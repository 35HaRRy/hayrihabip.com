import React from 'react';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

export const AuthorHero: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <section className="mb-12 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Profile Avatar */}
        <div className="relative shrink-0">
          <img
            src="/assets/images/profile.jpg"
            alt="Hayri Habip"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-sm border-2 border-white ring-1 ring-slate-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/profile.png';
            }}
          />
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white"
            style={{ backgroundColor: currentTheme.color }}
            title="Aktif blog"
          >
            ✓
          </div>
        </div>

        {/* Info & Bio */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Hayri HABİP
              </h1>
              <p className="text-xs sm:text-sm font-mono text-slate-500 mt-0.5">
                Software Engineer · Fullstack & AI Development
              </p>
            </div>

            {/* Social quick links */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500">
              <a
                href="https://github.com/35HaRRy"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} className="text-sm" />
              </a>
              <a
                href="https://www.linkedin.com/in/hayri-habip/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedin} className="text-sm" />
              </a>
              <a
                href="https://twitter.com/35_HaRRy"
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-sm" />
              </a>
              <a
                href="https://www.instagram.com/hayrihabip/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-sm" />
              </a>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mt-3">
            Yazılımın her aşamasına meraklıyım. Herhangi bir soruna yazılımlar ile çözüm bulmaktan keyif alıyorum.
            Çizikli küçük kutucuklar peşinde, mimari deneyimlerimi ve öğrendiklerimi paylaşıyorum.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs text-slate-500 font-mono">
            <span>.NET</span>
            <span aria-hidden="true">·</span>
            <span>Angular</span>
            <span aria-hidden="true">·</span>
            <span>React</span>
            <span aria-hidden="true">·</span>
            <span>LLM</span>
            <span aria-hidden="true">·</span>
            <span>RAG</span>
            <span aria-hidden="true">·</span>
            <span>GenAI</span>
            <span aria-hidden="true">·</span>
            <Link
              to="/about"
              className="inline-flex items-center gap-1 font-sans font-semibold transition-colors hover:underline"
              style={{ color: currentTheme.color }}
            >
              <span>Benim hakkımda daha fazlası</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
