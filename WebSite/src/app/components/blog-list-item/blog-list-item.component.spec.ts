import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogListItemComponent } from './blog-list-item.component';
import { BlogPost } from '../../pages/blog-post/blogPost';

describe('BlogListItemComponent', () => {
  let component: BlogListItemComponent;
  let fixture: ComponentFixture<BlogListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogListItemComponent ]
      ,
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogListItemComponent);
    component = fixture.componentInstance;
    component.data = {
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
    } as BlogPost;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
