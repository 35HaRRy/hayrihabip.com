import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: { reload: boolean; config: () => void }) => void;
    };
    disqus_config?: () => void;
  }
}

@Component({
  selector: 'app-disqus-thread',
  standalone: false,
  template: '<div id="disqus_thread"></div>',
})
export class DisqusThreadComponent implements OnInit, OnChanges {
  @Input() identifier = '';

  private readonly shortname = 'hayrihabip';

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.renderThread();
  }

  ngOnChanges(_: SimpleChanges): void {
    this.renderThread();
  }

  private renderThread(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const pageIdentifier = this.identifier || this.router.url;
    const pageUrl = this.document.location?.href ?? '';
    const windowRef = window;

    const configure = function (this: { page: { identifier: string; url: string } }) {
      this.page.identifier = pageIdentifier;
      this.page.url = pageUrl;
    };

    if (windowRef.DISQUS) {
      windowRef.DISQUS.reset({
        reload: true,
        config: configure,
      });
      return;
    }

    windowRef.disqus_config = configure;

    if (this.document.getElementById('disqus-script')) {
      return;
    }

    const script = this.document.createElement('script');
    script.id = 'disqus-script';
    script.src = `https://${this.shortname}.disqus.com/embed.js`;
    script.async = true;
    script.setAttribute('data-timestamp', `${Date.now()}`);
    (this.document.head || this.document.body).appendChild(script);
  }
}
