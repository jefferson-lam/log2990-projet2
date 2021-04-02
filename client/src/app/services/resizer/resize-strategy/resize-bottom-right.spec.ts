import { TestBed } from '@angular/core/testing';

import { ResizeBottomRight } from './resize-bottom-right';

describe('ResizeWidthHeightService', () => {
    let service: ResizeBottomRight;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeBottomRight);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
