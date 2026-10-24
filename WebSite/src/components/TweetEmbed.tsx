import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement | null) => void;
      };
    };
  }
}

interface TweetEmbedProps {
  tweetId: string;
}

export const TweetEmbed: React.FC<TweetEmbedProps> = ({ tweetId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweetUrl = `https://twitter.com/i/status/${tweetId}`;

  useEffect(() => {
    if (!tweetId) return;
    const container = containerRef.current;
    const load = () => { if (container?.isConnected) window.twttr?.widgets?.load(container); };
    let script = document.getElementById('twitter-widgets-script') as HTMLScriptElement | null;
    const created = !script;
    if (!script) {
      script = document.createElement('script');
      script.id = 'twitter-widgets-script';
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
    }
    script.addEventListener('load', load);
    if (created) document.body.appendChild(script);
    if (window.twttr?.widgets) load();
    return () => script?.removeEventListener('load', load);
  }, [tweetId]);

  return (
    <div ref={containerRef} className="my-3">
      <blockquote className="twitter-tweet" data-dnt="true">
        <a href={tweetUrl}>{tweetUrl}</a>
      </blockquote>
    </div>
  );
};
