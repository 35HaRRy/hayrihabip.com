import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { BlogPost } from './blogPost';

import { BlogListService } from '../blog-list/blog-list.service';

import { APIResult } from '../../tools/request/APIResult';

@Component({
  selector: 'app-blog-post',
  standalone: false,
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

  post: BlogPost | null = null;

  constructor(private activatedRoute: ActivatedRoute, private blogListService: BlogListService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params["id"] ?? "0"; // todo: son eklenen post' un id' si
      this.blogListService
        .getById(this.id)
        .subscribe(response => {
          if (response.MessageType != 0) {
            this.post = response.Result!;
            this.changeDetector.detectChanges();
          }
        });
    });
  }
}
