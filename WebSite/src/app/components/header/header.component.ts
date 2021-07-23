import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.scss'
  ]
})
export class HeaderComponent implements OnInit {
  currentRoute = '/';

  constructor(private router: Router) {
    router.events.forEach(event => {
      if(event instanceof NavigationEnd)
        this.currentRoute = event.url;
    });
  }

  ngOnInit(): void {
  }
}
