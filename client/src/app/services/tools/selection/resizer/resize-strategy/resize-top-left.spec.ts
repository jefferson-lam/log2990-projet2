import { TestBed } from '@angular/core/testing';

import { ResizeTopLeft } from './resize-top-left';

describe('ResizeTopLeftService', () => {
    let service: ResizeTopLeft;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeTopLeft);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
