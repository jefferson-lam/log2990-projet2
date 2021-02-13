import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as LineConstants from '@app/constants/line-constants';
import { DrawingService } from '../drawing/drawing.service';
import { LineService } from './line-service';

// tslint:disable:no-any
fdescribe('LineService', () => {
    let service: LineService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    let rotateLineSpy: jasmine.Spy<any>;

    let getImageDataSpy: jasmine.Spy<any>;
    let putImageDataSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(LineService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        rotateLineSpy = spyOn<any>(service, 'rotateLine').and.callThrough();

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.callThrough();
        putImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'putImageData').and.callThrough();

        service.linePathData = [
            { x: 133, y: 256 },
            { x: 257, y: 399 },
        ];
        service.mousePosition = { x: 289, y: 400 };
        service.initialPoint = { x: 394, y: 432 };

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseClick should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseClick(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it('on escape keyboard down event should set internal attribute isEscapeKeyDown to true if user is drawing', () => {
        const escapeKeyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;

        service.isDrawing = true;
        service.onKeyboardDown(escapeKeyboardEvent);
        expect(service.isEscapeKeyDown).toBeTruthy();
    });

    it('on escape keyboard up should cancel the line currently being drawn', () => {
        const escapeKeyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;

        service.isDrawing = true;
        service.isEscapeKeyDown = true;
        service.onKeyboardUp(escapeKeyboardEvent);
        expect(service.isBackspaceKeyDown).toBeFalsy();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('on backspace keyboard down should set internal attribute isBackspaceDown to true', () => {
        const backspaceKeyboardEvent = {
            key: 'Backspace',
        } as KeyboardEvent;
        service.isDrawing = true;
        service.onKeyboardDown(backspaceKeyboardEvent);
        expect(service.isBackspaceKeyDown).toBeTruthy();
    });

    it('on backspace keyboard up should restore the state of the canvas to delete the last drawn line', () => {
        const backspaceKeyboardEvent = {
            key: 'Backspace',
        } as KeyboardEvent;
        service.isDrawing = true;
        service.isBackspaceKeyDown = true;
        service.canvasState = drawServiceSpy.baseCtx.getImageData(0, 0, 350, 350);
        service.onKeyboardUp(backspaceKeyboardEvent);
        expect(putImageDataSpy).toHaveBeenCalledWith(service.canvasState, 0, 0);
    });

    it('on shift keyboard down event should call rotate line if shift key is not down and is drawing', () => {
        const shiftKeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.shiftDown = false;
        service.isDrawing = true;
        service.onKeyboardDown(shiftKeyboardEvent);
        expect(rotateLineSpy).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('on shift keyboard down event should not rotateline if shift key is already pressed', () => {
        const shiftKeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.shiftDown = true;
        service.isDrawing = true;
        service.onKeyboardDown(shiftKeyboardEvent);
        expect(rotateLineSpy).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('on shift keyup should set preview line back to mouse position only if user is drawing', () => {
        const shiftKeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.isDrawing = true;
        service.shiftDown = true;
        service.onKeyboardUp(shiftKeyboardEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalledWith(previewCtxStub, [service.linePathData[0], service.mousePosition]);
    });

    it('on mouse click should start drawing if user has not started a drawing yet', () => {
        service.onMouseClick(mouseEvent);
        expect(service.isDrawing).toBeTruthy();
        expect(service.mouseDownCoord).toEqual({ x: 25, y: 25 });
        expect(service.linePathData[0]).toEqual({ x: 25, y: 25 });
    });

    it('on mouse click, canvas should save its state to allow undo', () => {
        service.isDrawing = true;
        service.onMouseClick(mouseEvent);
        expect(getImageDataSpy).toHaveBeenCalled();
    });

    it('on mouse click should draw a line to the mouse position when user has started a drawing', () => {
        service.isDrawing = true;
        service.onMouseClick(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
        expect(service.linePathData[0]).toEqual({ x: 257, y: 399 });
    });

    it('on mouse click, drawn line ending point should connect to initial point if distance is within 20px', () => {
        const mouseEvent = {
            offsetX: 399,
            offsetY: 425,
        } as MouseEvent;
        service.isDrawing = true;
        service.onMouseMove(mouseEvent);
        service.onMouseClick(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalledWith(previewCtxStub, [service.linePathData[0], service.initialPoint]);
    });

    it('on mouse dblclick should clear linePathData and stop drawing', () => {
        service.isDrawing = true;
        service.onMouseDoubleClick(mouseEvent);
        expect(service.linePathData).toEqual([]);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.isDrawing).toBeFalsy();
    });

    it('on mouse move should only draw on preview layer', () => {
        service.isDrawing = true;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalledWith(previewCtxStub, [
            { x: 133, y: 256 },
            { x: 25, y: 25 },
        ]);
    });

    /**
     * Test: calculateDistance
     * Cases, assuming dx = (currentPoint.x - initialPoint.x) and dy = (currentPoint.y - initialPoint.y)
     * 1. +dx, +dy
     * 2. +dx, -dy,
     * 3. -dx, +dy
     * 4. -dx, -dy
     */

    it('calculateDistance with +dx and +dy gives accurate euclidean distance', () => {
        const currentPoint = {
            x: 450,
            y: 500,
        } as Vec2;

        expect(Math.round(service.calculateDistance(service.initialPoint, currentPoint))).toEqual(88);
    });

    it('calculateDistance with +dx and -dy gives accurate euclidea distance', () => {
        const currentPoint = {
            x: 420,
            y: 350,
        } as Vec2;
        expect(Math.round(service.calculateDistance(service.initialPoint, currentPoint))).toEqual(86);
    });

    it('calculateDistance with -dx and +dy gives accurate euclidea distance', () => {
        const currentPoint = {
            x: 250,
            y: 500,
        } as Vec2;
        expect(Math.round(service.calculateDistance(service.initialPoint, currentPoint))).toEqual(159);
    });

    it('calculateDistance with -dx and -dy gives accurate euclidea distance', () => {
        const currentPoint = {
            x: 250,
            y: 190,
        } as Vec2;
        expect(Math.round(service.calculateDistance(service.initialPoint, currentPoint))).toEqual(282);
    });

    /**
     * Test: calculateAngle
     * Cases:
     * 1. 1st quadrant
     * 2. 2nd quadrant
     * 3. 3rd quadrant
     * 4. 4th quadrant
     * 5. 0 degrees
     * 6. 90 degrees
     * 7. 180 degrees
     * 8. 270 degrees
     * 9. same points
     */

    it('calculate length of rotated line with intercardinal degree angle returns correctly flattened line with correct length', () => {
        const initialPoint = {
            x: 255,
            y: 270,
        } as Vec2;

        const expectedPoint = {
            x: 303,
            y: 270,
        };
        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_135)).toEqual(expectedPoint);

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_45)).toEqual(expectedPoint);

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_315)).toEqual(expectedPoint);

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_225)).toEqual(expectedPoint);
    });

    it(' calculate length of rotated line with 270 degrees angle return correctly flattened line with correct length', () => {
        const initialPoint = {
            x: 130,
            y: 270,
        } as Vec2;

        const expectedPoint = {
            x: 260,
            y: 270,
        };

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_270)).toEqual(expectedPoint);

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_90)).toEqual(expectedPoint);
    });

    it('calculate length of rotated line with 180 degrees angle return correctly flattened line with correct length', () => {
        const initialPoint = {
            x: 130,
            y: 270,
        } as Vec2;

        const expectedPoint = {
            x: 289,
            y: 270,
        };

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_180)).toEqual(expectedPoint);

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_0)).toEqual(expectedPoint);
    });

    it('rotate with 45 degrees returns correct calculated value', () => {
        const initialPoint = {
            x: 130,
            y: 270,
        };

        const currentPoint = {
            x: 289,
            y: 270,
        };

        const expectedPoint = {
            x: 242,
            y: 158,
        };

        expect(service.rotateLine(initialPoint, currentPoint, LineConstants.DEGREES_45)).toEqual(expectedPoint);
    });

    it('rotate with 135 degrees returns correct calculated end point', () => {
        const initialPoint = {
            x: 130,
            y: 270,
        };

        const currentPoint = {
            x: 289,
            y: 270,
        };

        const expectedPoint = {
            x: 18,
            y: 158,
        };

        expect(service.rotateLine(initialPoint, currentPoint, LineConstants.DEGREES_135)).toEqual(expectedPoint);
    });

    it('rotate with 225 degrees returns correct calculated end point', () => {
        const initialPoint = {
            x: 130,
            y: 270,
        };

        const currentPoint = {
            x: 289,
            y: 270,
        };

        const expectedPoint = {
            x: 18,
            y: 382,
        };

        expect(service.rotateLine(initialPoint, currentPoint, LineConstants.DEGREES_225)).toEqual(expectedPoint);
    });

    it('rotate with 315 degrees returns correct calculated end point', () => {
        const initialPoint = {
            x: 130,
            y: 270,
        };

        const currentPoint = {
            x: 289,
            y: 270,
        };

        const expectedPoint = {
            x: 242,
            y: 382,
        };

        expect(service.rotateLine(initialPoint, currentPoint, LineConstants.DEGREES_315)).toEqual(expectedPoint);
    });
});
