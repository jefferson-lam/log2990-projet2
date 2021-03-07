import { TestBed } from '@angular/core/testing';
import { ToolSelectionCommand } from './tool-selection-command';

describe('ToolSelectionCommandService', () => {
    let service: ToolSelectionCommand;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolSelectionCommand);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
