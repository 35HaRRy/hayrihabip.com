import React, { useEffect } from 'react';

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: { reload: boolean; config: () => void }) => void;
    };
    disqus_config?: () => void;
  }
}

interface DisqusThreadProps {
  identifier: string;
  title?: string;
}

export const DisqusThread: React.FC<DisqusThreadProps> = ({ identifier, title }) => {
  const shortname = 'hayrihabip';

  useEffect(() => {
    const pageIdentifier = identifier || window.location.pathname;
    const pageUrl = window.location.href;

    const configure = function (this: { page: { identifier: string; url: string; title?: string } }) {
      this.page.identifier = pageIdentifier;
      this.page.url = pageUrl;
      if (title) this.page.title = title;
    };

    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: configure,
      });
      return;
    }

    window.disqus_config = configure;

    if (document.getElementById('disqus-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'disqus-script';
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.async = true;
    script.setAttribute('data-timestamp', `${Date.now()}`);
    (document.head || document.body).appendChild(script);
  }, [identifier, title]);

  // Disqus parses computed colors; Tailwind v4 emits oklch(), which it rejects.
  return <div id="disqus_thread" className="mt-5" style={{ color: '#1e293b', backgroundColor: '#f8fafc' }} />;
};
