import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AerosolService } from './aerosol-service';

// tslint:disable:no-any
describe('AerosolService', () => {
    let service: AerosolService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let aerosolSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(AerosolService);
        aerosolSpy = spyOn<any>(service, 'airBrushCircle').and.callThrough();

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

    it('onMouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it('onMouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it('onMouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseConstants.MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it('onMouseUp should set mouseDown to true', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service['pathData'].push(service.mouseDownCoord);
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(aerosolSpy).not.toHaveBeenCalled();
        expect(service.mouseDown).toEqual(false);
    });

    it('onMouseUp should set mouseDown to false', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseUp(mouseEvent);
        expect(aerosolSpy).not.toHaveBeenCalled();
        expect(service.mouseDown).toEqual(false);
    });

    it('onMouseMove should call airBrushCircle if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service['pathData'].push(service.mouseDownCoord);
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        expect(aerosolSpy).toHaveBeenCalled();
        expect(service.mouseDown).toEqual(true);
    });

    it('onMouseMove should call airBrushCircle', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        expect(aerosolSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call airBrushCircle if mouseDown is false', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        expect(aerosolSpy).not.toHaveBeenCalled();
        expect(service.mouseDown).toEqual(false);
    });

    it('onMouseLeave should stop calling airBrushCircle', () => {
        aerosolSpy.and.callFake(() => {});
        service.mouseDown = true;
        service.onMouseLeave(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(aerosolSpy).not.toHaveBeenCalled();
    });

    it('onMouseLeave should stop calling airBrushCircle if mouse was not down', () => {
        aerosolSpy.and.callFake(() => {});
        service.mouseDown = false;
        service.onMouseLeave(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(aerosolSpy).not.toHaveBeenCalled();
    });

    it('onMouseEnter should set mouseDown to false if mouse is not down', () => {
        service.mouseDown = true;
        const mouseEventNoClick = {
            buttons: MouseConstants.MouseButton.Left,
        } as MouseEvent;
        service.onMouseEnter(mouseEventNoClick);
        expect(service.mouseDown).toBeFalse();
    });

    it('onMouseEnter should not set mouseDown to false if mouse is down', () => {
        service.mouseDown = true;
        service.onMouseEnter(mouseEvent);
        expect(service.mouseDown).toBeTrue();
    });

    it('airBrushCircle should call canvas functions', () => {
        const fillSpy = spyOn(baseCtxStub, 'fillRect').and.callThrough();
        service['airBrushCircle'](baseCtxStub, mouseEvent);
        expect(aerosolSpy).toHaveBeenCalledWith(baseCtxStub, mouseEvent);
        expect(fillSpy).toHaveBeenCalled();
    });

    it('setLineWidth should set size when called', () => {
        service.setLineWidth(10);
        expect(service.lineWidth).toEqual(10);
    });

    it('setWaterDropWidth should set particle size when called', () => {
        service.setWaterDropWidth(10);
        expect(service.waterDropWidth).toEqual(10);
    });

    it('setEmissionCount should set emission count when called', () => {
        service.setEmissionCount(10);
        expect(service.emissionCount).toEqual(10);
    });

    it('setSecondaryColor should set color when called', () => {
        service.setSecondaryColor('black');
        expect(service.secondaryColor).toEqual('black');
    });
});
