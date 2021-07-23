import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPostInfoComponent } from './blog-post-info.component';

describe('BlogPostInfoComponent', () => {
  let component: BlogPostInfoComponent;
  let fixture: ComponentFixture<BlogPostInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogPostInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogPostInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
