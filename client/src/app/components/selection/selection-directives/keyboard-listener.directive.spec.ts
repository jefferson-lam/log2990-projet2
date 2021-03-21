import { TestBed } from '@angular/core/testing';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { KeyboardListenerDirective } from './keyboard-listener.directive';

class ToolStub extends Tool {}

fdescribe('KeyboardListenerDirective', () => {
    let toolManager: ToolManagerService;
    beforeEach(() => {
        toolManager = TestBed.inject(ToolManagerService);
    });

    it('should create an instance', () => {
        const directive = new KeyboardListenerDirective(toolManager);
        expect(directive).toBeTruthy();
    });

    it('directive should subscribe to toolManagers currentTool', () => {
        const directive = new KeyboardListenerDirective(toolManager);
        toolManager.selectTool({ key: 's' } as KeyboardEvent);
        expect(directive.currentTool).toEqual();
    });

    it('should prevent keydown default when ctrl+relevant key is down', () => {
        const directive = new KeyboardListenerDirective(toolManager);
        const eventSpy = jasmine.createSpyObj('event', ['stopPropagation'], { ctrlKey: true, code: '', key: '' });
        directive.onCtrlZKeyDown(eventSpy);
        expect(eventSpy.stopPropagation).toHaveBeenCalled();
    });
});
