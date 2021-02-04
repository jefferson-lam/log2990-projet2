import { TestBed } from '@angular/core/testing';
import { ToolManagerService } from './tool-manager-service';

describe('ToolManagerService', () => {
    let service: ToolManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('select tool on c keypress should select pencil', () => {
        const keyboardEvent = {
            key: 'c',
        } as KeyboardEvent;

        expect(service.selectTool(keyboardEvent)).toEqual(service.pencilService);
    });

    it('select tool should return pencil as a default value', () => {
        const keyboardEvent = {
            key: ',',
        } as KeyboardEvent;

        expect(service.selectTool(keyboardEvent)).toEqual(service.pencilService);
    });
});
