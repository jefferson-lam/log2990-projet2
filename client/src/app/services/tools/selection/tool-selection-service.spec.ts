import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as SelectionConstants from '@app/constants/selection-constants';
import { FillMode } from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolSelectionService } from './tool-selection-service';

// tslint:disable:max-file-line-count
describe('ToolSelectionService', () => {
    let service: ToolSelectionService;
    let mouseEvent: MouseEvent;
    let keyboardEvent: KeyboardEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let selectedToolSpy: jasmine.SpyObj<Tool>;
    let setLineDashSpy: jasmine.Spy;

    let baseCtxStub: CanvasRenderingContext2D;
    let selectionCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

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

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].selectionCtx = selectionCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].selectionCanvas = canvasTestHelper.selectionCanvas;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        service['selectionToolFillMode'] = FillMode.OUTLINE;
        service['selectionToolLineWidth'] = 1;
        service['selectionToolPrimaryColor'] = 'white';
        service['selectionToolSecondaryColor'] = 'black';

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

    it('should call undoSelection ', () => {
        service.undoSelection();
        expect(service).toBeTruthy();
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

    it('getSelectionToolSettings should not set settings if the selectedTools settings are null', () => {
        service.selectionTool.lineWidth = undefined;
        service.selectionTool.fillMode = undefined;
        service.selectionTool.primaryColor = undefined;
        service.selectionTool.secondaryColor = undefined;
        service['getSelectedToolSettings']();
        expect(service['selectionToolLineWidth']).toEqual(1);
        expect(service['selectionToolPrimaryColor']).toEqual('white');
        expect(service['selectionToolSecondaryColor']).toEqual('black');
    });

    it('getSelectionToolSettings should set correct selectionToolSettings if settings are not null', () => {
        const lineWidth = 20;
        service.selectionTool.lineWidth = lineWidth;
        service.selectionTool.fillMode = FillMode.OUTLINE_FILL;
        service.selectionTool.primaryColor = 'red';
        service.selectionTool.secondaryColor = 'black';
        service['getSelectedToolSettings']();
        expect(service['selectionToolLineWidth']).toEqual(lineWidth);
        expect(service['selectionToolFillMode']).toEqual(FillMode.OUTLINE_FILL);
        expect(service['selectionToolPrimaryColor']).toEqual('red');
        expect(service['selectionToolSecondaryColor']).toEqual('black');
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
        expect(selectedToolSpy.setFillMode).toHaveBeenCalledWith(service['selectionToolFillMode']);
        expect(selectedToolSpy.setLineWidth).toHaveBeenCalledWith(service['selectionToolLineWidth']);
        expect(selectedToolSpy.setPrimaryColor).toHaveBeenCalledWith(service['selectionToolPrimaryColor']);
        expect(selectedToolSpy.setSecondaryColor).toHaveBeenCalledWith(service['selectionToolSecondaryColor']);
        expect(setLineDashSpy).toHaveBeenCalledWith([]);
    });

    it('setSelectionSettings should call Tool setSettings functions', () => {
        service['setSelectionSettings']();
        expect(selectedToolSpy.setFillMode).toHaveBeenCalledWith(FillMode.OUTLINE);
        expect(selectedToolSpy.setLineWidth).toHaveBeenCalledWith(SelectionConstants.SELECTION_LINE_WIDTH);
        expect(selectedToolSpy.setPrimaryColor).toHaveBeenCalledWith('white');
        expect(selectedToolSpy.setSecondaryColor).toHaveBeenCalledWith('black');
        expect(setLineDashSpy).toHaveBeenCalledWith([SelectionConstants.DEFAULT_LINE_DASH, SelectionConstants.DEFAULT_LINE_DASH]);
    });

    it('validateCornerCoords should properly (-w, -h)', () => {
        const startPoint: Vec2 = {
            x: 400,
            y: 350,
        };
        const endPoint: Vec2 = {
            x: 150,
            y: 100,
        };
        const selHeight = -250;
        const selWidth = -250;
        const expectedResult = [endPoint, startPoint];
        const result = service.validateCornerCoords([startPoint, endPoint], selWidth, selHeight);
        expect(result).toEqual(expectedResult);
    });

    it('validateCornerCoords should properly set values (-w, +h)', () => {
        const startPoint: Vec2 = {
            x: 400,
            y: 100,
        };
        const endPoint: Vec2 = {
            x: 150,
            y: 400,
        };
        const selWidth = -250;
        const selHeight = 300;
        const expectedResult = [
            { x: 150, y: 100 },
            { x: 400, y: 400 },
        ];
        const result = service.validateCornerCoords([startPoint, endPoint], selWidth, selHeight);
        expect(result).toEqual(expectedResult);
    });

    it('validateCorneCoords should properly set values (+w, -h)', () => {
        const startPoint: Vec2 = {
            x: 100,
            y: 350,
        };
        const endPoint: Vec2 = {
            x: 150,
            y: 200,
        };
        const selWidth = 50;
        const selHeight = -150;
        const expectedResult = [
            { x: 100, y: 200 },
            { x: 150, y: 350 },
        ];
        const result = service.validateCornerCoords([startPoint, endPoint], selWidth, selHeight);
        expect(result).toEqual(expectedResult);
    });

    it('validateCornerCoords should properly set values (+w, +h)', () => {
        const startPoint: Vec2 = {
            x: 100,
            y: 350,
        };
        const endPoint: Vec2 = {
            x: 150,
            y: 500,
        };
        const selWidth = 50;
        const selHeight = 150;
        const expectedResult = [
            { x: 100, y: 350 },
            { x: 150, y: 500 },
        ];
        const result = service.validateCornerCoords([startPoint, endPoint], selWidth, selHeight);
        expect(result).toEqual(expectedResult);
    });

    it('computeSquareCoords should properly set values (+w, +h)', () => {
        const startPoint: Vec2 = {
            x: 100,
            y: 350,
        };
        const endPoint: Vec2 = {
            x: 150,
            y: 500,
        };
        const selWidth = 50;
        const selHeight = 150;
        const expectedResult = [
            { x: 100, y: 350 },
            { x: 150, y: 500 },
        ];
        const result = service.computeSquareCoords([startPoint, endPoint], selWidth, selHeight);
        expect(result).toEqual(expectedResult);
    });

    it('computeSquareCoords should properly set values (-w, -h)', () => {
        const startPoint: Vec2 = {
            x: 100,
            y: 350,
        };
        const endPoint: Vec2 = {
            x: 50,
            y: 300,
        };
        const selWidth = -50;
        const selHeight = -50;
        const expectedResult = [
            { x: 0, y: 250 },
            { x: 50, y: 300 },
        ];
        const result = service.computeSquareCoords([startPoint, endPoint], selWidth, selHeight);
        expect(result).toEqual(expectedResult);
    });

    it('computeSquareCoords should properly set values (-w, +h)', () => {
        const startPoint: Vec2 = {
            x: 100,
            y: 350,
        };
        const endPoint: Vec2 = {
            x: 50,
            y: 500,
        };
        const selWidth = -50;
        const selHeight = 150;
        const expectedResult = [
            { x: 100, y: 350 },
            { x: 50, y: 500 },
        ];
        const result = service.computeSquareCoords([startPoint, endPoint], selWidth, selHeight);
        expect(result).toEqual(expectedResult);
    });

    it('computeSquareCoords should properly set values with shortestSide equal to selHeight (-w, +h)', () => {
        const startPoint: Vec2 = {
            x: 600,
            y: 450,
        };
        const endPoint: Vec2 = {
            x: 450,
            y: 500,
        };
        const selWidth = -150;
        const selHeight = 50;
        const expectedResult = [
            { x: 400, y: 450 },
            { x: 450, y: 500 },
        ];
        const result = service.computeSquareCoords([startPoint, endPoint], selWidth, selHeight);
        expect(result).toEqual(expectedResult);
    });

    it('computeSquareCoords should properly set values with shortestSide equal to selHeight (+w, -h)', () => {
        const startPoint: Vec2 = {
            x: 500,
            y: 800,
        };
        const endPoint: Vec2 = {
            x: 550,
            y: 780,
        };
        const selWidth = 50;
        const selHeight = -20;
        const expectedResult = [
            { x: 500, y: 800 },
            { x: 520, y: 820 },
        ];
        const result = service.computeSquareCoords([startPoint, endPoint], selWidth, selHeight);
        expect(result).toEqual(expectedResult);
    });

    it('computeSquareCoords should properly set values with shortestSide equal to selWidth (+w, -h)', () => {
        const startPoint: Vec2 = {
            x: 500,
            y: 800,
        };
        const endPoint: Vec2 = {
            x: 750,
            y: 500,
        };
        const selWidth = 250;
        const selHeight = -300;
        const expectedResult = [
            { x: 500, y: 250 },
            { x: 750, y: 500 },
        ];
        const result = service.computeSquareCoords([startPoint, endPoint], selWidth, selHeight);
        expect(result).toEqual(expectedResult);
    });

    it('computeSquareCoords should properly set values with shortestSide equal to selWidth (-w, +h)', () => {
        const startPoint: Vec2 = {
            x: 500,
            y: 800,
        };
        const endPoint: Vec2 = {
            x: 750,
            y: 500,
        };
        const selWidth = 250;
        const selHeight = -300;
        const expectedResult = [
            { x: 500, y: 250 },
            { x: 750, y: 500 },
        ];
        const result = service.computeSquareCoords([startPoint, endPoint], selWidth, selHeight);
        expect(result).toEqual(expectedResult);
    });

    it('addScalarToVec2 should correctly return sum', () => {
        const start = {
            x: 50,
            y: 75,
        };
        const expectedPoint = {
            x: 100,
            y: 125,
        };
        const scalar = 50;
        expect(service['addScalarToVec2'](start, scalar)).toEqual(expectedPoint);
    });

    it('addScalarToVec2 should correctly return sum', () => {
        const start = {
            x: 50,
            y: 75,
        };
        const expectedPoint = {
            x: 0,
            y: 25,
        };
        const scalar = -50;
        expect(service['addScalarToVec2'](start, scalar)).toEqual(expectedPoint);
    });

    it('clearCorners should clear service.cornerCoords', () => {
        const startPoint = { x: 250, y: 500 };
        const endPoint = { x: 300, y: 600 };
        const expectedPoint = { x: 0, y: 0 };
        const result = service.clearCorners([startPoint, endPoint]);
        expect(result).toEqual([expectedPoint, expectedPoint]);
    });

    it('onToolChange should set resizeHandlerService.inUse to false', () => {
        service.resizerHandlerService.inUse = true;
        service.onToolChange();
        expect(service.resizerHandlerService.inUse).toBeFalse();
    });

    it('resetAllCanvasState should call resetCanvasState for all canvases', () => {
        const resetCanvasStateSpy = spyOn(service, 'resetCanvasState');
        service.resetAllCanvasState();
        expect(resetCanvasStateSpy).toHaveBeenCalledWith(selectionCtxStub.canvas);
        expect(resetCanvasStateSpy).toHaveBeenCalledWith(previewCtxStub.canvas);
    });
});
