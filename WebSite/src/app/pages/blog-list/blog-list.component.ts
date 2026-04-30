import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BlogPost } from '../blog-post/blogPost';
import { BlogListService } from './blog-list.service';

import { getEmptyPager, Page, Pager } from '../../tools/request/Pager';

@Component({
  selector: 'app-blog-list',
  standalone: false,
  templateUrl: './blog-list.component.html',
  providers: [
    BlogListService
  ],
  styleUrls: [
    './blog-list.component.scss'
  ]
})

export class BlogListComponent implements OnInit {
  isIndex = false;

  pager: Pager = getEmptyPager();
  posts: BlogPost[] | null = null;
  isLoading: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private blogListService: BlogListService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => this.isIndex = Boolean(data['isIndex']));

    this.activatedRoute.queryParams.subscribe(params =>
      this.getPage({
        PageIndex: Number(params["pageIndex"] ?? "0"),
        PageSize: Number(params["pageSize"] ?? "25")
      })
    );
  }

  getPage(currentPage: Page) {
    this.isLoading = true;
    
    this.blogListService
      .getPage(currentPage)
      .subscribe(pager => {
        const { Rows, ...pagerWithOutRows } = pager;

        this.pager = pagerWithOutRows;
        this.posts = Rows ?? null;
        this.isLoading = false;
        console.log("posts", this.posts)
        this.changeDetector.detectChanges();
      });
  }
}
