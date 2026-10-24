import React from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { BlogPostItem } from '../types/blog';
import { TweetEmbed } from './TweetEmbed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

function safeUrl(value: unknown, link = false): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  try {
    const parsed = new URL(value, 'https://content.invalid/');
    if (!['http:', 'https:', ...(link ? ['mailto:', 'tel:'] : [])].includes(parsed.protocol)) return undefined;
    return value;
  } catch { return undefined; }
}

interface Props {
  data?: (string | BlogPostItem)[] | null;
}

export const BlogPostItemRenderer: React.FC<Props> = ({ data }) => {
  if (!data || !Array.isArray(data)) return null;

  return (
    <>
      {data.map((item, index) => {
        if (typeof item === 'string') {
          return <React.Fragment key={index}>{item}</React.Fragment>;
        }

        const component = item.component;
        const attrs = item.attributes || {};
        const children = item.children;

        switch (component) {
          case 'figure':
            return (
              <figure key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </figure>
            );

          case 'figcaption':
            return (
              <figcaption key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </figcaption>
            );

          case 'a':
            return (
              <a
                key={index}
                className={attrs.className}
                href={safeUrl(attrs.href, true)}
                target={attrs.target}
                rel={attrs.target === '_blank' ? 'noopener noreferrer' : undefined}
              >
                <BlogPostItemRenderer data={children} />
              </a>
            );

          case 'img': {
            let src = safeUrl(attrs.src);
            if (src && !src.startsWith('http') && !src.startsWith('/')) {
              src = `/${src}`;
            }
            return (
              <img
                key={index}
                className={attrs.className}
                src={src}
                alt={attrs.alt || 'blog image'}
                loading="lazy"
              />
            );
          }

          case 'p':
            return (
              <p key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </p>
            );

          case 'h1':
            return (
              <h1 key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </h1>
            );

          case 'h2':
            return (
              <h2 key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </h2>
            );

          case 'h3':
            return (
              <h3 key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </h3>
            );

          case 'h4':
            return (
              <h4 key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </h4>
            );

          case 'h5':
            return (
              <h5 key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </h5>
            );

          case 'strong':
            return (
              <strong key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </strong>
            );

          case 'ul':
            return (
              <ul key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </ul>
            );

          case 'ol':
            return (
              <ol key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </ol>
            );

          case 'li':
            return (
              <li key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </li>
            );

          case 'blockquote':
            return (
              <blockquote key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </blockquote>
            );

          case 'footer':
            return (
              <footer key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </footer>
            );

          case 'div':
            return (
              <div key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </div>
            );

          case 'code': {
            const rawCode = Array.isArray(children) && children.length > 0 ? String(children[0]) : '';
            let highlighted: string | undefined;
            try {
              highlighted = hljs.highlightAuto(rawCode).value;
            } catch {
              highlighted = undefined;
            }
            return (
              <pre key={index} className={attrs.className}>
                {highlighted === undefined ? <code>{rawCode}</code> : <code dangerouslySetInnerHTML={{ __html: highlighted }} />}
              </pre>
            );
          }

          case 'tweet':
            return <TweetEmbed key={`${index}:${attrs.tweetId}`} tweetId={attrs.tweetId ?? ''} />;

          case 'icon': {
            const name = Array.isArray(attrs.icon) ? attrs.icon[1] : attrs.icon;
            const icon = { github: faGithub, linkedin: faLinkedin, twitter: faTwitter }[name ?? ''];
            return icon ? <FontAwesomeIcon key={index} icon={icon} className={attrs.className} fixedWidth /> : null;
          }

          case 'video':
            return (
              <div key={index} className="aspect-video my-4 rounded-xl overflow-hidden shadow-xs">
                <iframe
                  className="w-full h-full"
                  src={safeUrl(attrs.src)}
                  title="Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );

          case 'table': {
            const rows = Array.isArray(attrs.rows) ? attrs.rows.filter((row) => row && typeof row === 'object' && !Array.isArray(row)) : [];
            const headerKeys = rows.length > 0 ? Object.keys(rows[0]) : [];
            return (
              <table key={index} className={`table ${attrs.className || ''}`}>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    {headerKeys.map((key) => (
                      <th key={key} scope="col">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <th scope="row">{rIdx}</th>
                      {headerKeys.map((k) => (
                        <td key={k}>{typeof row[k] === 'object' ? '' : String(row[k] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          }

          default:
            return (
              <div key={index} className={attrs.className}>
                <BlogPostItemRenderer data={children} />
              </div>
            );
        }
      })}
    </>
  );
};
