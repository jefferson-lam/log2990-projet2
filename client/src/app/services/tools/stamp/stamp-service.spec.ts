import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as CanvasConstants from '@app/constants/canvas-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { StampService } from './stamp-service';

describe('StampService', () => {
    let service: StampService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let previewExecuteSpy: jasmine.Spy;
    let executeCommandSpy: jasmine.Spy;

    let undoRedoService: UndoRedoService;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        service = TestBed.inject(StampService);

        undoRedoService = TestBed.inject(UndoRedoService);
        executeCommandSpy = spyOn(undoRedoService, 'executeCommand').and.callThrough();
        previewExecuteSpy = spyOn(service.previewCommand, 'execute');

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            // tslint:disable-next-line:no-magic-numbers
            x: 25 + CanvasConstants.LEFT_MARGIN,
            y: 40,
            button: MouseConstants.MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 40 };
        service.onMouseDown(mouseEvent);
        expect(service.position).toEqual(expectedResult);
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

    it('onMouseUp should call executeCommand', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = true;
        service.fillMode = 1;
        service.onMouseUp(mouseEvent);
        expect(executeCommandSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call executeCommand if mouse was not already down', () => {
        service.inUse = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseUp(mouseEvent);
        expect(executeCommandSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call executeCommand if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(previewExecuteSpy).toHaveBeenCalled();
    });

    it('onMouseLeave should call clearCanvas on previewCtx', () => {
        service.onMouseLeave();

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledWith(drawServiceSpy.previewCtx);
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

    it('onMouseWheel should change call changeRotationAngle()', () => {
        // tslint:disable-next-line:no-any
        const wheelSpy = spyOn<any>(service, 'changeRotationAngle');
        const mouseWheelEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: 0,
            preventDefault(): void {
                return;
            },
        } as WheelEvent;
        service.onMouseWheel(mouseWheelEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(previewExecuteSpy).toHaveBeenCalled();
        expect(wheelSpy).toHaveBeenCalled();
    });

    it('onMouseWheel should change change positive rotation angle', () => {
        const EXPECTED_VALUE_ANGLE = -0.2617993877991494;
        const mouseWheelEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: 0,
            deltaY: 1,
        } as WheelEvent;

        service.changeRotationAngle(mouseWheelEvent);
        expect(service.rotationAngle).toEqual(EXPECTED_VALUE_ANGLE);
    });

    it('onMouseWheel should change change negative rotation angle', () => {
        const EXPECTED_VALUE_ANGLE = 0.2617993877991494;
        const mouseWheelEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: 0,
            deltaY: -1,
        } as WheelEvent;

        service.changeRotationAngle(mouseWheelEvent);
        expect(service.rotationAngle).toEqual(EXPECTED_VALUE_ANGLE);
    });

    it('setAngleSliderValue should change angle if out of max bounds', () => {
        const MAX_ANGLE = 400;
        const EXPECTED_VALUE = 40;
        service.setAngleSliderValue(MAX_ANGLE);
        expect(service.realRotationValues).toEqual(EXPECTED_VALUE);
    });

    it('setAngleSliderValue should change angle if out of min bounds', () => {
        const MAX_ANGLE = -400;
        const EXPECTED_ANGLE = -40;
        service.setAngleSliderValue(MAX_ANGLE);
        expect(service.realRotationValues).toEqual(EXPECTED_ANGLE);
    });

    it('changeRotationAngleOnAlt should change rotation angle', () => {
        service.changeRotationAngleOnAlt();
        expect(service.degreesRotation).toEqual(1);
    });

    it('changeRotationAngleNormal should change rotation angle', () => {
        const EXPECTED_ANGLE = 15;
        service.changeRotationAngleNormal();
        expect(service.degreesRotation).toEqual(EXPECTED_ANGLE);
    });

    it('setImageSource should change image source', () => {
        const EXPECTED_SOURCE = 'ok_boomer.svg';
        service.setImageSource(EXPECTED_SOURCE);
        expect(service.imageSource).toEqual(EXPECTED_SOURCE);
    });

    it('setImageZoomFactor should change zoom factor', () => {
        const EXPECTED_ZOOM_FACTOR = 14;
        service.setImageZoomFactor(EXPECTED_ZOOM_FACTOR);
        expect(service.imageZoomFactor).toEqual(EXPECTED_ZOOM_FACTOR);
    });

    it('setAngleRotation should change rotation angle', () => {
        const DEGREES_ANGLE = 36;
        const RAD_ANGLE = 0.6283185307179586;
        service.setAngleRotation(DEGREES_ANGLE);
        expect(service.rotationAngle).toEqual(RAD_ANGLE);
    });

    it('onToolChange should call onMouseUp', () => {
        const onMouseUpSpy = spyOn(service, 'onMouseUp');

        service.onToolChange();

        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    it('drawCursor should set position, previewCommand values and execute previewCommand', () => {
        const setPreviewCommandValuesSpy = spyOn(service.previewCommand, 'setValues');
        const expectedPosition = { x: 2, y: 40 };

        service.drawCursor(expectedPosition);

        expect(service.position).toBe(expectedPosition);
        expect(setPreviewCommandValuesSpy).toHaveBeenCalled();
        expect(previewExecuteSpy).toHaveBeenCalled();
    });
});
