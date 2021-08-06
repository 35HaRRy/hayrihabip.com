import { Component, Input, OnInit } from '@angular/core';

import { BlogPostItem } from '../../pages/blog-post/blogPost';

@Component({
  selector: 'app-blog-post-item',
  templateUrl: './blog-post-item.component.html',
  styleUrls: [
    './blog-post-item.component.scss'
  ]
})
export class BlogPostItemComponent implements OnInit {
  @Input()
  data?: (string | BlogPostItem)[];

  constructor() {
  }

  ngOnInit(): void {
  }

  typeOf = (value: any) => typeof(value);
  keysOf = (value: any) => Object.keys(value);
}
