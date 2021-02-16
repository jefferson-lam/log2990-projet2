import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as EllipseConstants from '@app/constants/ellipse-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from './ellipse-service';

// tslint:disable:max-file-line-count
// tslint:disable:no-any
describe('EllipseService', () => {
    let service: EllipseService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawEllipseSpy: jasmine.Spy<any>;
    let testCanvas: HTMLCanvasElement;
    let testCtx: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        testCanvas = document.createElement('canvas');
        testCtx = testCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EllipseService);
        drawEllipseSpy = spyOn<any>(service, 'drawEllipse').and.callThrough();
        // Configuration of spy of service
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
            button: MouseConstants.MouseButton.Right,
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

    it('onMouseLeave should call drawEllipse if mouse was pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseLeave(mouseEvent);
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it('onMouseLeave should not call drawEllipse if mouse was not pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseLeave(mouseEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it('onMouseEnter should make service.mouseDown true if left mouse was pressed and mouse was pressed before leaving', () => {
        const mouseEnterEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: MouseConstants.PRIMARY_BUTTON,
        } as MouseEvent;
        service.mouseDown = true;

        service.onMouseEnter(mouseEnterEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it('onMouseEnter should make service.mouseDown false if left mouse was pressed and mouse was not pressed before leaving', () => {
        const mouseEnterEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: 1,
        } as MouseEvent;
        service.mouseDown = false;

        service.onMouseEnter(mouseEnterEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it('onMouseEnter should make service.mouseDown false if left mouse was not pressed and mouse was not pressed before leaving', () => {
        const mouseEnterEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: 0,
        } as MouseEvent;
        service.mouseDown = false;

        service.onMouseEnter(mouseEnterEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onKeyboardDown should call drawEllipse if mouse was down and then Shift was pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyboardDown(keyEvent);
        expect(service.isCircle).toEqual(true);
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it(' onKeyboardDown should not call drawEllipse if mouse was not down and then Shift was pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyboardDown(keyEvent);
        expect(service.isCircle).toEqual(false);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' onKeyboardDown should not call drawEllipse if Shift was not pressed while mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyboardDown(keyEvent);
        expect(service.isCircle).toEqual(false);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' onKeyboardUp should call drawEllipse if mouse was down and then shift was pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyboardUp(keyEvent);
        expect(service.isCircle).toEqual(false);
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it(' onKeyboardUp should not call drawEllipse if mouse was down and then keyboard key was released', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyboardUp(keyEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' onKeyboardUp should not call drawEllipse if mouse was not down when keyboard key was released', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyboardUp(keyEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it('setLineWidth should change size of lineWidth if within min and max width allowed', () => {
        const RANDOM_TEST_WIDTH = 10;
        service.setLineWidth(RANDOM_TEST_WIDTH);
        expect(service.lineWidth).toEqual(RANDOM_TEST_WIDTH);
    });

    it('setLineWidth should change size of lineWidth to min width if width is lower than min', () => {
        const LOWER_TEST_WIDTH = -1;
        service.setLineWidth(LOWER_TEST_WIDTH);
        expect(service.lineWidth).toEqual(EllipseConstants.MIN_BORDER_WIDTH);
    });

    it('setLineWidth should change size of lineWidth to max width if width is bigger than max', () => {
        const RANDOM_TEST_WIDTH = 70;
        service.setLineWidth(RANDOM_TEST_WIDTH);
        expect(service.lineWidth).toEqual(EllipseConstants.MAX_BORDER_WIDTH);
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

    it('should make an ellipse with border and fill color of same color on FillMode.FILL_ONLY', () => {
        const RED_VALUE = 110;
        const GREEN_VALUE = 225;
        const BLUE_VALUE = 202;
        const OPACITY = 1;
        const TEST_PRIMARY_COLOR = `rgb(${RED_VALUE}, ${GREEN_VALUE}, ${BLUE_VALUE}, ${OPACITY})`;
        const TEST_SECONDARY_COLOR = 'black';
        service.setPrimaryColor(TEST_PRIMARY_COLOR);
        service.setSecondaryColor(TEST_SECONDARY_COLOR);
        const TEST_LINE_WIDTH = 5;
        service.setLineWidth(TEST_LINE_WIDTH);
        service.setFillMode(ToolConstants.FillMode.FILL_ONLY);

        const END_X = 10;
        const END_Y = 20;
        mouseEvent = { offsetX: 0, offsetY: 0, button: MouseConstants.MouseButton.Left } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: END_X, offsetY: END_Y, button: MouseConstants.MouseButton.Left } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // Trace test ellipse to be compared with stub.
        const TEST_START_X = END_X / 2;
        const TEST_START_Y = END_Y / 2;
        const TEST_X_RADIUS = (END_X - TEST_LINE_WIDTH) / 2;
        const TEST_Y_RADIUS = (END_Y - TEST_LINE_WIDTH) / 2;
        testCtx.beginPath();
        testCtx.setLineDash([]);
        testCtx.lineJoin = 'round';
        testCtx.ellipse(
            TEST_START_X,
            TEST_START_Y,
            TEST_X_RADIUS,
            TEST_Y_RADIUS,
            EllipseConstants.ROTATION,
            EllipseConstants.START_ANGLE,
            EllipseConstants.END_ANGLE,
        );

        testCtx.strokeStyle = TEST_PRIMARY_COLOR;
        testCtx.lineWidth = service.lineWidth;
        testCtx.stroke();
        testCtx.fillStyle = TEST_PRIMARY_COLOR;
        testCtx.fill();

        const imageData: ImageData = baseCtxStub.getImageData(0, 0, END_X, END_Y);
        const testData: ImageData = testCtx.getImageData(0, 0, END_X, END_Y);
        for (let i = 0; i < imageData.data.length; i++) {
            expect(imageData.data[i]).toEqual(testData.data[i]);
        }
    });

    it('should make an ellipse with only border on FillMode.OUTLINE', () => {
        const RED_VALUE = 110;
        const GREEN_VALUE = 225;
        const BLUE_VALUE = 202;
        const OPACITY = 1;
        const TEST_PRIMARY_COLOR = `rgb(${RED_VALUE}, ${GREEN_VALUE}, ${BLUE_VALUE}, ${OPACITY})`;
        const TEST_SECONDARY_COLOR = 'black';
        service.setPrimaryColor(TEST_PRIMARY_COLOR);
        service.setSecondaryColor(TEST_SECONDARY_COLOR);
        const TEST_LINE_WIDTH = 6;
        service.setLineWidth(TEST_LINE_WIDTH);
        service.setFillMode(ToolConstants.FillMode.OUTLINE);

        const END_X = 10;
        const END_Y = 15;
        mouseEvent = { offsetX: 0, offsetY: 0, button: MouseConstants.MouseButton.Left } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: END_X, offsetY: END_Y, button: MouseConstants.MouseButton.Left } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // Trace test ellipse to be compared with stub.
        const TEST_START_X = END_X / 2;
        const TEST_START_Y = END_Y / 2;
        const TEST_X_RADIUS = (END_X - TEST_LINE_WIDTH) / 2;
        const TEST_Y_RADIUS = (END_Y - TEST_LINE_WIDTH) / 2;
        testCtx.beginPath();
        testCtx.setLineDash([]);
        testCtx.lineJoin = 'round';
        testCtx.ellipse(
            TEST_START_X,
            TEST_START_Y,
            TEST_X_RADIUS,
            TEST_Y_RADIUS,
            EllipseConstants.ROTATION,
            EllipseConstants.START_ANGLE,
            EllipseConstants.END_ANGLE,
        );

        testCtx.strokeStyle = TEST_SECONDARY_COLOR;
        testCtx.lineWidth = service.lineWidth;
        testCtx.stroke();

        const imageData: ImageData = baseCtxStub.getImageData(0, 0, END_X, END_Y);
        const testData: ImageData = testCtx.getImageData(0, 0, END_X, END_Y);
        for (let i = 0; i < imageData.data.length; i++) {
            expect(imageData.data[i]).toEqual(testData.data[i]);
        }
    });

    it('should make an ellipse with secondary color border and primary color fill on FillMode.OUTLINE_FILL', () => {
        const RED_VALUE = 110;
        const GREEN_VALUE = 225;
        const BLUE_VALUE = 202;
        const OPACITY = 1;
        const TEST_PRIMARY_COLOR = `rgb(${RED_VALUE}, ${GREEN_VALUE}, ${BLUE_VALUE}, ${OPACITY})`;
        const TEST_SECONDARY_COLOR = 'black';
        const TEST_FILL_MODE = ToolConstants.FillMode.OUTLINE_FILL;

        service.setPrimaryColor(TEST_PRIMARY_COLOR);
        service.setSecondaryColor(TEST_SECONDARY_COLOR);
        const TEST_LINE_WIDTH = 1;
        service.setLineWidth(TEST_LINE_WIDTH);
        service.setFillMode(TEST_FILL_MODE);

        const END_X = 10;
        const END_Y = 15;
        mouseEvent = { offsetX: 0, offsetY: 0, button: MouseConstants.MouseButton.Left } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: END_X, offsetY: END_Y, button: MouseConstants.MouseButton.Left } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // Trace test ellipse to be compared with stub.
        const TEST_START_X = END_X / 2;
        const TEST_START_Y = END_Y / 2;
        const TEST_X_RADIUS = (END_X - TEST_LINE_WIDTH) / 2;
        const TEST_Y_RADIUS = (END_Y - TEST_LINE_WIDTH) / 2;
        testCtx.beginPath();
        testCtx.setLineDash([]);
        testCtx.lineJoin = 'round';
        testCtx.ellipse(
            TEST_START_X,
            TEST_START_Y,
            TEST_X_RADIUS,
            TEST_Y_RADIUS,
            EllipseConstants.ROTATION,
            EllipseConstants.START_ANGLE,
            EllipseConstants.END_ANGLE,
        );

        testCtx.strokeStyle = TEST_SECONDARY_COLOR;
        testCtx.lineWidth = service.lineWidth;
        testCtx.stroke();
        testCtx.fillStyle = TEST_PRIMARY_COLOR;
        testCtx.fill();

        const imageData: ImageData = baseCtxStub.getImageData(0, 0, END_X, END_Y);
        const testData: ImageData = testCtx.getImageData(0, 0, END_X, END_Y);
        for (let i = 0; i < imageData.data.length; i++) {
            expect(imageData.data[i]).toEqual(testData.data[i]);
        }
    });
});
