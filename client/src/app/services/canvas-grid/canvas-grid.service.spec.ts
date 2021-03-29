import { TestBed } from '@angular/core/testing';

import { CanvasGridService } from './canvas-grid.service';

describe('CanvasGridService', () => {
    let service: CanvasGridService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CanvasGridService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
