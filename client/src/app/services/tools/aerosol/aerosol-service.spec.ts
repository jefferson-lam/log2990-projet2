import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as AerosolConstants from '@app/constants/aerosol-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { AerosolService } from './aerosol-service';

// tslint:disable:no-any
describe('AerosolService', () => {
    let service: AerosolService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let executeSpy: jasmine.Spy;
    let previewExecuteSpy: jasmine.Spy;
    let setPreviewValuesSpy: jasmine.Spy;
    let setIntervalSpy: jasmine.Spy;
    let clearIntervalSpy: jasmine.Spy;
    let undoRedoService: UndoRedoService;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(AerosolService);
        undoRedoService = TestBed.inject(UndoRedoService);
        executeSpy = spyOn(undoRedoService, 'executeCommand').and.callThrough();
        previewExecuteSpy = spyOn(service.previewCommand, 'execute');
        setPreviewValuesSpy = spyOn(service.previewCommand, 'setValues');

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseConstants.MouseButton.Left,
        } as MouseEvent;

        setIntervalSpy = spyOn(window, 'setInterval');
        clearIntervalSpy = spyOn(window, 'clearInterval');
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
        expect(service.inUse).toEqual(true);
    });

    it('onMouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseConstants.MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.inUse).toEqual(false);
    });

    it('onMouseUp should set mouseDown to true', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service['pathData'].push(service.mouseDownCoord);
        service.inUse = true;
        service.onMouseUp(mouseEvent);
        expect(service.inUse).toEqual(false);
    });

    it('onMouseUp should call executeCommand if mouse was already down', () => {
        service.inUse = true;
        service.onMouseUp(mouseEvent);
        expect(executeSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call executeCommand if mouse was not already down', () => {
        service.inUse = false;

        service.onMouseUp(mouseEvent);
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should set mouseDown to false', () => {
        service.inUse = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseUp(mouseEvent);
        expect(service.inUse).toEqual(false);
    });

    it('onMouseMove should call executeCommand if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service['pathData'].push(service.mouseDownCoord);
        service.inUse = true;
        service.onMouseMove(mouseEvent);
        expect(service.inUse).toEqual(true);
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should not call executeCommand if mouseDown is false', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = false;
        service.onMouseMove(mouseEvent);
        expect(service.inUse).toEqual(false);
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call setValues and execute of previewCommand if mouse was already down', () => {
        service.inUse = true;
        service.onMouseMove(mouseEvent);
        expect(setPreviewValuesSpy).toHaveBeenCalled();
        expect(previewExecuteSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call setValues and execute of previewCommand if mouse was not already down', () => {
        service.inUse = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(setPreviewValuesSpy).not.toHaveBeenCalled();
        expect(previewExecuteSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call setInterval if mouse was already down', () => {
        service.inUse = true;
        service.onMouseMove(mouseEvent);
        expect(setIntervalSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call clearInterval but not setInterval if mouse was not already down', () => {
        service.inUse = false;
        service.onMouseMove(mouseEvent);
        expect(clearIntervalSpy).toHaveBeenCalled();
        expect(setIntervalSpy).not.toHaveBeenCalled();
    });

    it('onMouseLeave should stop calling airBrushCircle', () => {
        service.inUse = true;
        service.onMouseLeave(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('onMouseLeave should call executeCommand if mouse was down', () => {
        service.inUse = true;
        service.onMouseLeave(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(executeSpy).toHaveBeenCalled();
    });

    it('onMouseLeave should not call executeCommand if mouse was not down', () => {
        service.inUse = false;

        service.onMouseLeave(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it('setLineWidth should set size when called', () => {
        service.setLineWidth(AerosolConstants.INIT_LINE_WIDTH);
        expect(service.lineWidth).toEqual(AerosolConstants.INIT_LINE_WIDTH);
    });

    it('setWaterDropWidth should set particle size when called', () => {
        service.setWaterDropWidth(AerosolConstants.INIT_WATERDROP_WIDTH);
        expect(service.waterDropWidth).toEqual(AerosolConstants.INIT_WATERDROP_WIDTH);
    });

    it('setEmissionCount should set emission count when called', () => {
        service.setEmissionCount(AerosolConstants.INIT_EMISSION_COUNT);
        expect(service.emissionCount).toEqual(AerosolConstants.INIT_EMISSION_COUNT);
    });

    it('setPrimaryColor should set color when called', () => {
        service.setPrimaryColor('black');
        expect(service.primaryColor).toEqual('black');
    });

    it('onToolChange should call onMouseUp', () => {
        const onMouseUpSpy = spyOn(service, 'onMouseUp');

        service.onToolChange();

        expect(onMouseUpSpy).toHaveBeenCalled();
    });
});
