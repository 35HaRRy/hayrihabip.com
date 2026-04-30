import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPostInfoComponent } from './blog-post-info.component';

describe('BlogPostInfoComponent', () => {
  let component: BlogPostInfoComponent;
  let fixture: ComponentFixture<BlogPostInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogPostInfoComponent ]
      ,
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogPostInfoComponent);
    component = fixture.componentInstance;
    component.data = {
      regDate: new Date(),
      readMin: '1 min',
      commentCount: 0,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
