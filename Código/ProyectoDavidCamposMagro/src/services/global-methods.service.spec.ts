import { TestBed } from '@angular/core/testing';

import { GlobalMethodsService } from './global-methods.service';

describe('GlobalMethodsService', () => {
  let service: GlobalMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
