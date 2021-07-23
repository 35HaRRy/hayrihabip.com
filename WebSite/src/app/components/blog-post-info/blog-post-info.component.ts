import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-post-info',
  templateUrl: './blog-post-info.component.html',
  styleUrls: [
    './blog-post-info.component.scss'
  ]
})

export class BlogPostInfoComponent implements OnInit {
  @Input()
  data!: {
    publishDate: string;
    readMin: string;
    commentCount: number;
  };

  constructor() {
  }

  ngOnInit(): void {
  }
}
