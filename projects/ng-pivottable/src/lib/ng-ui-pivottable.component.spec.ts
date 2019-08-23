import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgUIPivottableComponent } from './ng-ui-pivottable.component';

describe('NgUIPivottableComponent', () => {
  let component: NgUIPivottableComponent;
  let fixture: ComponentFixture<NgUIPivottableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgUIPivottableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgUIPivottableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
