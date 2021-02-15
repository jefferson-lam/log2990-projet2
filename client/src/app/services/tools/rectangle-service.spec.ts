import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as RectangleConstants from '@app/constants/rectangle-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from './rectangle-service';

// tslint:disable:max-file-line-count
// tslint:disable:no-any
describe('RectangleService', () => {
    let service: RectangleService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawRectangleSpy: jasmine.Spy<any>;
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

        service = TestBed.inject(RectangleService);
        drawRectangleSpy = spyOn<any>(service, 'drawRectangle').and.callThrough();
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
            button: MouseConstants.MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawRectangle if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawRectangle if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it(' onKeyboardDown should call drawRectangle if mouse was down and Shift was not pressed before shift was pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.isShiftDown = false;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyboardDown(keyEvent);
        expect(service.isSquare).toEqual(true);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' onKeyboardDown should not call drawRectangle if mouse was down and Shift was pressed before shift was pressed.', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.isShiftDown = true;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyboardDown(keyEvent);
        expect(service.isSquare).toEqual(false);
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it(' onKeyboardDown should not call drawRectangle if mouse was not down and Shift was pressed before shift was pressed.', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        service.isShiftDown = true;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyboardDown(keyEvent);
        expect(service.isSquare).toEqual(false);
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it(' onKeyboardDown should not call drawRectangle if Shift was not pressed while mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyboardDown(keyEvent);
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it(' onKeyboardUp should call drawRectangle if mouse was down and then shift was pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        const keyEvent = {
            key: 'Shift',
        } as KeyboardEvent;

        service.onKeyboardUp(keyEvent);
        expect(service.isSquare).toEqual(false);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' onKeyboardUp should not call drawRectangle if mouse was down and then keyboard key was released', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyboardUp(keyEvent);
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it(' onKeyboardUp should not call drawRectangle if mouse was not down when keyboard key was released', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyboardUp(keyEvent);
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it('setSize should change size of lineWidth if within min and max width allowed', () => {
        const RANDOM_TEST_WIDTH = 10;
        service.setSize(RANDOM_TEST_WIDTH);
        expect(service.lineWidth).toEqual(RANDOM_TEST_WIDTH);
    });

    it('setSize should change size of lineWidth to min width if width is lower than min', () => {
        const LOWER_TEST_WIDTH = -1;
        service.setSize(LOWER_TEST_WIDTH);
        expect(service.lineWidth).toEqual(RectangleConstants.MIN_BORDER_WIDTH);
    });

    it('setSize should change size of lineWidth to max width if width is bigger than max', () => {
        const RANDOM_TEST_WIDTH = 70;
        service.setSize(RANDOM_TEST_WIDTH);
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

    it('onMouseLeave should call drawRectangle if mouse was pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseLeave(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('onMouseLeave should not call drawRectangle if mouse was not pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseLeave(mouseEvent);
        expect(drawRectangleSpy).not.toHaveBeenCalled();
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
            buttons: MouseConstants.PRIMARY_BUTTON,
        } as MouseEvent;
        service.mouseDown = false;

        service.onMouseEnter(mouseEnterEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it('onMouseEnter should make service.mouseDown false if left mouse was not pressed and mouse was not pressed before leaving', () => {
        const mouseEnterEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: MouseConstants.NO_BUTTON_PRESSED,
        } as MouseEvent;
        service.mouseDown = false;

        service.onMouseEnter(mouseEnterEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it('FillMode.FILL_ONLY should fill all pixels between start and end point with the same color.', () => {
        service.setFillMode(ToolConstants.FillMode.FILL_ONLY);
        const TEST_LINE_WIDTH = 1;
        service.setSize(TEST_LINE_WIDTH);

        const RED_VALUE = 120;
        const GREEN_VALUE = 170;
        const BLUE_VALUE = 140;
        const TEST_PRIMARY_COLOR = `rgb(${RED_VALUE}, ${GREEN_VALUE}, ${BLUE_VALUE})`;
        const TEST_SECONDARY_COLOR = 'black';
        service.setPrimaryColor(TEST_PRIMARY_COLOR);
        service.setSecondaryColor(TEST_SECONDARY_COLOR);

        mouseEvent = { offsetX: 0, offsetY: 0, button: MouseConstants.MouseButton.Left } as MouseEvent;
        service.onMouseDown(mouseEvent);
        const TEST_X_OFFSET = 3;
        const TEST_Y_OFFSET = 3;
        mouseEvent = { offsetX: TEST_X_OFFSET, offsetY: TEST_Y_OFFSET, button: MouseConstants.MouseButton.Left } as MouseEvent;
        service.onMouseUp(mouseEvent);

        const START_X = 0 + TEST_LINE_WIDTH / 2;
        const START_Y = 0 + TEST_LINE_WIDTH / 2;
        const WIDTH = TEST_X_OFFSET - TEST_LINE_WIDTH;
        const HEIGHT = TEST_Y_OFFSET - TEST_LINE_WIDTH;
        testCtx.beginPath();
        testCtx.lineJoin = 'miter';
        testCtx.fillStyle = TEST_PRIMARY_COLOR;
        testCtx.strokeStyle = TEST_PRIMARY_COLOR;
        testCtx.lineWidth = TEST_LINE_WIDTH;
        testCtx.rect(START_X, START_Y, WIDTH, HEIGHT);
        testCtx.stroke();
        testCtx.fill();

        const imageData: ImageData = baseCtxStub.getImageData(0, 0, TEST_X_OFFSET, TEST_Y_OFFSET);
        const testData: ImageData = testCtx.getImageData(0, 0, TEST_X_OFFSET, TEST_Y_OFFSET);
        for (let i = 0; i < imageData.data.length; i++) {
            expect(imageData.data[i]).toEqual(testData.data[i]);
        }
    });

    it('drawRectangle should fill all pixels with border color if width or height to be is smaller than line width.', () => {
        service.setFillMode(ToolConstants.FillMode.OUTLINE);
        const TEST_LINE_WIDTH = 50;
        service.setSize(TEST_LINE_WIDTH);

        const RED_VALUE_PRIMARY = 255;
        const GREEN_VALUE_PRIMARY = 170;
        const BLUE_VALUE_PRIMARY = 120;
        const TEST_PRIMARY_COLOR = `rgb(${RED_VALUE_PRIMARY}, ${GREEN_VALUE_PRIMARY}, ${BLUE_VALUE_PRIMARY})`;
        service.setPrimaryColor(TEST_PRIMARY_COLOR);

        const RED_VALUE_SECONDARY = 100;
        const GREEN_VALUE_SECONDARY = 70;
        const BLUE_VALUE_SECONDARY = 220;
        const TEST_SECONDARY_COLOR = `rgb(${RED_VALUE_SECONDARY}, ${GREEN_VALUE_SECONDARY}, ${BLUE_VALUE_SECONDARY})`;
        service.setSecondaryColor(TEST_SECONDARY_COLOR);

        mouseEvent = { offsetX: 0, offsetY: 0, button: MouseConstants.MouseButton.Left } as MouseEvent;
        service.onMouseDown(mouseEvent);
        const TEST_X_OFFSET = 25;
        const TEST_Y_OFFSET = 20;
        mouseEvent = { offsetX: TEST_X_OFFSET, offsetY: TEST_Y_OFFSET, button: MouseConstants.MouseButton.Left } as MouseEvent;
        service.onMouseUp(mouseEvent);

        const START_X = RectangleConstants.MIN_BORDER_WIDTH / 2;
        const START_Y = RectangleConstants.MIN_BORDER_WIDTH / 2;
        const WIDTH = TEST_X_OFFSET - RectangleConstants.MIN_BORDER_WIDTH;
        const HEIGHT = TEST_Y_OFFSET - RectangleConstants.MIN_BORDER_WIDTH;
        testCtx.beginPath();
        testCtx.lineJoin = 'miter';
        testCtx.rect(START_X, START_Y, WIDTH, HEIGHT);
        testCtx.strokeStyle = TEST_SECONDARY_COLOR;
        testCtx.lineWidth = RectangleConstants.MIN_BORDER_WIDTH;
        testCtx.stroke();
        testCtx.fillStyle = TEST_SECONDARY_COLOR;
        testCtx.fill();

        const imageData: ImageData = baseCtxStub.getImageData(0, 0, TEST_X_OFFSET, TEST_Y_OFFSET);
        const testData: ImageData = testCtx.getImageData(0, 0, TEST_X_OFFSET, TEST_Y_OFFSET);
        for (let i = 0; i < imageData.data.length; i++) {
            expect(imageData.data[i]).toEqual(testData.data[i]);
        }
    });

    it('drawRectangle should fill only border with line width between start and end on FillMode.OUTLINE.', () => {
        service.setFillMode(ToolConstants.FillMode.OUTLINE);

        const TEST_LINE_WIDTH = 1;
        service.setSize(TEST_LINE_WIDTH);

        const RED_VALUE_PRIMARY = 255;
        const GREEN_VALUE_PRIMARY = 170;
        const BLUE_VALUE_PRIMARY = 120;
        service.setPrimaryColor(`rgb(${RED_VALUE_PRIMARY}, ${GREEN_VALUE_PRIMARY}, ${BLUE_VALUE_PRIMARY})`);

        const RED_VALUE_SECONDARY = 100;
        const GREEN_VALUE_SECONDARY = 70;
        const BLUE_VALUE_SECONDARY = 220;
        const TEST_SECONDARY_COLOR = `rgb(${RED_VALUE_SECONDARY}, ${GREEN_VALUE_SECONDARY}, ${BLUE_VALUE_SECONDARY})`;
        service.setSecondaryColor(TEST_SECONDARY_COLOR);

        mouseEvent = { offsetX: 0, offsetY: 0, button: MouseConstants.MouseButton.Left } as MouseEvent;
        service.onMouseDown(mouseEvent);
        const TEST_X_OFFSET = 25;
        const TEST_Y_OFFSET = 25;
        mouseEvent = { offsetX: TEST_X_OFFSET, offsetY: TEST_Y_OFFSET, button: MouseConstants.MouseButton.Left } as MouseEvent;
        service.onMouseUp(mouseEvent);

        const START_X = 0 + TEST_LINE_WIDTH / 2;
        const START_Y = 0 + TEST_LINE_WIDTH / 2;
        const WIDTH = TEST_X_OFFSET - TEST_LINE_WIDTH;
        const HEIGHT = TEST_Y_OFFSET - TEST_LINE_WIDTH;
        testCtx.beginPath();
        testCtx.lineJoin = 'miter';
        testCtx.strokeStyle = TEST_SECONDARY_COLOR;
        testCtx.lineWidth = RectangleConstants.MIN_BORDER_WIDTH;
        testCtx.rect(START_X, START_Y, WIDTH, HEIGHT);
        testCtx.stroke();

        const imageData: ImageData = baseCtxStub.getImageData(0, 0, TEST_X_OFFSET, TEST_Y_OFFSET);
        const testData: ImageData = testCtx.getImageData(0, 0, TEST_X_OFFSET, TEST_Y_OFFSET);
        for (let i = 0; i < imageData.data.length; i++) {
            expect(imageData.data[i]).toEqual(testData.data[i]);
        }
    });
});
