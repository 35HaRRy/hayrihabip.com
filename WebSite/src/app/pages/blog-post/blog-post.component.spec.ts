import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BlogPostComponent } from './blog-post.component';
import { BlogListService } from '../blog-list/blog-list.service';

describe('BlogPostComponent', () => {
  let component: BlogPostComponent;
  let fixture: ComponentFixture<BlogPostComponent>;
  const blogListServiceStub = {
    getById: () => of({
      MessageType: 1,
      Result: {
        id: '1',
        title: 'Test post',
        intro: 'Intro',
        imageName: 'test.png',
        navigator: {},
        info: {
          regDate: new Date(),
          readMin: '1 min',
          commentCount: 0,
        },
        body: []
      }
    })
  };

  beforeEach(async () => {
    TestBed.overrideComponent(BlogPostComponent, {
      set: {
        providers: [
          { provide: BlogListService, useValue: blogListServiceStub }
        ]
      }
    });

    await TestBed.configureTestingModule({
      declarations: [ BlogPostComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
