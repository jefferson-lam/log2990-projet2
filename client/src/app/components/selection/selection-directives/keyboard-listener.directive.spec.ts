import { TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';
import { KeyboardListenerDirective } from './keyboard-listener.directive';

class ToolStub extends Tool {}

describe('KeyboardListenerDirective', () => {
    let toolManager: ToolManagerService;
    let drawingService: DrawingService;
    let undoRedoService: UndoRedoService;
    let resizerHandlerService: ResizerHandlerService;
    let rectangleService: RectangleService;
    let ellipseService: EllipseService;
    let rectangleSelectionService: RectangleSelectionService;
    let ellipseSelectionService: EllipseSelectionService;
    let directive: KeyboardListenerDirective;
    let keyboardDownEventSpy: jasmine.Spy;
    let keyboardUpEventSpy: jasmine.Spy;
    let toolStub: ToolStub;

    beforeEach(() => {
        toolManager = TestBed.inject(ToolManagerService);
        toolManager.currentToolSubject = new Subject<Tool>();

        drawingService = {} as DrawingService;
        undoRedoService = {} as UndoRedoService;
        resizerHandlerService = {} as ResizerHandlerService;
        rectangleService = new RectangleService(drawingService, undoRedoService);
        ellipseService = new EllipseService(drawingService, undoRedoService);

        rectangleSelectionService = new RectangleSelectionService(drawingService, undoRedoService, resizerHandlerService, rectangleService);
        ellipseSelectionService = new EllipseSelectionService(drawingService, undoRedoService, resizerHandlerService, ellipseService);
        toolManager.rectangleSelectionService = rectangleSelectionService;

        keyboardDownEventSpy = spyOn(rectangleSelectionService, 'onKeyboardDown').and.callThrough();
        keyboardUpEventSpy = spyOn(rectangleSelectionService, 'onKeyboardUp').and.callThrough();
        directive = new KeyboardListenerDirective(toolManager);
    });

    it('should create an instance', () => {
        const directive = new KeyboardListenerDirective(toolManager);
        expect(directive).toBeTruthy();
    });

    it('directives currenttool should change to Rectangle if toolManagers subject changes', () => {
        toolManager.currentToolSubject.next(rectangleSelectionService);
        expect(directive.currentTool).toBeInstanceOf(RectangleSelectionService);
        expect(directive.currentTool).toEqual(rectangleSelectionService);
    });

    it('directives currenttool should change to Ellipse if toolManagers subject changes', () => {
        toolManager.currentToolSubject.next(ellipseSelectionService);
        expect(directive.currentTool).toBeInstanceOf(EllipseSelectionService);
        expect(directive.currentTool).toEqual(ellipseSelectionService);
    });

    it('directives currenttool should not change if tool is not of type ToolSelectionService', () => {
        toolManager.currentToolSubject.next(toolStub);
        expect(directive.currentTool).toBeUndefined();
    });

    it("should call select tool when 'Escape' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'Escape' });
        directive.currentTool = rectangleSelectionService;
        directive.onEscapeDown(eventSpy);
        expect(keyboardDownEventSpy).toHaveBeenCalled();
        expect(keyboardDownEventSpy).toHaveBeenCalledWith(eventSpy);
    });

    it("should call select tool when 'Escape' key is up", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'Escape' });
        directive.currentTool = rectangleSelectionService;
        directive.onEscapeUp(eventSpy);
        expect(keyboardUpEventSpy).toHaveBeenCalled();
        expect(keyboardUpEventSpy).toHaveBeenCalledWith(eventSpy);
    });
});
