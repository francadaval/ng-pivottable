import { TestBed } from '@angular/core/testing';

import { NgPivottableService } from './ng-pivottable.service';

describe('NgPivottableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgPivottableService = TestBed.get(NgPivottableService);
    expect(service).toBeTruthy();
  });
});
