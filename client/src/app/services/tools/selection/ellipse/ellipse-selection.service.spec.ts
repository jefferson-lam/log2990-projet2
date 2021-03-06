import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { ROTATION } from '@app/constants/ellipse-constants';
import { MouseButton } from '@app/constants/mouse-constants';
import { DRAWN_ELLIPSE_RADIUS_OFFSET, END_INDEX, START_INDEX } from '@app/constants/selection-constants';
import { END_ANGLE, START_ANGLE } from '@app/constants/shapes-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { EllipseSelectionService } from './ellipse-selection-service';

// tslint:disable:max-file-line-count
// tslint:disable: no-any
describe('EllipseToolSelectionService', () => {
    let service: EllipseSelectionService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let resizerHandlerServiceSpy: jasmine.SpyObj<ResizerHandlerService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectionCtxStub: CanvasRenderingContext2D;
    let borderCtxStub: CanvasRenderingContext2D;
    let parentMouseDownSpy: jasmine.Spy;
    let parentMouseUpSpy: jasmine.Spy;
    let parentKeyboardDownSpy: jasmine.Spy;
    let parentKeyboardUpSpy: jasmine.Spy;
    let parentMouseLeaveSpy: jasmine.Spy;
    let parentMouseEnterSpy: jasmine.Spy;

    let resetCanvasStateSpy: jasmine.Spy;
    let clipEllipseSpy: jasmine.Spy;
    let baseCtxDrawImage: jasmine.Spy;
    let baseCtxEllipseSpy: jasmine.Spy;
    let baseCtxFillSpy: jasmine.Spy;
    let baseCtxClipSpy: jasmine.Spy;
    let selectionCtxEllipseSpy: jasmine.Spy;
    let selectionCtxStrokeSpy: jasmine.Spy;

    let executeSpy: jasmine.Spy;
    let undoRedoService: UndoRedoService;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        resizerHandlerServiceSpy = jasmine.createSpyObj('ResizerHandlerService', ['resetResizers', 'setResizerPositions']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ResizerHandlerService, useValue: resizerHandlerServiceSpy },
            ],
        });
        service = TestBed.inject(EllipseSelectionService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        undoRedoService = TestBed.inject(UndoRedoService);
        executeSpy = spyOn(undoRedoService, 'executeCommand');

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectionCtxStub = canvasTestHelper.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;
        borderCtxStub = canvasTestHelper.borderCanvas.getContext('2d') as CanvasRenderingContext2D;

        // Configuration of spy of service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].selectionCtx = selectionCtxStub;
        service['drawingService'].borderCtx = borderCtxStub;
        service['drawingService'].selectionCanvas = canvasTestHelper.selectionCanvas;
        service['drawingService'].canvas = canvasTestHelper.canvas;
        service['drawingService'].previewSelectionCanvas = canvasTestHelper.previewSelectionCanvas;
        service['drawingService'].borderCanvas = canvasTestHelper.borderCanvas;

        parentMouseDownSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(service)), 'onMouseDown');
        parentMouseUpSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(service)), 'onMouseUp');
        parentKeyboardDownSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(service)), 'onKeyboardDown');
        parentKeyboardUpSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(service)), 'onKeyboardUp');
        parentMouseLeaveSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(service)), 'onMouseLeave');
        parentMouseEnterSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(service)), 'onMouseEnter');

        clipEllipseSpy = spyOn<any>(service, 'clipEllipse').and.callThrough();
        baseCtxDrawImage = spyOn(baseCtxStub, 'drawImage').and.callThrough();
        baseCtxEllipseSpy = spyOn(baseCtxStub, 'ellipse').and.callThrough();
        baseCtxFillSpy = spyOn(baseCtxStub, 'fill').and.callThrough();
        baseCtxClipSpy = spyOn(baseCtxStub, 'clip').and.callThrough();
        resetCanvasStateSpy = spyOn(service, 'resetCanvasState').and.callThrough();
        selectionCtxEllipseSpy = spyOn(selectionCtxStub, 'ellipse').and.callThrough();
        selectionCtxStrokeSpy = spyOn(selectionCtxStub, 'stroke').and.callThrough();

        const offsetX = 25;
        mouseEvent = {
            x: offsetX + CanvasConstants.LEFT_MARGIN,
            y: 40,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('mouseDown should should set inUse to true', () => {
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
        expect(resizerHandlerServiceSpy.resetResizers).toHaveBeenCalled();
        expect(service.isManipulating).toBeFalsy();
        expect(service.pathData[START_INDEX]).toEqual(expectedResult);
    });

    it('onMouseDown should pass if not mouseleft, nor manipulating', () => {
        const rightMouseEvent = {
            button: MouseButton.Right,
        } as MouseEvent;
        service.isManipulating = false;
        expect(() => {
            service.onMouseDown(rightMouseEvent);
        }).not.toThrow();
    });

    it('onMouseUp should pass if tool not inUse', () => {
        expect((): void => {
            service.onMouseUp(mouseEvent);
        }).not.toThrow();
    });

    it('onMouseUp should draw to selectionLayer', () => {
        const offsetX = 150;
        const mouseUpEvent: MouseEvent = {
            x: offsetX + CanvasConstants.LEFT_MARGIN,
            y: 200,
            button: 0,
        } as MouseEvent;
        const expectedEndVec2: Vec2 = { x: 100, y: 100 };
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseUpEvent);
        expect(service.ellipseService.inUse).toBeFalsy();
        expect(parentMouseUpSpy).toHaveBeenCalled();
        expect(service.pathData[END_INDEX]).toEqual(expectedEndVec2);
    });

    it('onMouseUp should return if selectionW is 0', () => {
        const startPoint: Vec2 = {
            x: 25,
            y: 250,
        };
        service.inUse = true;
        service.pathData[START_INDEX] = startPoint;
        service.onMouseUp(mouseEvent);
        expect(service.inUse).toBeFalsy();
    });

    it('onMouseUp should return if selectionH is 0', () => {
        const startPoint: Vec2 = {
            x: 250,
            y: 40,
        };
        service.inUse = true;
        service.pathData[START_INDEX] = startPoint;
        service.onMouseUp(mouseEvent);
        expect(service.inUse).toBeFalsy();
        expect(service.onMouseUp(mouseEvent)).toBe(undefined);
    });

    it('onMouseUp should calculate correct selectionH and selectionW if isCircle is true', () => {
        const startPoint: Vec2 = {
            x: 250,
            y: 250,
        };
        const expectedCircleDiameter = 210;
        service.inUse = true;
        service.isCircle = true;
        service.pathData[START_INDEX] = startPoint;
        service.onMouseUp(mouseEvent);
        expect(service.selectionHeight).toEqual(expectedCircleDiameter);
        expect(service.selectionWidth).toEqual(expectedCircleDiameter);
    });

    it('onMouseUp should set appropriate size and position to selectionCanvas', () => {
        const startPoint: Vec2 = {
            x: 250,
            y: 250,
        };
        const expectedWidth = 225;
        const expectedHeight = 210;
        service.inUse = true;
        service.pathData[START_INDEX] = startPoint;
        service.onMouseUp(mouseEvent);
        expect(drawServiceSpy.selectionCanvas.width).toEqual(expectedWidth);
        expect(drawServiceSpy.selectionCanvas.height).toEqual(expectedHeight);
        expect(drawServiceSpy.selectionCanvas.style.left).toEqual('25px');
        expect(drawServiceSpy.selectionCanvas.style.top).toEqual('40px');
        expect(drawServiceSpy.borderCanvas.style.left).toEqual(drawServiceSpy.selectionCanvas.style.left);
        expect(drawServiceSpy.borderCanvas.style.top).toEqual(drawServiceSpy.selectionCanvas.style.top);
        expect(resizerHandlerServiceSpy.setResizerPositions).toHaveBeenCalled();
        expect(service.inUse).toBeFalsy();
        expect(service.isManipulating).toBeTruthy();
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

    it('onMouseMove should update pathData', () => {
        const expectedResult: Vec2 = {
            x: 25,
            y: 40,
        };
        service.inUse = true;
        service.onMouseMove(mouseEvent);
        expect(service.pathData[END_INDEX]).toEqual(expectedResult);
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
        expect(service.isCircle).toBeTruthy();
        expect(service['isShiftDown']).toBeTruthy();
    });

    it('onKeyboardDown inUse with shift should not call if isShiftDown is true', () => {
        service['isShiftDown'] = true;
        service.inUse = true;
        service.onKeyboardDown({ key: 'Shift' } as KeyboardEvent);
        expect(service['isShiftDown']).toBeTruthy();
        expect(service.isCircle).toBeFalsy();
    });

    it('onKeyboardDown inUse with shift should not call if isShiftDown is true', () => {
        service.isManipulating = true;
        service.isEscapeDown = true;
        service.onKeyboardDown({ key: 'Escape' } as KeyboardEvent);
        expect(service.isEscapeDown).toBeTruthy();
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

    it('onKeyboardUp should pass if inUse and isManipulating is false', () => {
        expect(() => {
            service.onKeyboardUp({} as KeyboardEvent);
        }).not.toThrow();
    });

    it('onKeyboardUp inUse should set shift values to false', () => {
        const shiftKeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service['isShiftDown'] = true;
        service.inUse = true;
        service.onKeyboardUp(shiftKeyboardEvent);
        expect(service.isCircle).toBeFalsy();
        expect(service['isShiftDown']).toBeFalsy();
    });

    it('onKeyboardUp inUse with shift key should not call if shiftDown is false', () => {
        service['isShiftDown'] = false;
        service.inUse = true;
        service.onKeyboardUp({ key: 'Shift' } as KeyboardEvent);
        expect(service['isShiftDown']).toBeFalsy();
    });

    it('onKeyboardUp inUse with esc key and isEscapeDown true should call appropriate functions', () => {
        service.inUse = true;
        service.isEscapeDown = true;
        service.onKeyboardUp({ key: 'Escape' } as KeyboardEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledWith(previewCtxStub);
        expect(service.inUse).toBeFalsy();
        expect(service.isEscapeDown).toBeFalsy();
    });

    it('onKeyboardUp inUse with esc key should not call if isEscapeDown is false', () => {
        service.isEscapeDown = false;
        service.inUse = true;
        service.onKeyboardUp({ key: 'Escape' } as KeyboardEvent);
        expect(service.isEscapeDown).toBeFalsy();
    });

    it('onKeyboardUp isManipulating should set esc values', () => {
        const escKeyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;
        service.isManipulating = true;
        service.isEscapeDown = true;
        service.pathData = [
            { x: 25, y: 40 },
            { x: 100, y: 250 },
        ];
        service.onKeyboardUp(escKeyboardEvent);
        expect(service.isManipulating).toBeFalsy();
        expect(resizerHandlerServiceSpy.resetResizers).toHaveBeenCalled();
        expect(service.isEscapeDown).toBeFalsy();
    });

    it('onKeyboardUp isManiputing should not call if isEscapeDown is false', () => {
        service.isEscapeDown = false;
        service.isManipulating = true;
        service.onKeyboardUp({ key: 'Escape' } as KeyboardEvent);
        expect(service.isEscapeDown).toBeFalsy();
    });

    it('onToolEnter should call parents onToolEnter', () => {
        const parentOnToolEnterSpy = spyOn(Object.getPrototypeOf(Object.getPrototypeOf(service)), 'onToolEnter');
        service.onToolEnter();
        expect(parentOnToolEnterSpy).toHaveBeenCalled();
    });

    it('onToolChange should call onMouseDown if isManipulating is true', () => {
        service.isManipulating = true;
        const confirmSelectionSpy = spyOn(service, 'confirmSelection');
        service.onToolChange();
        expect(confirmSelectionSpy).toHaveBeenCalled();
    });

    it('onToolChange should call onKeyboardUp with escape if inUse is true', () => {
        service.isManipulating = false;
        service.inUse = true;
        const onKeyboardUpSpy = spyOn(service, 'onKeyboardUp');
        service.onToolChange();
        expect(onKeyboardUpSpy).toHaveBeenCalled();
        expect(service.isEscapeDown).toBeTrue();
    });

    it('onToolChange should not do anything if isManipulating and inUse are false', () => {
        service.isManipulating = false;
        service.inUse = false;
        const onMouseDownSpy = spyOn(service, 'onMouseDown');
        const onKeyboardUpSpy = spyOn(service, 'onKeyboardUp');
        service.onToolChange();
        expect(onMouseDownSpy).not.toHaveBeenCalled();
        expect(onKeyboardUpSpy).not.toHaveBeenCalled();
    });

    it('fillEllipse should fill ellipse on ctx with correct params', () => {
        const expectedStartX = 62.5;
        const expectedStartY = 145;
        const expectedXRadius = 37.5;
        const expectedYRadius = 105;
        service.pathData = [
            { x: 25, y: 40 },
            { x: 100, y: 250 },
        ];
        service['fillEllipse'](baseCtxStub, service.pathData, false);
        expect(baseCtxEllipseSpy).toHaveBeenCalled();
        expect(baseCtxEllipseSpy).toHaveBeenCalledWith(
            expectedStartX,
            expectedStartY,
            expectedXRadius,
            expectedYRadius,
            ROTATION,
            START_ANGLE,
            END_ANGLE,
        );
        expect(baseCtxFillSpy).toHaveBeenCalled();
    });

    it('clipEllipse should clip ellipse on ctx with correct params', () => {
        const expectedStartX = 62.5;
        const expectedStartY = 145;
        const expectedXRadius = 37.5;
        const expectedYRadius = 105;
        const sw = 75;
        const sh = 210;
        service.pathData = [
            { x: 25, y: 40 },
            { x: 100, y: 250 },
        ];
        service.selectionWidth = sw;
        service.selectionHeight = sh;
        service['clipEllipse'](baseCtxStub, service.pathData[0], 0);
        expect(baseCtxEllipseSpy).toHaveBeenCalled();
        expect(baseCtxEllipseSpy).toHaveBeenCalledWith(
            expectedStartX,
            expectedStartY,
            expectedXRadius,
            expectedYRadius,
            ROTATION,
            START_ANGLE,
            END_ANGLE,
        );
        expect(baseCtxClipSpy).toHaveBeenCalled();
    });

    it('drawOutlineEllipse should stroke ellipse with correct params and set correct path', () => {
        const expectedStartX = 62.5;
        const expectedStartY = 145;
        const xRadius = 37.5;
        const yRadius = 105;
        const expectedXRadius = xRadius + DRAWN_ELLIPSE_RADIUS_OFFSET;
        const expectedYRadius = yRadius + DRAWN_ELLIPSE_RADIUS_OFFSET;
        service['drawOutlineEllipse'](selectionCtxStub, { x: expectedStartX, y: expectedStartY }, { x: xRadius, y: yRadius });
        expect(selectionCtxEllipseSpy).toHaveBeenCalled();
        expect(selectionCtxEllipseSpy).toHaveBeenCalledWith(
            expectedStartX,
            expectedStartY,
            expectedXRadius,
            expectedYRadius,
            ROTATION,
            START_ANGLE,
            END_ANGLE,
        );
        expect(selectionCtxStrokeSpy).toHaveBeenCalled();
    });

    it('undoSelection should pass if isManipulating is false', () => {
        service.isManipulating = false;
        expect(() => {
            service.undoSelection();
        }).not.toThrow();
    });

    it('undoSelection should call appropriate functions to restore state', () => {
        const sw = 75;
        const sh = 210;
        const firstPoint = { x: 25, y: 40 };
        service.isManipulating = true;
        service.pathData = Object.assign([], [firstPoint, { x: 100, y: 250 }]);
        service.selectionWidth = sw;
        service.selectionHeight = sh;
        service.undoSelection();
        expect(clipEllipseSpy).toHaveBeenCalled();
        expect(baseCtxDrawImage).toHaveBeenCalledWith(
            service.originalImageCanvas,
            0,
            0,
            service.selectionWidth,
            service.selectionHeight,
            firstPoint.x,
            firstPoint.y,
            service.selectionWidth,
            service.selectionHeight,
        );
        expect(resetCanvasStateSpy).toHaveBeenCalledWith(selectionCtxStub.canvas);
        expect(service.isManipulating).toBeFalsy();
        expect(service.isEscapeDown).toBeFalsy();
    });

    it('undoSelection should not call drawImage when isFromClipboard is true', () => {
        const sw = 75;
        const sh = 210;
        service.isManipulating = true;
        service.pathData = [
            { x: 25, y: 40 },
            { x: 100, y: 250 },
        ];
        service.selectionWidth = sw;
        service.selectionHeight = sh;
        service.isFromClipboard = true;
        service.undoSelection();
        expect(clipEllipseSpy).toHaveBeenCalled();
        expect(baseCtxDrawImage).not.toHaveBeenCalled();
        expect(resetCanvasStateSpy).toHaveBeenCalledWith(selectionCtxStub.canvas);
        expect(service.isManipulating).toBeFalsy();
        expect(service.isEscapeDown).toBeFalsy();
    });
});
