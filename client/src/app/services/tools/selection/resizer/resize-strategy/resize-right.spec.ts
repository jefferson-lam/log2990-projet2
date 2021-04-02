import { TestBed } from '@angular/core/testing';

import { ResizeRight } from './resize-right';

describe('ResizeWidthService', () => {
    let service: ResizeRight;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeRight);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
