import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BlogListComponent } from './blog-list.component';
import { BlogListService } from './blog-list.service';
import { getEmptyPager } from '../../tools/request/Pager';

describe('BlogListComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;
  const blogListServiceStub = {
    getPage: () => of(getEmptyPager()),
  };

  beforeEach(async () => {
    TestBed.overrideComponent(BlogListComponent, {
      set: {
        providers: [
          { provide: BlogListService, useValue: blogListServiceStub }
        ]
      }
    });

    await TestBed.configureTestingModule({
      declarations: [ BlogListComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ isIndex: false }),
            queryParams: of({})
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
