import { HttpResponse } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { StaticBlogPosts } from '../../StaticBlogPosts';

@Injectable()
export class CustomResponseInterceptor implements HttpInterceptor {
  listUrl = "api/BlogPosts";

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, urlWithParams } = request;

    // helper functions
    const ok = (body?: any) => of(new HttpResponse({
        status: 200,
        body
    }));

    function idFromUrl() {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1];
    }

    const getListMatch = urlWithParams.match(/api\/BlogPosts\?pageIndex=(\d+)&pageSize=(\d+)$/);

    // wrap in delayed observable to simulate server api call
    return of(null)
        .pipe(mergeMap(handleRoute))
        .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(delay(500))
        .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
          // case url.endsWith('/users/authenticate') && method === 'POST':
          //   return authenticate();
          // case url.endsWith('/users/register') && method === 'POST':
          //   return register();
          case getListMatch && method === 'GET':
            const PageSize = parseInt(getListMatch![2]);
            const PageIndex = parseInt(getListMatch![1]);

            const Rows = StaticBlogPosts.slice(PageSize * PageIndex, PageSize * PageIndex + PageSize);

            return ok({
              PageSize,
              PageIndex,
              Rows,
              ShowingFirstRowIndex: PageSize * PageIndex + 1,
              ShowingLastRowIndex: PageSize * PageIndex + Rows.length,
              TotalPageCount: Math.ceil(Rows.length / PageSize),
              TotalRecord: StaticBlogPosts.length,
              ViewingRecord: Rows.length
            });
          case url.match(/api\/BlogPosts\/.*$/) && method === 'GET':
            const id = idFromUrl();

            const post = id == "latest" ? StaticBlogPosts[0] : StaticBlogPosts.find(post => post.id === id);
            return ok({
              MessageType: 1,
              Result: post
            });
          // case url.match(/\/users\/\d+$/) && method === 'PUT':
          //   return updateUser();
          // case url.match(/\/users\/\d+$/) && method === 'DELETE':
          //   return deleteUser();
          default:
            // pass through any requests not handled above
            return next.handle(request);
      }
    }
  }
}
