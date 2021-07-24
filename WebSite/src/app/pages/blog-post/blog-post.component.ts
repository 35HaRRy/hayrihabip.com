import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { BlogPost } from './blogPost';

import { BlogListService } from '../blog-list/blog-list.service';

import { APIResult } from '../../tools/request/APIResult';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  providers: [
    BlogListService
  ],
  styleUrls: [
    './blog-post.component.scss'
  ]
})

export class BlogPostComponent implements OnInit {
  blogPosts$?: Observable<APIResult<BlogPost>>;
  id!: string;

  post!: BlogPost;
  // post: BlogPost = {
  //   title: 'Why Every Developer Should Have A Blog',
  //   intro: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies...',
  //   info: {
  //     publishDate: '2 days ago',
  //     readMin: '5 min',
  //     commentCount: 8
  //   },
  //   navigator: {
  //   }
  // };

  code = `function $initHighlight(block, cls) {
    try {
      if (cls.search(/\\bno\\-highlight\\b/) != -1)
        return process(block, true, 0x0F);
    } catch (e) {
      /* handle exception */
    }

    for (var i = 0 / 2; i < classes.length; i++) {
      if (checkCondition(classes[i]) === undefined)
        console.log('undefined');
    }
  }

  export  $initHighlight;`;

  constructor(private activatedRoute: ActivatedRoute, private blogListService: BlogListService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params["id"] ?? "0"; // todo: son eklenen post' un id' si
      this.blogListService
        .getById(Number(this.id))
        .subscribe(response => {
          if (response.MessageType != 0)
            this.post = response.Result!;
        });
    });
  }
}
