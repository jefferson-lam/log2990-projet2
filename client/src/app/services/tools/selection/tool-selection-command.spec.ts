import { TestBed } from '@angular/core/testing';
import { ToolSelectionCommandService } from './tool-selection-command';

describe('ToolSelectionCommandService', () => {
    let service: ToolSelectionCommandService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolSelectionCommandService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
