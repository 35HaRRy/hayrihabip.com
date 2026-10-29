import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faArrowUpRightFromSquare, faBrain, faPodcast } from '@fortawesome/free-solid-svg-icons';

const projects = [
  {
    name: 'Aisomedo',
    description: 'Fotoğraf ve videoları Instagram Reels’e dönüştüren, yayın öncesi inceleme ve onay sunan uygulama.',
    image: '/assets/images/projects/aisomedo.webp',
    alt: 'Aisomedo kontrol paneli ve yayın hazırlık akışı',
    github: 'https://github.com/35HaRRy/aisomedo',
    url: 'http://aisomedo.hayrihabip.com/',
  },
  {
    name: 'odi bid battle',
    description: 'İki takımın eşit bütçeyle adaylara teklif verdiği, Orta Dünya temalı açık artırma uygulaması.',
    image: '/assets/images/projects/odi-bid-battle.webp',
    alt: 'odi bid battle açık artırma listesi ve divan ekranı',
    github: 'https://github.com/35HaRRy/odi-bid-battle',
    url: 'https://odibb.hayrihabip.com/',
  },
  {
    name: 'Podcast creator API',
    description: 'YouTube oynatma listelerini podcast uygulamalarında dinlenebilen RSS akışlarına dönüştüren API.',
    icon: faPodcast,
    github: 'https://github.com/35HaRRy/hayrihabip.com/blob/main/API/Controllers/PodcastsController.cs',
    url: 'https://api.hayrihabip.com/podcasts',
  },
  {
    name: 'AI API',
    description: 'Notion yer imlerini ses, Markdown ve podcast RSS akışlarına dönüştüren API.',
    icon: faBrain,
    github: 'https://github.com/35HaRRy/hayrihabip.com/tree/main/AI',
    url: 'http://ai.hayrihabip.com/',
  },
];

export const ProjectsSection: React.FC = () => (
  <section aria-labelledby="projects-title" className="mb-12">
    <div className="mb-6 pb-3 border-b border-slate-200">
      <h2 id="projects-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
        Uygulamalarım
      </h2>
      <p className="text-sm text-slate-500 mt-1">Geliştirdiğim uygulamalar ve API’ler</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {projects.map((project) => (
        <article key={project.name} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="relative aspect-video overflow-hidden border-b border-slate-200 bg-slate-100">
            {project.image ? (
              <img src={project.image} alt={project.alt} width={1280} height={800}
                loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
            ) : (
              <div className="flex h-full items-center justify-center" style={{ color: 'var(--accent-color)', backgroundColor: 'var(--accent-light)' }}>
                <FontAwesomeIcon icon={project.icon!} className="text-6xl" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="text-lg font-bold tracking-tight text-slate-900">{project.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{project.description}</p>
            <div className="mt-auto flex gap-1 pt-4 text-slate-600">
              {[
                { href: project.github, label: `${project.name} — GitHub kaynak kodu (yeni sekme)`, icon: faGithub },
                { href: project.url, label: `${project.name} — uygulamayı aç (yeni sekme)`, icon: faArrowUpRightFromSquare },
              ].map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                  aria-label={link.label} title={link.label}
                  className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]">
                  <FontAwesomeIcon icon={link.icon} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);
