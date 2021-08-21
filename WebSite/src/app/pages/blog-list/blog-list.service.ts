import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BlogPost } from '../blog-post/blogPost';

import { HttpErrorHandler, HandleError } from '../../tools/request/http-error-handler.service';
import { Pager, getEmptyPager, Page } from '../../tools/request/Pager';
import { APIResult, ErrorAPIResult } from '../../tools/request/APIResult';

@Injectable()
export class BlogListService {
  listUrl = `api/BlogPosts`;

  private handleError: HandleError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('BlogListService');
  }

  getPage = (currentPage: Page): Observable<Pager<BlogPost>> => {
    const params = new HttpParams()
      .set('pageIndex', currentPage.PageIndex)
      .set('pageSize', currentPage.PageSize);
    const options = {
      params
    };

    return this.http
      .get<Pager<BlogPost>>(this.listUrl, options)
      .pipe(
        catchError(this.handleError('getBlogPosts', getEmptyPager<BlogPost>()))
      );
  }
  getById = (id: string): Observable<APIResult<BlogPost>> => this.http
    .get<APIResult<BlogPost>>(`${this.listUrl}/${id}`)
    .pipe(
      catchError(this.handleError('getBlogPostById', ErrorAPIResult))
    );
}
