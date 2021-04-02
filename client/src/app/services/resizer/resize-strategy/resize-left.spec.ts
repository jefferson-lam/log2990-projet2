import { TestBed } from '@angular/core/testing';

import { ResizeLeft } from './resize-left';

describe('ResizeLeftService', () => {
    let service: ResizeLeft;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeLeft);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
