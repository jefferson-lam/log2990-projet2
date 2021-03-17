import { TestBed } from '@angular/core/testing';
import { EllipseSelectionCommand } from './ellipse-selection-command';

describe('EllipseSelectionCommandService', () => {
    let service: EllipseSelectionCommand;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EllipseSelectionCommand);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
