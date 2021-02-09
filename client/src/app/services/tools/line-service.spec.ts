import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '../drawing/drawing.service';
import { LineService } from './line-service';

describe('LineService', () => {
    let service: LineService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    let rotateLineSpy: jasmine.Spy<any>;

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
        // tslint:enable:no-string-literal
        service.linePathData = [
            { x: 133, y: 256 },
            { x: 257, y: 399 },
        ];
        service.mousePosition = { x: 289, y: 400 };

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

    it('on mouse click should draw a line to the mouse position when user has started a drawing', () => {
        service.isDrawing = true;
        service.onMouseClick(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
        expect(service.linePathData[0]).toEqual({ x: 257, y: 399 });
    });

    it('on mouse dblclick should clear linePathData and stop drawing', () => {
        service.isDrawing = true;
        service.onMouseDoubleClick(mouseEvent);
        expect(service.linePathData).toEqual([]);
        expect(service.isDrawing).not.toBeTruthy();
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

    it(' calculate length of rotated line with intercardinal degree angle returns correctly flattened line with correct length', () => {
        const initialPoint = {
            x: 255,
            y: 270,
        } as Vec2;
        const expectedPoint = {
            x: 303,
            y: 270,
        };
        // @ts-ignore
        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, 135)).toEqual(expectedPoint);

        // @ts-ignore
        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, 45)).toEqual(expectedPoint);

        // @ts-ignore
        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, 315)).toEqual(expectedPoint);

        // @ts-ignore
        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, 225)).toEqual(expectedPoint);
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
        // @ts-ignore
        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, 270)).toEqual(expectedPoint);

        // @ts-ignore
        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, 90)).toEqual(expectedPoint);
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

        // @ts-ignore
        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, 180)).toEqual(expectedPoint);

        // @ts-ignore
        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, 0)).toEqual(expectedPoint);
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

        // @ts-ignore
        expect(service.rotateLine(initialPoint, currentPoint, 45)).toEqual(expectedPoint);
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

        // @ts-ignore
        expect(service.rotateLine(initialPoint, currentPoint, 135)).toEqual(expectedPoint);
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

        // @ts-ignore
        expect(service.rotateLine(initialPoint, currentPoint, 225)).toEqual(expectedPoint);
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

        // @ts-ignore
        expect(service.rotateLine(initialPoint, currentPoint, 315)).toEqual(expectedPoint);
    });
});
