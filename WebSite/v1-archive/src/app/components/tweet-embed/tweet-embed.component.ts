import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: Element) => void;
      };
    };
  }
}

@Component({
  selector: 'app-tweet-embed',
  standalone: false,
  template: `
    <blockquote class="twitter-tweet" data-dnt="true">
      <a [href]="tweetUrl">{{ tweetUrl }}</a>
    </blockquote>
  `,
})
export class TweetEmbedComponent implements OnInit {
  @Input() tweetId = '';

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  get tweetUrl(): string {
    return `https://twitter.com/i/status/${this.tweetId}`;
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.tweetId) {
      return;
    }

    this.ensureWidgetsScript();
  }

  private ensureWidgetsScript(): void {
    const existingScript = this.document.getElementById('twitter-widgets-script') as HTMLScriptElement | null;

    if (existingScript) {
      window.twttr?.widgets?.load(this.elementRef.nativeElement);
      return;
    }

    const script = this.document.createElement('script');
    script.id = 'twitter-widgets-script';
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.onload = () => {
      window.twttr?.widgets?.load(this.elementRef.nativeElement);
    };

    (this.document.head || this.document.body).appendChild(script);
  }
}
