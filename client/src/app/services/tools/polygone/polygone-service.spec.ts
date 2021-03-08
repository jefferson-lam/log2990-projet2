import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PolygoneConstants from '@app/constants/polygone-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { PolygoneService } from './polygone-service';

// tslint:disable:no-any
describe('PolygoneService', () => {
    let service: PolygoneService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let predictionCircleSpy: jasmine.Spy;

    let previewExecuteSpy: jasmine.Spy;
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
        service = TestBed.inject(PolygoneService);
        predictionCircleSpy = spyOn<any>(service, 'drawPredictionCircle').and.callThrough();

        undoRedoService = TestBed.inject(UndoRedoService);
        executeSpy = spyOn(undoRedoService, 'executeCommand').and.callThrough();
        previewExecuteSpy = spyOn(service.previewCommand, 'execute');

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 40,
            button: MouseConstants.MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 40 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it('onMouseDown should set inUse property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.inUse).toEqual(true);
    });

    it('onMouseDown should set inUse property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseConstants.MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.inUse).toEqual(false);
    });

    it('onMouseUp should call executeCommand and change primary color', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = true;
        service.fillMode = 1;
        service.onMouseUp(mouseEvent);
        expect(executeSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call executeCommand if mouse was not already down', () => {
        service.inUse = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseUp(mouseEvent);
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call executeCommand if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = true;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(previewExecuteSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call executeCommand if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = false;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('onMouseMove should call predictionCircleSpy if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = true;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(predictionCircleSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call predictionCircleSpy if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = false;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(predictionCircleSpy).not.toHaveBeenCalled();
    });

    it('onMouseLeave should call executeCommand if mouse was pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = true;
        service.onMouseLeave(mouseEvent);
        expect(previewExecuteSpy).toHaveBeenCalled();
    });

    it('onMouseLeave should not call executeCommand if mouse was not pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = false;
        service.onMouseLeave(mouseEvent);
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it('onMouseLeave should call drawPredictionCircle if mouse was already down', () => {
        service.inUse = true;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(predictionCircleSpy).toHaveBeenCalled();
    });

    it('onMouseLeave should not call drawPredictionCircle if mouse was not down', () => {
        service.inUse = false;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(predictionCircleSpy).not.toHaveBeenCalled();
    });

    it('onMouseEnter should make service.mouseDown true if left mouse was pressed and mouse was pressed before leaving', () => {
        const mouseEnterEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: MouseConstants.PRIMARY_BUTTON,
        } as MouseEvent;
        service.inUse = true;
        service.onMouseEnter(mouseEnterEvent);
        expect(service.inUse).toEqual(true);
    });

    it('onMouseEnter should make service.mouseDown false if left mouse was pressed and mouse was not pressed before leaving', () => {
        const mouseEnterEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: 1,
        } as MouseEvent;
        service.inUse = false;
        service.onMouseEnter(mouseEnterEvent);
        expect(service.inUse).toEqual(false);
    });

    it('onMouseEnter should make service.mouseDown false if left mouse was not pressed and mouse was not pressed before leaving', () => {
        const mouseEnterEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: 0,
        } as MouseEvent;
        service.inUse = false;
        service.onMouseEnter(mouseEnterEvent);
        expect(service.inUse).toEqual(false);
    });

    it('drawPolygoneType should call getDrawTypeRadius and change return value to xRadius', () => {
        const getPredictionRadiusSpy = spyOn<any>(service, 'getPredictionCircleRadius').and.callThrough();
        // tslint:disable:no-string-literal
        service['drawPredictionCircle'](baseCtxStub, service.cornerCoords);
        expect(getPredictionRadiusSpy).toHaveBeenCalled();
    });
    it('getRadiiXAndY should set expected x and y radius', () => {
        const start = service.cornerCoords[PolygoneConstants.START_INDEX];
        const end = service.cornerCoords[PolygoneConstants.END_INDEX];
        const xRadius = Math.abs(end.x - start.x) / 2;
        const yRadius = Math.abs(end.y - start.y) / 2;
        // tslint:disable:no-string-literal
        const radii = service['getRadiiXAndY'](service.cornerCoords);

        expect(radii[0]).toEqual(xRadius);
        expect(radii[1]).toEqual(yRadius);
    });

    it('setLineWidth should change size of lineWidth', () => {
        const RANDOM_TEST_WIDTH = 10;
        service.setLineWidth(RANDOM_TEST_WIDTH);
        expect(service.lineWidth).toEqual(RANDOM_TEST_WIDTH);
    });

    it('setSidesCount should change sides count', () => {
        const RANDOM_TEST_COUNT = 10;
        service.setSidesCount(RANDOM_TEST_COUNT);
        expect(service.initNumberSides).toEqual(RANDOM_TEST_COUNT);
    });

    it('setFillMode should change to FILL ONLY mode', () => {
        const EXPECTED_FILL_MODE = ToolConstants.FillMode.FILL_ONLY;
        service.setFillMode(EXPECTED_FILL_MODE);
        expect(service.fillMode).toEqual(EXPECTED_FILL_MODE);
    });

    it('setFillMode should change to OUTLINE mode', () => {
        const EXPECTED_FILL_MODE = ToolConstants.FillMode.OUTLINE;
        service.setFillMode(EXPECTED_FILL_MODE);
        expect(service.fillMode).toEqual(EXPECTED_FILL_MODE);
    });

    it('setFillMode should change to OUTLINE_FILL ONLY mode', () => {
        const EXPECTED_FILL_MODE = ToolConstants.FillMode.OUTLINE_FILL;
        service.setFillMode(EXPECTED_FILL_MODE);
        expect(service.fillMode).toEqual(EXPECTED_FILL_MODE);
    });

    it('setPrimaryColor should change primary color to wanted color', () => {
        const EXPECTED_RANDOM_COLOR = 'blue';
        service.setPrimaryColor(EXPECTED_RANDOM_COLOR);
        expect(service.primaryColor).toEqual(EXPECTED_RANDOM_COLOR);
    });

    it('setSecondaryColor should change secondary color to wanted color', () => {
        const EXPECTED_RANDOM_COLOR = 'green';
        service.setSecondaryColor(EXPECTED_RANDOM_COLOR);
        expect(service.secondaryColor).toEqual(EXPECTED_RANDOM_COLOR);
    });
});
