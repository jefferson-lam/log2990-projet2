import { TestBed } from '@angular/core/testing';

import { PipetteServiceService } from './pipette-service';

describe('PipetteServiceService', () => {
  let service: PipetteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PipetteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
