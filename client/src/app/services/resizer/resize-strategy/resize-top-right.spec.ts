import { TestBed } from '@angular/core/testing';

import { ResizeTopRight } from './resize-top-right';

describe('ResizeTopRightService', () => {
    let service: ResizeTopRight;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeTopRight);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
