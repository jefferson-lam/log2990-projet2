import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as EraserConstants from '@app/constants/eraser-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { EraserService } from './eraser-service';

// tslint:disable:no-any
describe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let executeSpy: jasmine.Spy;
    let previewExecuteSpy: jasmine.Spy;
    let setPreviewValuesSpy: jasmine.Spy;
    let undoRedoService: UndoRedoService;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EraserService);

        undoRedoService = TestBed.inject(UndoRedoService);
        executeSpy = spyOn(undoRedoService, 'executeCommand');
        previewExecuteSpy = spyOn(service.previewCommand, 'execute');
        setPreviewValuesSpy = spyOn(service.previewCommand, 'setValues');

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

    it('mouseDown should set inUse property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.inUse).toEqual(true);
    });

    it('mouseDown should set inUse property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseConstants.MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
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

    it('onMouseMove should call setValues and execute previewcommand if mouse was already down', () => {
        service.inUse = true;

        service.onMouseMove(mouseEvent);
        expect(setPreviewValuesSpy).toHaveBeenCalled();
        expect(previewExecuteSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call setValues and execute previewcommand if mouse was not already down', () => {
        service.inUse = false;

        service.onMouseMove(mouseEvent);
        expect(setPreviewValuesSpy).not.toHaveBeenCalled();
        expect(previewExecuteSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call moveCursor', () => {
        const moveCursorSpy = spyOn<any>(service, 'moveCursor').and.callThrough();
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(moveCursorSpy).toHaveBeenCalled();
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
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it('onMouseEnter should set inUse to false if mouse is not down', () => {
        service.inUse = true;
        const mouseEventNoClick = {
            buttons: MouseConstants.MouseButton.Left,
        } as MouseEvent;

        service.onMouseEnter(mouseEventNoClick);
        expect(service.inUse).toBeFalse();
    });

    it('onMouseEnter should not set inUse to false if mouse is down', () => {
        service.inUse = true;

        service.onMouseEnter(mouseEvent);
        expect(service.inUse).toBeTrue();
    });

    it('setLineWidth should not be able to set size under minimum 5', () => {
        service.setLineWidth(1);
        expect(service.lineWidth).toEqual(EraserConstants.MIN_SIZE_ERASER);
    });

    it('setLineWidth should be able to set size over 5 and under maximum ' + EraserConstants.MAX_SIZE_ERASER, () => {
        const medianSize = EraserConstants.MIN_SIZE_ERASER + (EraserConstants.MAX_SIZE_ERASER - EraserConstants.MIN_SIZE_ERASER) / 2;
        service.setLineWidth(medianSize);
        expect(service.lineWidth).toEqual(medianSize);
    });

    it('setLineWidth should not be able to set size over maximum ' + EraserConstants.MAX_SIZE_ERASER, () => {
        const size = EraserConstants.MAX_SIZE_ERASER + 1;
        service.setLineWidth(size);
        expect(service.lineWidth).toEqual(EraserConstants.MAX_SIZE_ERASER);
    });

    it('onToolChange should call onMouseUp', () => {
        const onMouseUpSpy = spyOn(service, 'onMouseUp');

        service.onToolChange();

        expect(onMouseUpSpy).toHaveBeenCalled();
    });
});
