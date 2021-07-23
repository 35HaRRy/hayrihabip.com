import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: [
    './blog-list.component.scss'
  ]
})

export class BlogListComponent implements OnInit {
  isIndex = false;

  item = {
    title: 'Why Every Developer Should Have A Blog',
    intro: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies...',
    info: {
      publishDate: '2 days ago',
      readMin: '5 min',
      commentCount: 8
    }
  };

  constructor(private activatedroute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => this.isIndex = data.isIndex)
  }
}
