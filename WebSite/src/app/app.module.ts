import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faHome, faUser, faBookmark, faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { NgxTweetModule } from "ngx-tweet";
import { DisqusModule } from 'ngx-disqus';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BlogListComponent } from './pages/blog-list/blog-list.component';
import { BlogPostComponent } from './pages/blog-post/blog-post.component';
import { AboutComponent } from './pages/about/about.component';

import { HeaderComponent } from './components/header/header.component';
import { BlogListItemComponent } from './components/blog-list-item/blog-list-item.component';
import { BlogPostInfoComponent } from './components/blog-post-info/blog-post-info.component';
import { BlogNavigatorComponent } from './components/blog-navigator/blog-navigator.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BlogListComponent,
    BlogPostComponent,
    BlogListItemComponent,
    BlogPostInfoComponent,
    BlogNavigatorComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'serverApp'
    }),
    AppRoutingModule,
    FontAwesomeModule,
    HighlightModule,
    NgxTweetModule,
    DisqusModule.forRoot('hayrihabip')
  ],
  providers: [{
    provide: HIGHLIGHT_OPTIONS,
    useValue: {
      fullLibraryLoader: () => import('highlight.js'),
      lineNumbers: true
    }
  }],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faHome, faUser, faBookmark, faLongArrowAltLeft, faLongArrowAltRight, faTwitter, faGithub, faLinkedin);
  }
}
