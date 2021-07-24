import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ParamMap } from '@angular/router';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.scss'
  ]
})
export class HeaderComponent implements OnInit {
  currentRoute = '/';

  constructor(private route: Router) {
  }

  ngOnInit(): void {
    this.route.events.forEach(event => {
      if(event instanceof NavigationEnd)
        this.currentRoute = event.url;
    });
  }
}
