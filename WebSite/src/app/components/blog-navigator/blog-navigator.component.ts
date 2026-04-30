import { Component, Input } from '@angular/core';

import { PostNavigator } from './blog-navigator';

import { Pager } from '../../tools/request/Pager';

@Component({
  selector: 'app-blog-navigator',
  standalone: false,
  templateUrl: './blog-navigator.component.html',
  styleUrls: [
    './blog-navigator.component.scss'
  ]
})

export class BlogNavigatorComponent {
  @Input()
  navigator?: PostNavigator;

  @Input()
  pager?: Pager;

  @Input()
  isForList!: boolean;

  scrollTop(): void {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      // fallback for environments where window isn't available
      (document.documentElement || document.body).scrollTop = 0;
    }
  }
}
