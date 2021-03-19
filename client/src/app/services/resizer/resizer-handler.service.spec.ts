import { TestBed } from '@angular/core/testing';

import { ResizerHandlerService } from './resizer-handler.service';

describe('ResizerHandlerService', () => {
  let service: ResizerHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResizerHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
