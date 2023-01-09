import { TestBed } from '@angular/core/testing';

import { GlobalVariablesService } from './global-variables.service';

describe('GlobalVariablesService', () => {
  let service: GlobalVariablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalVariablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
