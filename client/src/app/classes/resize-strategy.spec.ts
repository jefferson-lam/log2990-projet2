import { TestBed } from '@angular/core/testing';

import { ResizeStrategy } from './resize-strategy';

describe('ResizeStrategyService', () => {
    let service: ResizeStrategy;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeStrategy);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
