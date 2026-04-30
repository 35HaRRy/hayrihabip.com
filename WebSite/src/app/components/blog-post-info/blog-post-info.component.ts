import { Component, Input, OnInit } from '@angular/core';

import { BlogPost } from '../../pages/blog-post/blogPost';

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

function getRelativeTimeLabel(date: Date | string): string {
  const value = new Date(date);
  const diffInSeconds = Math.round((value.getTime() - Date.now()) / 1000);
  const divisions: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
    { amount: 60, unit: 'second' },
    { amount: 60, unit: 'minute' },
    { amount: 24, unit: 'hour' },
    { amount: 7, unit: 'day' },
    { amount: 4.34524, unit: 'week' },
    { amount: 12, unit: 'month' },
    { amount: Number.POSITIVE_INFINITY, unit: 'year' },
  ];

  let duration = diffInSeconds;

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return relativeTimeFormatter.format(Math.round(duration), division.unit);
    }

    duration /= division.amount;
  }

  return relativeTimeFormatter.format(Math.round(duration), 'year');
}

@Component({
  selector: 'app-blog-post-info',
  standalone: false,
  templateUrl: './blog-post-info.component.html',
  styleUrls: [
    './blog-post-info.component.scss'
  ]
})

export class BlogPostInfoComponent implements OnInit {
  @Input()
  // data!: Pick<BlogPost, 'info'>;
  data!: {
    regDate: Date;
    publishDate?: string;
    readMin: string;
    commentCount: number;
  };

  constructor() {
  }

  ngOnInit(): void {
    if (!this.data.publishDate)
      this.data.publishDate = getRelativeTimeLabel(this.data.regDate);
  }
}
