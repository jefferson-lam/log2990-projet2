import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as AerosolConstants from '@app/constants/aerosol-constants';
import * as CanvasConstants from '@app/constants/canvas-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { AerosolService } from './aerosol-service';

// tslint:disable:no-any
// tslint:disable:no-string-literal
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
        executeSpy = spyOn(undoRedoService, 'executeCommand');
        previewExecuteSpy = spyOn(service['previewCommand'], 'execute');
        setPreviewValuesSpy = spyOn(service['previewCommand'], 'setValues');

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        const offsetX = 25;
        mouseEvent = {
            x: offsetX + CanvasConstants.LEFT_MARGIN,
            y: 25,
            button: MouseConstants.MouseButton.Left,
        } as MouseEvent;

        setIntervalSpy = spyOn(window, 'setInterval');
        clearIntervalSpy = spyOn(window, 'clearInterval');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should set mouseDownCoord to correct position if left click', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service['mousePosition']).toEqual(expectedResult);
    });

    it('onMouseDown should set inUse property to true on left click', () => {
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

    it('onMouseDown should call setInterval if left click', () => {
        service.onMouseDown(mouseEvent);
        expect(setIntervalSpy).toHaveBeenCalled();
    });

    it('onMouseDown should call preview functions two times if is down and getEmmisionRate ms has passed', fakeAsync(() => {
        service.emissionCount = AerosolConstants.INIT_EMISSION_COUNT;
        const expectedRate = AerosolConstants.EMISSION_RATE / service.emissionCount;

        service.onMouseDown(mouseEvent);
        tick(expectedRate + 1);
        window.clearInterval(service.aerosolRefresh);

        expect(setPreviewValuesSpy).toHaveBeenCalledTimes(2);
        expect(previewExecuteSpy).toHaveBeenCalledTimes(2);
        flush();
    }));

    it('onMouseUp should set inUse to false', () => {
        service.inUse = true;
        service.onMouseUp(mouseEvent);
        expect(service.inUse).toEqual(false);
    });

    it('onMouseUp should call executeCommand and clear preview canvas if mouse was already down', () => {
        service.inUse = true;
        service.onMouseUp(mouseEvent);
        expect(executeSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledWith(drawServiceSpy.previewCtx);
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

    it('onMouseUp should call clearInterval', () => {
        service.inUse = false;
        service.onMouseUp(mouseEvent);
        expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call getPositionFromMouse and set mousePosition if inUse', () => {
        const expectedPosition = { x: 12, y: 10 };
        const getPositionSpy = spyOn(service, 'getPositionFromMouse').and.callFake(() => {
            return expectedPosition;
        });
        service.inUse = true;

        service.onMouseMove(mouseEvent);

        expect(getPositionSpy).toHaveBeenCalled();
        expect(service['mousePosition']).toBe(expectedPosition);
    });

    it('onMouseMove should not call getPositionFromMouse if not inUse', () => {
        const getPositionSpy = spyOn(service, 'getPositionFromMouse');
        service.inUse = false;

        service.onMouseMove(mouseEvent);

        expect(getPositionSpy).not.toHaveBeenCalled();
    });

    it('onMouseLeave should call onMouseUp', () => {
        const mouseUpSpy = spyOn(service, 'onMouseUp');
        service.onMouseLeave(mouseEvent);
        expect(mouseUpSpy).toHaveBeenCalled();
    });

    it('setLineWidth should set size when called', () => {
        service.setLineWidth(AerosolConstants.INIT_LINE_WIDTH);
        expect(service.lineWidth).toEqual(AerosolConstants.INIT_LINE_WIDTH);
    });

    it('onToolChange should call onMouseUp', () => {
        const onMouseUpSpy = spyOn(service, 'onMouseUp');

        service.onToolChange();

        expect(onMouseUpSpy).toHaveBeenCalled();
    });
});
