import { TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';
import { KeyboardListenerDirective } from './keyboard-listener.directive';

// class ToolStub extends Tool {}

fdescribe('KeyboardListenerDirective', () => {
    let toolManager: ToolManagerService;
    let drawingService: DrawingService;
    let undoRedoService: UndoRedoService;
    let resizerHandlerService: ResizerHandlerService;
    let rectangleService: RectangleService;
    let rectangleSelectionService: RectangleSelectionService;

    beforeEach(() => {
        toolManager = TestBed.inject(ToolManagerService);
        toolManager.currentToolSubject = new Subject<Tool>();

        drawingService = new DrawingService();
        undoRedoService = new UndoRedoService(drawingService);
        resizerHandlerService = new ResizerHandlerService();
        rectangleService = new RectangleService(drawingService, undoRedoService);
        rectangleSelectionService = new RectangleSelectionService(drawingService, undoRedoService, resizerHandlerService, rectangleService);
        toolManager.rectangleSelectionService = rectangleSelectionService;
    });

    it('should create an instance', () => {
        const directive = new KeyboardListenerDirective(toolManager);
        expect(directive).toBeTruthy();
    });

    // it('directive should subscribe to toolManagers currentTool', () => {
    //     const directive = new KeyboardListenerDirective(toolManager);
    //     toolManager.selectTool({ key: 's' } as KeyboardEvent);
    // });

    it('should prevent keydown default when ctrl+relevant key is down', () => {
        const directive = new KeyboardListenerDirective(toolManager);
        const eventSpy = jasmine.createSpyObj('event', ['stopPropagation'], { ctrlKey: true, code: '', key: 'z' });
        // directive.currentTool = new RectangleSelectionService(
        //     {} as DrawingService,
        //     {} as UndoRedoService,
        //     {} as ResizerHandlerService,
        //     {} as RectangleService,
        // );

        directive.currentTool = rectangleSelectionService;

        expect(directive.currentTool instanceof RectangleSelectionService).toBeTruthy();
        const undoSelectionSpy = spyOn(toolManager.rectangleSelectionService, 'undoSelection').and.callFake(() => {
            return;
        });
        directive.onCtrlZKeyDown(eventSpy);
        expect(eventSpy.stopPropagation).toHaveBeenCalled();
        expect(undoSelectionSpy).toHaveBeenCalled();
    });

    it('dahwjdkawhk', () => {
        const directive = new KeyboardListenerDirective(toolManager);
        toolManager.currentToolSubject.next(rectangleSelectionService);
        expect(directive.currentTool).toBeInstanceOf(RectangleSelectionService);
    })
});
