import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { END_INDEX, START_INDEX } from '@app/constants/ellipse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { RectangleSelectionService } from './rectangle-selection-service';

describe('RectangleSelectionService', () => {
    let service: RectangleSelectionService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectionCtxStub: CanvasRenderingContext2D;
    let parentMouseDownSpy: jasmine.Spy;
    let parentMouseUpSpy: jasmine.Spy;
    let parentKeyboardDownSpy: jasmine.Spy;
    let parentKeyboardUpSpy: jasmine.Spy;
    let parentMouseLeaveSpy: jasmine.Spy;
    let parentMouseEnterSpy: jasmine.Spy;

    let baseCtxDrawImageSpy: jasmine.Spy<any>;
    let baseCtxClearRectSpy: jasmine.Spy<any>;
    let selectionCtxDrawImageSpy: jasmine.Spy<any>;
    let selectionCtxFillRectSpy: jasmine.Spy<any>;

    let executeSpy: jasmine.Spy;
    let undoRedoService: UndoRedoService;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectionCtxStub = canvasTestHelper.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(RectangleSelectionService);
        undoRedoService = TestBed.inject(UndoRedoService);
        executeSpy = spyOn(undoRedoService, 'executeCommand');

        // Configuration of spy of service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].selectionCtx = selectionCtxStub;
        service['drawingService'].selectionCanvas = canvasTestHelper.selectionCanvas;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        parentMouseDownSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(service)), 'onMouseDown');
        parentMouseUpSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(service)), 'onMouseUp');
        parentKeyboardDownSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(service)), 'onKeyboardDown');
        parentKeyboardUpSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(service)), 'onKeyboardUp');
        parentMouseLeaveSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(service)), 'onMouseLeave');
        parentMouseEnterSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(service)), 'onMouseEnter');

        baseCtxDrawImageSpy = spyOn<any>(baseCtxStub, 'drawImage').and.callThrough();
        baseCtxClearRectSpy = spyOn<any>(baseCtxStub, 'clearRect').and.callThrough();
        selectionCtxDrawImageSpy = spyOn<any>(selectionCtxStub, 'drawImage').and.callThrough();
        selectionCtxFillRectSpy = spyOn<any>(selectionCtxStub, 'fillRect').and.callThrough();

        mouseEvent = {
            offsetX: 25,
            offsetY: 40,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should should set inUse to true', () => {
        service.onMouseDown(mouseEvent);
        expect(service.inUse).toBeTruthy();
        expect(parentMouseDownSpy).toHaveBeenCalled();
    });

    it('mouseDown while manipulating is true should call draw on selectionCanvas', () => {
        const expectedResult: Vec2 = { x: 25, y: 40 };
        service.inUse = false;
        service.isManipulating = true;
        service.onMouseDown(mouseEvent);
        expect(executeSpy).toHaveBeenCalled();
        expect(service.isManipulating).toBeFalsy();
        expect(service.cornerCoords[START_INDEX]).toEqual(expectedResult);
    });

    it('onMouseUp should pass if tool not inUse', () => {
        expect((): void => {
            service.onMouseUp(mouseEvent);
        }).not.toThrow();
    });

    it('onMouseUp should draw to selectionLayer', () => {
        const mouseUpEvent: MouseEvent = {
            offsetX: 150,
            offsetY: 200,
            button: 0,
        } as MouseEvent;
        const expectedEndVec2: Vec2 = { x: 150, y: 200 };
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseUpEvent);
        expect(service.rectangleService.inUse).toBeFalsy();
        expect(parentMouseUpSpy).toHaveBeenCalled();
        expect(service.cornerCoords[END_INDEX]).toEqual(expectedEndVec2);
    });

    it('onMouseUp should return if selectionW and selectionH are 0', () => {
        const startPoint: Vec2 = {
            x: 250,
            y: 250,
        };
        const endPoint: Vec2 = {
            x: 250,
            y: 300,
        };
        service.inUse = true;
        service.cornerCoords = [startPoint, endPoint];
        service.onMouseUp(mouseEvent);
        expect(service.inUse).toBeFalsy();
    });

    it('onMouseUp should return if selectionW and selectionH are 0', () => {
        const startPoint: Vec2 = {
            x: 250,
            y: 250,
        };
        const endPoint: Vec2 = {
            x: 300,
            y: 250,
        };
        service.inUse = true;
        service.cornerCoords = [startPoint, endPoint];
        service.onMouseUp(mouseEvent);
        expect(service.inUse).toBeFalsy();
        expect(service.onMouseUp(mouseEvent)).toBe(undefined);
    });

    it('onMouseLeave should call parents onMouseLeave', () => {
        service.inUse = true;
        service.onMouseLeave(mouseEvent);
        expect(parentMouseLeaveSpy).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseEnter should call parents onMouseEnter', () => {
        service.inUse = true;
        service.onMouseEnter(mouseEvent);
        expect(parentMouseEnterSpy).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseMove should update cornerCoords', () => {
        const expectedResult: Vec2 = {
            x: 25,
            y: 40,
        };
        service.inUse = true;
        service.onMouseMove(mouseEvent);
        expect(service.cornerCoords[END_INDEX]).toEqual(expectedResult);
    });

    it('onMouseMove should pass if not inUse', () => {
        expect((): void => {
            service.onMouseMove(mouseEvent);
        }).not.toThrow();
    });

    it('onKeyboardDown should call parents onKeyboardDown event', () => {
        const shiftKeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.onKeyboardDown(shiftKeyboardEvent);
        expect(parentKeyboardDownSpy).toHaveBeenCalled();
    });

    it('onKeyboardDown with shift key should set values to true', () => {
        const shiftKeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.inUse = true;
        service.onKeyboardDown(shiftKeyboardEvent);
        expect(service.isSquare).toBeTruthy();
        expect(service.isShiftDown).toBeTruthy();
    });

    it('onKeyboardDown while inUse with esc key should set values to true', () => {
        const escKeyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;
        service.inUse = true;
        service.onKeyboardDown(escKeyboardEvent);
        expect(service.isEscapeDown).toBeTruthy();
    });

    it('onKeyboardDown while isManipulating with Esc key should set values to true', () => {
        const escKeyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;
        service.isManipulating = true;
        service.onKeyboardDown(escKeyboardEvent);
        expect(service.isEscapeDown).toBeTruthy();
    });

    it('onKeyboardUp should call parents onKeyboardUp event', () => {
        const shiftKeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.onKeyboardUp(shiftKeyboardEvent);
        expect(parentKeyboardUpSpy).toHaveBeenCalled();
    });

    it('onKeyboardUp inUse should set shift values to false', () => {
        const shiftKeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.isShiftDown = true;
        service.inUse = true;
        service.onKeyboardUp(shiftKeyboardEvent);
        expect(service.isSquare).toBeFalsy();
        expect(service.isShiftDown).toBeFalsy();
    });

    it('onKeyboardUp inUse should reset canvas state if esc is called', () => {
        const escKeyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;
        service.inUse = true;
        service.isEscapeDown = true;
        service.onKeyboardUp(escKeyboardEvent);
        expect(service.inUse).toBeFalsy();
        expect(service.isEscapeDown).toBeFalsy();
    });

    it('onKeyboardUp isManipulating should set esc values', () => {
        const escKeyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;
        service.isManipulating = true;
        service.isEscapeDown = true;
        service.cornerCoords = [
            { x: 25, y: 40 },
            { x: 100, y: 250 },
        ];
        service.onKeyboardUp(escKeyboardEvent);
        expect(baseCtxDrawImageSpy).toHaveBeenCalled();
        expect(service.isManipulating).toBeFalsy();
        expect(service.isEscapeDown).toBeFalsy();
    });

    it('selectAll should correctly set selectionWidth and selectionHeight', () => {
        const expectedWidth = 100;
        const expectedHeight = 100;
        service.selectAll();
        expect(service.selectionHeight).toEqual(expectedHeight);
        expect(service.selectionWidth).toEqual(expectedWidth);
    });

    it('selectAll should correctly selectionCanvas height and width', () => {
        const expectedWidth = 100;
        const expectedHeight = 100;
        service.selectAll();
        expect(canvasTestHelper.selectionCanvas.width).toEqual(expectedWidth);
        expect(canvasTestHelper.selectionCanvas.height).toEqual(expectedHeight);
    });

    it('selectAll should fillRect with white', () => {
        service.selectAll();
        expect(selectionCtxStub.fillStyle).toEqual('#ffffff');
        expect(selectionCtxFillRectSpy).toHaveBeenCalled();
        expect(selectionCtxDrawImageSpy).toHaveBeenCalled();
    });

    it('selectAll should clearRect on baseCanvas', () => {
        service.selectAll();
        expect(baseCtxClearRectSpy).toHaveBeenCalled();
    });

    it('selectAll should set selectionCanvas left and top back to default values', () => {
        service.selectAll();
        expect(canvasTestHelper.selectionCanvas.style.left).toEqual('0px');
        expect(canvasTestHelper.selectionCanvas.style.top).toEqual('0px');
        expect(service.cornerCoords).toEqual([
            { x: 0, y: 0 },
            { x: service.selectionWidth, y: service.selectionHeight },
        ]);
        expect(service.inUse).toBeFalsy();
        expect(service.isManipulating).toBeTruthy();
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
        service.cornerCoords = [startPoint, endPoint];
        service.selectionHeight = selHeight;
        service.selectionWidth = selWidth;
        service.validateCornerCoords();
        expect(service.cornerCoords).toEqual(expectedResult);
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
            { x: 150, y: 400 },
        ];
        service.cornerCoords = [startPoint, endPoint];
        service.selectionHeight = selHeight;
        service.selectionWidth = selWidth;
        service.validateCornerCoords();
        expect(service.cornerCoords).toEqual(expectedResult);
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
            { x: 150, y: 200 },
        ];
        service.cornerCoords = [startPoint, endPoint];
        service.selectionHeight = selHeight;
        service.selectionWidth = selWidth;
        service.validateCornerCoords();
        expect(service.cornerCoords).toEqual(expectedResult);
    });

    it('validateCorneCoords should properly set values (+w, +h)', () => {
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
        service.cornerCoords = [startPoint, endPoint];
        service.selectionHeight = selHeight;
        service.selectionWidth = selWidth;
        service.validateCornerCoords();
        expect(service.cornerCoords).toEqual(expectedResult);
    });

    it('clearCorners should clear service.cornerCoords', () => {
        const startPoint = { x: 250, y: 500 };
        const endPoint = { x: 300, y: 600 };
        const expectedPoint = { x: 0, y: 0 };
        service.cornerCoords = [startPoint, endPoint];
        service.clearCorners();
        expect(service.cornerCoords).toEqual([expectedPoint, expectedPoint]);
    });
});
