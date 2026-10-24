import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogNavigatorComponent } from './blog-navigator.component';

describe('BlogNavigatorComponent', () => {
  let component: BlogNavigatorComponent;
  let fixture: ComponentFixture<BlogNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogNavigatorComponent ]
      ,
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogNavigatorComponent);
    component = fixture.componentInstance;
    component.isForList = false;
    component.navigator = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
