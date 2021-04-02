import { TestBed } from '@angular/core/testing';
import { ResizeBottom } from './resize-bottom';

describe('ResizeHeightService', () => {
    let service: ResizeBottom;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeBottom);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
