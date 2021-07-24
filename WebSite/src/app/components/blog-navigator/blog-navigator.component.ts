import { Component, Input, OnInit } from '@angular/core';

import { PostNavigator } from './blog-navigator';

import { Pager } from '../../tools/request/Pager';

@Component({
  selector: 'app-blog-navigator',
  templateUrl: './blog-navigator.component.html',
  styleUrls: [
    './blog-navigator.component.scss'
  ]
})

export class BlogNavigatorComponent implements OnInit {
  @Input()
  navigator?: PostNavigator;

  @Input()
  pager?: Pager;

  @Input()
  isForList!: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }
}
