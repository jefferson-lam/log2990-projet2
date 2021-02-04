import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from './ellipse-service';

// tslint:disable:no-any
describe('RectangleService', () => {
    let service: EllipseService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawEllipseSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EllipseService);
        drawEllipseSpy = spyOn<any>(service, 'drawEllipse').and.callThrough();
        // Configuration of spy of service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 40,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 40 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1, // TODO: Avoir ceci dans un enum accessible
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawEllipse if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawEllipse if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawEllipse if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call Rectangle if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' onKeyDown should call drawEllipse if mouse was down and then Shift was pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyDown(keyEvent);
        expect(service.isCircle).toEqual(true);
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it(' onKeyDown should not call drawEllipse if mouse was not down and then Shift was pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyDown(keyEvent);
        expect(service.isCircle).toEqual(false);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' onKeyDown should not call drawEllipse if Shift was not pressed while mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyDown(keyEvent);
        expect(service.isCircle).toEqual(false);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' onKeyUp should call drawEllipse if mouse was down and then shift was pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyUp(keyEvent);
        expect(service.isCircle).toEqual(false);
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it(' onKeyUp should not call drawEllipse if mouse was down and then keyboard key was released', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyUp(keyEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' onKeyUp should not call drawEllipse if mouse was not down when keyboard key was released', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyUp(keyEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });
    // TODO: implement tests with the 3 different fill modes
});
