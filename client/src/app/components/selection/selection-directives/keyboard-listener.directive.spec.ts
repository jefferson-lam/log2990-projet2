import { TestBed } from '@angular/core/testing';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { KeyboardListenerDirective } from './keyboard-listener.directive';

// class ToolStub extends Tool {}

describe('KeyboardListenerDirective', () => {
    let toolManager: ToolManagerService;
    // let toolStub: ToolStub;
    beforeEach(() => {
        // toolStub = new ToolStub({} as DrawingService, {} as UndoRedoService);
        toolManager = TestBed.inject(ToolManagerService);
    });

    it('should create an instance', () => {
        const directive = new KeyboardListenerDirective(toolManager);
        expect(directive).toBeTruthy();
    });
});
