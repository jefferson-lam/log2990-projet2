import { TestBed } from '@angular/core/testing';

import { ResizeTop } from './resize-top';

describe('ResizeTopService', () => {
    let service: ResizeTop;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeTop);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
