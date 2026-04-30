import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faHome, faUser, faBookmark, faArrowLeftLong, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthService } from '../tools/request/auth.service';
import { HttpErrorHandler } from '../tools/request/http-error-handler.service';
import { MessageService } from '../tools/request/message.service';
import { RequestCache, RequestCacheWithMap } from '../tools/request/request-cache.service';
import { httpInterceptorProviders } from '../tools/request/http-interceptors';

import { BlogListComponent } from '../pages/blog-list/blog-list.component';
import { BlogListService } from '../pages/blog-list/blog-list.service';
import { BlogPostComponent } from '../pages/blog-post/blog-post.component';
import { AboutComponent } from '../pages/about/about.component';

import { HeaderComponent } from '../components/header/header.component';
import { BlogListItemComponent } from '../components/blog-list-item/blog-list-item.component';
import { BlogPostInfoComponent } from '../components/blog-post-info/blog-post-info.component';
import { BlogNavigatorComponent } from '../components/blog-navigator/blog-navigator.component';
import { BlogPostItemComponent } from '../components/blog-post-item/blog-post-item.component';
import { DisqusThreadComponent } from '../components/disqus-thread/disqus-thread.component';
import { TweetEmbedComponent } from '../components/tweet-embed/tweet-embed.component';
import { LoadingComponent } from '../components/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BlogListComponent,
    BlogPostComponent,
    BlogPostItemComponent,
    BlogListItemComponent,
    BlogPostInfoComponent,
    BlogNavigatorComponent,
    LoadingComponent,
    AboutComponent,
    DisqusThreadComponent,
    TweetEmbedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HighlightModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
        lineNumbers: true
      }
    },
    {
      provide: RequestCache,
      useClass: RequestCacheWithMap
    },
    HttpErrorHandler,
    MessageService,
    AuthService,
    BlogListService,
    httpInterceptorProviders
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faHome, faUser, faBookmark, faArrowLeftLong, faArrowRightLong, faTwitter, faGithub, faLinkedin);
  }
}
