import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Tool } from '@app/classes/tool';
import * as SelectionConstants from '@app/constants/selection-constants';
import { FillMode } from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolSelectionService } from './tool-selection-service';

describe('ToolSelectionService', () => {
    let service: ToolSelectionService;
    let mouseEvent: MouseEvent;
    let keyboardEvent: KeyboardEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let selectedToolSpy: jasmine.SpyObj<Tool>;
    let setLineDashSpy: jasmine.Spy;
    // let baseCtxDrawImageSpy: jasmine.Spy<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let selectionCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    // let undoRedoService: UndoRedoService;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'selectionCanvas', 'canvas']);
        selectedToolSpy = jasmine.createSpyObj('Tool', [
            'onMouseDown',
            'onMouseUp',
            'onMouseLeave',
            'onMouseEnter',
            'onMouseMove',
            'onKeyboardDown',
            'onKeyboardUp',
            'setFillMode',
            'setPrimaryColor',
            'setSecondaryColor',
            'setLineWidth',
        ]);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: Tool, useValue: selectedToolSpy },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        selectionCtxStub = canvasTestHelper.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(ToolSelectionService);

        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].selectionCtx = selectionCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].selectionCanvas = canvasTestHelper.selectionCanvas;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        service.selectionToolFillMode = FillMode.OUTLINE;
        service.selectionToolLineWidth = 1;
        service.selectionToolPrimaryColor = 'white';
        service.selectionToolSecondaryColor = 'black';

        setLineDashSpy = spyOn(drawServiceSpy.previewCtx, 'setLineDash');

        mouseEvent = {
            offsetX: 25,
            offsetY: 40,
            button: 0,
        } as MouseEvent;

        keyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service.inUse).toBeFalsy();
    });

    it('onMouseDown should pass if selectionTool is not inUse', () => {
        expect((): void => {
            service.onMouseDown(mouseEvent);
        }).not.toThrow();
    });

    it('onMouseDown should call call correct functions if tool is inUse', () => {
        service.onMouseDown(mouseEvent);
        expect(selectedToolSpy.onMouseDown).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseUp should pass if selectionTool is not inUse', () => {
        expect((): void => {
            service.onMouseUp(mouseEvent);
        }).not.toThrow();
    });

    it('onMouseUp should call selectedTools mouseUp event', () => {
        service.onMouseUp(mouseEvent);
        expect(selectedToolSpy.onMouseUp).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseMove should pass if selectionTool is not inUse', () => {
        expect((): void => {
            service.onMouseMove(mouseEvent);
        }).not.toThrow();
    });

    it('onMouseMove should call selectedTools mouseMove event', () => {
        service.onMouseMove(mouseEvent);
        expect(selectedToolSpy.onMouseMove).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseLeave should call selectedtool onMouseLeave event', () => {
        service.onMouseLeave(mouseEvent);
        expect(selectedToolSpy.onMouseLeave).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseEnter should call selectedtool onMouseEnter event', () => {
        service.onMouseEnter(mouseEvent);
        expect(selectedToolSpy.onMouseEnter).toHaveBeenCalledWith(mouseEvent);
    });

    it('onKeyboardDown should call selectedtool onKeyboardDown event', () => {
        service.onKeyboardDown(keyboardEvent);
        expect(selectedToolSpy.onKeyboardDown).toHaveBeenCalledWith(keyboardEvent);
    });

    it('onKeyboardUp should call selectedtool onKeyboardUp event', () => {
        service.onKeyboardUp(keyboardEvent);
        expect(selectedToolSpy.onKeyboardUp).toHaveBeenCalledWith(keyboardEvent);
    });

    it('resetCanvasState should reset the canvas to its default values', () => {
        const testCanvas = document.createElement('canvas');
        service.resetCanvasState(testCanvas);
        expect(testCanvas.style.left).toEqual(SelectionConstants.DEFAULT_LEFT_POSITION + 'px');
        expect(testCanvas.style.top).toEqual(SelectionConstants.DEFAULT_TOP_POSITION + 'px');
        expect(testCanvas.width).toEqual(SelectionConstants.DEFAULT_WIDTH);
        expect(testCanvas.height).toEqual(SelectionConstants.DEFAULT_HEIGHT);
    });

    it('resetSelectionSettings should call Tool setSettings functions', () => {
        service.resetSelectedToolSettings();
        expect(selectedToolSpy.setFillMode).toHaveBeenCalledWith(service.selectionToolFillMode);
        expect(selectedToolSpy.setLineWidth).toHaveBeenCalledWith(service.selectionToolLineWidth);
        expect(selectedToolSpy.setPrimaryColor).toHaveBeenCalledWith(service.selectionToolPrimaryColor);
        expect(selectedToolSpy.setSecondaryColor).toHaveBeenCalledWith(service.selectionToolSecondaryColor);
        expect(setLineDashSpy).toHaveBeenCalledWith([]);
    });

    it('setSelectionSettings should call Tool setSettings functions', () => {
        service.setSelectionSettings();
        expect(selectedToolSpy.setFillMode).toHaveBeenCalledWith(FillMode.OUTLINE);
        expect(selectedToolSpy.setLineWidth).toHaveBeenCalledWith(SelectionConstants.SELECTION_LINE_WIDTH);
        expect(selectedToolSpy.setPrimaryColor).toHaveBeenCalledWith('white');
        expect(selectedToolSpy.setSecondaryColor).toHaveBeenCalledWith('black');
        expect(setLineDashSpy).toHaveBeenCalledWith([SelectionConstants.DEFAULT_LINE_DASH, SelectionConstants.DEFAULT_LINE_DASH]);
    });
});
