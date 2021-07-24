import { Component, Input, OnInit } from '@angular/core';

import { BlogPost } from '../../pages/blog-post/blogPost';

@Component({
  selector: 'app-blog-list-item',
  templateUrl: './blog-list-item.component.html',
  styleUrls: [
    './blog-list-item.component.scss'
  ]
})

export class BlogListItemComponent implements OnInit {
  @Input()
  data!: BlogPost;

  constructor() {
  }

  ngOnInit(): void {
  }
}
