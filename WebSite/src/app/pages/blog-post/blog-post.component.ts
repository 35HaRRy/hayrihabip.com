import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HighlightResult } from 'ngx-highlightjs';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: [
    './blog-post.component.scss'
  ]
})

export class BlogPostComponent implements OnInit {
  id!: string;

  post = {
    title: 'Why Every Developer Should Have A Blog',
    intro: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies...',
    info: {
      publishDate: '2 days ago',
      readMin: '5 min',
      commentCount: 8
    }
  };

  response?: HighlightResult;
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

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? "0" // todo: son eklenen post' un id' si
  }

  onHighlight(e: any) {
    this.response = {
      language: e.language,
      relevance: e.relevance,
      second_best: '{...}',
      top: '{...}',
      value: '{...}'
    }
  }
}
