import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faCode, faServer, faCloud, faBrain } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

export const AboutPage: React.FC = () => {
  const { currentTheme } = useTheme();

  useEffect(() => {
    document.title = 'Hakkımda · Hayri HABİP';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <article className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 md:p-12 shadow-xs">
        {/* Header */}
        <header className="pb-8 border-b border-slate-100">
          <div className="text-xs font-mono text-slate-500 mb-2">
            Hakkımda · Biyografi
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Çizikli Küçük Kutucuklar Peşinde...
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Yazılım mühendisliği yolculuğum, teknolojiye bakış açım ve hikayem.
          </p>
        </header>

        {/* Story Section */}
        <div className="mt-8 space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Yazılıma neden başladığımı gerçekten ufak bir olay ile anlatayım. Bir gün babam ikizimle beni
            bir şey göstermek için yanına çağırdı. Karşısında ışıklı bir kutu vardı. Bu kutunun önünde de
            ince ve geniş bir kutu daha vardı. Bu ince ve geniş kutunun içinde üstünde farklı farklı çizikler
            olan bir sürü küçük kutular vardı. Boyum bu çizikli kutuları görmeye anca yetiyordu.
          </p>

          <blockquote
            className="p-5 rounded-2xl bg-slate-50 border-l-4 text-slate-800 font-medium italic my-6"
            style={{ borderLeftColor: currentTheme.color }}
          >
            "Babam heyecanla bu küçük kutulardan birine bastı ve bu kutunun üstündeki çiziklerin aynısı
            ışıklı kutunun üstünde belirdi... O an bunun nasıl olduğunu öğrenmek istedim ve yazılım maceram başladı."
          </blockquote>

          <p>
            O sürecin ilk adımı olarak babam ikizim ile bana harfleri birazcık da okumayı bu kutucuklar ile
            öğretti. Her adımından keyif aldığım yazılım tecrübemi geliştirmeye başladım ve hala yeni çizikli
            küçük kutucuklar peşindeyim.
          </p>

          {/* Photo */}
          <figure className="my-8">
            <img
              className="w-full rounded-2xl shadow-sm border border-slate-200 object-cover max-h-[480px]"
              src="/assets/images/about-me.jpg"
              alt="Hayri Habip"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/profile.jpg';
              }}
            />
            <figcaption className="mt-3 text-center text-xs font-mono text-slate-500">
              Hayri Habip · Yazılım mühendisi
            </figcaption>
          </figure>

          {/* Tech Domains & Focus */}
          <div className="mt-10 pt-8 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              İlgi ve Çalışma Alanlarım
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white mb-3"
                  style={{ backgroundColor: currentTheme.color }}
                >
                  <FontAwesomeIcon icon={faCode} className="text-xs" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">Full-Stack Geliştirme</h3>
                <p className="text-xs text-slate-600 mt-1">
                  C#, .NET Core, TypeScript, React, Angular ve modern web mimarileri.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white mb-3"
                  style={{ backgroundColor: currentTheme.color }}
                >
                  <FontAwesomeIcon icon={faBrain} className="text-xs" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">AI, LLM & RAG</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Büyük dil modelleri (LLM), RAG boru hatları, GenAI uygulamaları ve akıllı asistanlar.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white mb-3"
                  style={{ backgroundColor: currentTheme.color }}
                >
                  <FontAwesomeIcon icon={faCloud} className="text-xs" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">Bulut & Mimari</h3>
                <p className="text-xs text-slate-600 mt-1">
                  AWS, Docker, Azure AKS, mikroservisler, MongoDB ve yüksek erişilebilirlik.
                </p>
              </div>
            </div>
          </div>

          {/* Contact / Connect */}
          <div className="mt-10 pt-8 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              İletişim & Sosyal Medya
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Projeler, teknik fikir alışverişi veya iş birliği için bana aşağıdaki kanallardan ulaşabilirsiniz:
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/35HaRRy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FontAwesomeIcon icon={faGithub} />
                <span>GitHub (@35HaRRy)</span>
              </a>
              <a
                href="https://www.linkedin.com/in/hayri-habip/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FontAwesomeIcon icon={faLinkedin} />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://twitter.com/35_HaRRy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FontAwesomeIcon icon={faTwitter} />
                <span>Twitter / X</span>
              </a>
              <a
                href="https://www.instagram.com/hayrihabip/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FontAwesomeIcon icon={faInstagram} />
                <span>Instagram</span>
              </a>
              <a
                href="mailto:hayrihabip@hotmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FontAwesomeIcon icon={faEnvelope} />
                <span>E-posta</span>
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
