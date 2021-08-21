import { Component, Input, OnInit } from '@angular/core';

import * as moment from 'moment';

import { BlogPost } from '../../pages/blog-post/blogPost';

@Component({
  selector: 'app-blog-post-info',
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
    console.log("date", this.data.regDate);
    console.log("now", moment());
    if (!this.data.publishDate)
      this.data.publishDate = moment(this.data.regDate).fromNow();
  }
}
