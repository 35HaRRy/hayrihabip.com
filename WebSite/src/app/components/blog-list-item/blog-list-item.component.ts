import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-list-item',
  templateUrl: './blog-list-item.component.html',
  styleUrls: [
    './blog-list-item.component.scss'
  ]
})

export class BlogListItemComponent implements OnInit {
  @Input()
  data!: {
    title: string;
    intro: string;
    info: {
      publishDate: string;
      readMin: string;
      commentCount: number;
    }
  };

  constructor() {
  }

  ngOnInit(): void {
  }
}
