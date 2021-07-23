import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-navigator',
  templateUrl: './blog-navigator.component.html',
  styleUrls: [
    './blog-navigator.component.scss'
  ]
})

export class BlogNavigatorComponent implements OnInit {
  @Input()
  isForList: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }
}
