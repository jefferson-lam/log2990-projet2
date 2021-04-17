import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as CanvasConstants from '@app/constants/canvas-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as RectangleConstants from '@app/constants/rectangle-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { RectangleService } from './rectangle-service';

describe('RectangleService', () => {
    let service: RectangleService;
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

        service = TestBed.inject(RectangleService);

        undoRedoService = TestBed.inject(UndoRedoService);
        executeSpy = spyOn(undoRedoService, 'executeCommand');
        previewExecuteSpy = spyOn(service.previewCommand, 'execute');
        setPreviewValuesSpy = spyOn(service.previewCommand, 'setValues');

        // Configuration of spy of service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        const offsetX = 25;
        mouseEvent = {
            x: offsetX + CanvasConstants.LEFT_MARGIN,
            y: 40,
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

    it(' mouseDown should set inUse property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.inUse).toEqual(true);
    });

    it(' mouseDown should set inUse property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseConstants.MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.inUse).toEqual(false);
    });

    it(' onMouseUp should call executeCommand if mouse was already down', () => {
        service.inUse = true;

        service.onMouseUp(mouseEvent);
        expect(executeSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call executeCommand if mouse was not already down', () => {
        service.inUse = false;

        service.onMouseUp(mouseEvent);
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call setValues and execute of previewCommand if mouse was already down', () => {
        service.inUse = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(setPreviewValuesSpy).toHaveBeenCalled();
        expect(previewExecuteSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call setValues and execute of previewCommand if mouse was not already down', () => {
        service.inUse = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(setPreviewValuesSpy).not.toHaveBeenCalled();
        expect(previewExecuteSpy).not.toHaveBeenCalled();
    });

    it('onMouseLeave should call setValues and execute of previewCommand if mouse was pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = true;

        service.onMouseLeave(mouseEvent);
        expect(setPreviewValuesSpy).toHaveBeenCalled();
        expect(previewExecuteSpy).toHaveBeenCalled();
    });

    it('onMouseLeave should not call setValues and execute of previewCommand if mouse was not pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = false;

        service.onMouseLeave(mouseEvent);
        expect(setPreviewValuesSpy).not.toHaveBeenCalled();
        expect(previewExecuteSpy).not.toHaveBeenCalled();
    });

    it('onMouseEnter should make service.inUse true if left mouse was pressed and mouse was pressed before leaving', () => {
        const mouseEnterEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: MouseConstants.PRIMARY_BUTTON,
        } as MouseEvent;
        service.inUse = true;

        service.onMouseEnter(mouseEnterEvent);
        expect(service.inUse).toEqual(true);
    });

    it('onMouseEnter should make service.inUse false if left mouse was pressed and mouse was not pressed before leaving', () => {
        const mouseEnterEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: MouseConstants.PRIMARY_BUTTON,
        } as MouseEvent;
        service.inUse = false;

        service.onMouseEnter(mouseEnterEvent);
        expect(service.inUse).toEqual(false);
    });

    it('onMouseEnter should make service.inUse false if left mouse was not pressed and mouse was not pressed before leaving', () => {
        const mouseEnterEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: MouseConstants.NO_BUTTON_PRESSED,
        } as MouseEvent;
        service.inUse = false;

        service.onMouseEnter(mouseEnterEvent);
        expect(service.inUse).toEqual(false);
    });

    it('onKeyboardDown should call setValues and execute of previewCommand if mouse was down and Shift was just pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = true;
        service.isShiftDown = false;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyboardDown(keyEvent);
        expect(service.isSquare).toEqual(true);
        expect(setPreviewValuesSpy).toHaveBeenCalled();
        expect(previewExecuteSpy).toHaveBeenCalled();
    });

    it('onKeyboardDown should not call setValues and execute of previewCommand if mouse was down and Shift was just pressed.', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = true;
        service.isShiftDown = true;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyboardDown(keyEvent);
        expect(service.isSquare).toEqual(false);
        expect(setPreviewValuesSpy).not.toHaveBeenCalled();
        expect(previewExecuteSpy).not.toHaveBeenCalled();
    });

    it('onKeyboardDown should not call setValues and execute of previewCommand if mouse was not down and Shift was just pressed.', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = false;
        service.isShiftDown = true;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyboardDown(keyEvent);
        expect(service.isSquare).toEqual(false);
        expect(setPreviewValuesSpy).not.toHaveBeenCalled();
        expect(previewExecuteSpy).not.toHaveBeenCalled();
    });

    it(' onKeyboardDown should not call setValues and execute of previewCommand if Shift was not pressed while mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = false;

        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyboardDown(keyEvent);
        expect(setPreviewValuesSpy).not.toHaveBeenCalled();
        expect(previewExecuteSpy).not.toHaveBeenCalled();
    });

    it(' onKeyboardUp should call setValues and execute of previewCommand if mouse was down and then shift was pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = true;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyboardUp(keyEvent);
        expect(service.isSquare).toEqual(false);
        expect(setPreviewValuesSpy).toHaveBeenCalled();
        expect(previewExecuteSpy).toHaveBeenCalled();
    });

    it(' onKeyboardUp should not call setValues and execute of previewCommand if mouse was down and then keyboard key was released', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = true;

        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyboardUp(keyEvent);
        expect(setPreviewValuesSpy).not.toHaveBeenCalled();
        expect(previewExecuteSpy).not.toHaveBeenCalled();
    });

    it(' onKeyboardUp should not call setValues and execute of previewCommand if mouse was not down when keyboard key was released', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = false;

        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyboardUp(keyEvent);
        expect(setPreviewValuesSpy).not.toHaveBeenCalled();
        expect(previewExecuteSpy).not.toHaveBeenCalled();
    });

    it('setLineWidth should change size of lineWidth if within min and max width allowed', () => {
        const RANDOM_TEST_WIDTH = 10;
        service.setLineWidth(RANDOM_TEST_WIDTH);
        expect(service.lineWidth).toEqual(RANDOM_TEST_WIDTH);
    });

    it('setLineWidth should change size of lineWidth to min width if width is lower than min', () => {
        const LOWER_TEST_WIDTH = -1;
        service.setLineWidth(LOWER_TEST_WIDTH);
        expect(service.lineWidth).toEqual(RectangleConstants.MIN_BORDER_WIDTH);
    });

    it('setLineWidth should change size of lineWidth to max width if width is bigger than max', () => {
        const RANDOM_TEST_WIDTH = 70;
        service.setLineWidth(RANDOM_TEST_WIDTH);
        expect(service.lineWidth).toEqual(RectangleConstants.MAX_BORDER_WIDTH);
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

    it('onToolChange should call onMouseUp', () => {
        const onMouseUpSpy = spyOn(service, 'onMouseUp');

        service.onToolChange();

        expect(onMouseUpSpy).toHaveBeenCalled();
    });
});
