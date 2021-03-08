import { TestBed } from '@angular/core/testing';
import { RectangleSelectionCommand } from './rectangle-selection-command';

describe('RectangleSelectionCommandService', () => {
    let service: RectangleSelectionCommand;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RectangleSelectionCommand);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
