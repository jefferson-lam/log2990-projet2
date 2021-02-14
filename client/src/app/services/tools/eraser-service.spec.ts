import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as EraserConstants from '@app/constants/eraser-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from './eraser-service';

// tslint:disable:no-any
describe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let eraseSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EraserService);
        eraseSpy = spyOn<any>(service, 'erase').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseConstants.MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it('mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it('mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseConstants.MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it('onMouseUp should call erase if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service['pathData'].push(service.mouseDownCoord);
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(eraseSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call erase if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(eraseSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call erase if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service['pathData'].push(service.mouseDownCoord);
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(eraseSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call erase if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(eraseSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call moveCursor', () => {
        const moveCursorSpy = spyOn<any>(service, 'moveCursor').and.callThrough();
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(moveCursorSpy).toHaveBeenCalled();
    });

    it('getCorners of positive vector coordinates product returns bottom left and top right corners', () => {
        const cornersSpy = spyOn<any>(service, 'getCorners').and.callThrough();
        const pathStub = [
            { x: 5, y: 5 },
            { x: 10, y: 10 },
        ] as Vec2[];
        service.size = 2;
        const corners: Vec2[] = service['getCorners'](pathStub[pathStub.length - 1], pathStub[pathStub.length - 2]);
        const expectedCorners = [
            { x: 4, y: 6 },
            { x: 6, y: 4 },
            { x: 9, y: 11 },
            { x: 11, y: 9 },
        ] as Vec2[];

        expect(cornersSpy).toHaveBeenCalled();
        expect(cornersSpy).toHaveBeenCalledWith(pathStub[pathStub.length - 1], pathStub[pathStub.length - 2]);
        expect(corners).toEqual(expectedCorners);
    });

    it('getCorners of negative vector coordinates product returns bottom right and top left corners', () => {
        const cornersSpy = spyOn<any>(service, 'getCorners').and.callThrough();
        const pathStub = [
            { x: 5, y: 10 },
            { x: 10, y: 5 },
        ] as Vec2[];
        service.size = 2;
        const corners: Vec2[] = service['getCorners'](pathStub[pathStub.length - 1], pathStub[pathStub.length - 2]);
        const expectedCorners = [
            { x: 6, y: 11 },
            { x: 4, y: 9 },
            { x: 11, y: 6 },
            { x: 9, y: 4 },
        ] as Vec2[];

        expect(cornersSpy).toHaveBeenCalled();
        expect(cornersSpy).toHaveBeenCalledWith(pathStub[pathStub.length - 1], pathStub[pathStub.length - 2]);
        expect(corners).toEqual(expectedCorners);
    });

    it('erase should call canvas functions', () => {
        const pathStub = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ] as Vec2[];
        const beginSpy = spyOn(baseCtxStub, 'beginPath').and.callThrough();
        const moveToSpy = spyOn(baseCtxStub, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(baseCtxStub, 'lineTo').and.callThrough();
        const closeSpy = spyOn(baseCtxStub, 'closePath').and.callThrough();
        const fillSpy = spyOn(baseCtxStub, 'fill').and.callThrough();
        service['erase'](baseCtxStub, pathStub);

        expect(eraseSpy).toHaveBeenCalledWith(baseCtxStub, pathStub);
        expect(beginSpy).toHaveBeenCalled();
        expect(moveToSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
    });

    it('setSize should not be able to set size under minimum 5', () => {
        service.setSize(1);
        expect(service.size).toEqual(EraserConstants.MIN_SIZE_ERASER);
    });

    it('setSize should be able to set size over 5 and under maximum ' + EraserConstants.MAX_SIZE_ERASER, () => {
        const medianSize = EraserConstants.MIN_SIZE_ERASER + (EraserConstants.MAX_SIZE_ERASER - EraserConstants.MIN_SIZE_ERASER) / 2;
        service.setSize(medianSize);
        expect(service.size).toEqual(medianSize);
    });

    it('setSize should not be able to set size over maximum ' + EraserConstants.MAX_SIZE_ERASER, () => {
        const size = EraserConstants.MAX_SIZE_ERASER + 1;
        service.setSize(size);
        expect(service.size).toEqual(EraserConstants.MAX_SIZE_ERASER);
    });
});
