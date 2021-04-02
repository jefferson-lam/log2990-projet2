import { TestBed } from '@angular/core/testing';

import { ResizeBottomLeft } from './resize-bottom-left';

describe('ResizeBottomLeftService', () => {
    let service: ResizeBottomLeft;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeBottomLeft);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
