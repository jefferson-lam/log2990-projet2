import { TestBed } from '@angular/core/testing';
import { EllipseToolSelectionService } from './ellipse-tool-selection-service';

describe('EllipseToolSelectionService', () => {
    let service: EllipseToolSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EllipseToolSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
