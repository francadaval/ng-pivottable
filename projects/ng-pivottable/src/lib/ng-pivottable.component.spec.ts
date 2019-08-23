import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgPivottableComponent } from './ng-pivottable.component';

describe('NgPivottableComponent', () => {
  let component: NgPivottableComponent;
  let fixture: ComponentFixture<NgPivottableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgPivottableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgPivottableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
