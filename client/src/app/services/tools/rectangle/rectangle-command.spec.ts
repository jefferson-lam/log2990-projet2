import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as RectangleConstants from '@app/constants/rectangle-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { RectangleCommand } from '@app/services/tools/rectangle/rectangle-command';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';

// tslint:disable:no-any
describe('RectangleCommand', () => {
    let command: RectangleCommand;
    let rectangleService: RectangleService;

    let pathStub: Vec2[];

    let drawRectangleSpy: jasmine.Spy;
    let drawRectangleTypeSpy: jasmine.Spy;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let testCanvas: HTMLCanvasElement;
    let testCtx: CanvasRenderingContext2D;

    // Constants
    const BIG_TEST_LINE_WIDTH = 50;
    const TEST_LINE_WIDTH = 1;
    const RED_VALUE = 120;
    const GREEN_VALUE = 170;
    const BLUE_VALUE = 140;
    const TEST_PRIMARY_COLOR = `rgb(${RED_VALUE}, ${GREEN_VALUE}, ${BLUE_VALUE})`;
    const TEST_SECONDARY_COLOR = 'black';
    const TEST_X_OFFSET = 3;
    const TEST_Y_OFFSET = 3;
    const START_X = 0 + TEST_LINE_WIDTH / 2;
    const START_Y = 0 + TEST_LINE_WIDTH / 2;
    const WIDTH = TEST_X_OFFSET - TEST_LINE_WIDTH;
    const HEIGHT = TEST_Y_OFFSET - TEST_LINE_WIDTH;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        rectangleService = TestBed.inject(RectangleService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        pathStub = [
            { x: 0, y: 0 },
            { x: TEST_X_OFFSET, y: TEST_Y_OFFSET },
        ] as Vec2[];

        testCanvas = document.createElement('canvas');
        testCtx = testCanvas.getContext('2d') as CanvasRenderingContext2D;

        rectangleService.cornerCoords = Object.assign([], pathStub);

        rectangleService.setLineWidth(TEST_LINE_WIDTH);
        rectangleService.primaryColor = TEST_PRIMARY_COLOR;
        rectangleService.secondaryColor = TEST_SECONDARY_COLOR;

        command = new RectangleCommand(baseCtxStub, rectangleService);
        drawRectangleSpy = spyOn<any>(command, 'drawRectangle').and.callThrough();
        drawRectangleTypeSpy = spyOn<any>(command, 'drawTypeRectangle').and.callThrough();
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('execute should call drawRectangle', () => {
        command.execute();

        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('setValues should set values', () => {
        command.setValues({} as CanvasRenderingContext2D, rectangleService);

        expect(command.isSquare).toEqual(rectangleService.isSquare);
        expect(command.lineWidth).toEqual(rectangleService.lineWidth);
        expect(command.fillMode).toEqual(rectangleService.fillMode);
        expect(command.primaryColor).toEqual(rectangleService.primaryColor);
        expect(command.secondaryColor).toEqual(rectangleService.secondaryColor);
        expect(command.cornerCoords).toEqual(rectangleService.cornerCoords);
    });

    it('drawRectangle should call drawTypeRectangle with unchanged width & height if smaller or equal to lineWidth', () => {
        const width = command.cornerCoords[RectangleConstants.END_INDEX].x - command.cornerCoords[RectangleConstants.START_INDEX].x;
        const height = command.cornerCoords[RectangleConstants.END_INDEX].y - command.cornerCoords[RectangleConstants.START_INDEX].y;

        command.isSquare = false;
        command.lineWidth = width;
        command.fillMode = ToolConstants.FillMode.FILL_ONLY;

        // tslint:disable:no-string-literal
        command['drawRectangle'](command['ctx'], command.cornerCoords);

        expect(drawRectangleTypeSpy).toHaveBeenCalled();
        expect(drawRectangleTypeSpy).toHaveBeenCalledWith(
            baseCtxStub,
            pathStub,
            width,
            height,
            ToolConstants.FillMode.OUTLINE_FILL,
            RectangleConstants.MIN_BORDER_WIDTH,
            command.primaryColor,
            command.primaryColor,
        );
    });

    it('drawRectangle should call drawTypeRectangle with shortestSide of width & height if smaller or equal to lineWidth and isSquare', () => {
        let width = command.cornerCoords[RectangleConstants.END_INDEX].x - command.cornerCoords[RectangleConstants.START_INDEX].x;
        let height = command.cornerCoords[RectangleConstants.END_INDEX].y - command.cornerCoords[RectangleConstants.START_INDEX].y;

        const shortestSide = Math.min(Math.abs(width), Math.abs(height));
        width = Math.sign(width) * shortestSide;
        height = Math.sign(height) * shortestSide;

        command.isSquare = true;
        command.lineWidth = width;
        command.fillMode = ToolConstants.FillMode.FILL_ONLY;

        // tslint:disable:no-string-literal
        command['drawRectangle'](command['ctx'], command.cornerCoords);

        expect(drawRectangleTypeSpy).toHaveBeenCalled();
        expect(drawRectangleTypeSpy).toHaveBeenCalledWith(
            baseCtxStub,
            pathStub,
            width,
            height,
            ToolConstants.FillMode.OUTLINE_FILL,
            RectangleConstants.MIN_BORDER_WIDTH,
            command.primaryColor,
            command.primaryColor,
        );
    });

    it('drawRectangle should call drawTypeRectangle with changed width & height if bigger than lineWidth', () => {
        const width = command.cornerCoords[RectangleConstants.END_INDEX].x - command.cornerCoords[RectangleConstants.START_INDEX].x;
        const height = command.cornerCoords[RectangleConstants.END_INDEX].y - command.cornerCoords[RectangleConstants.START_INDEX].y;

        command.isSquare = false;
        command.lineWidth = Math.min(Math.abs(height), Math.abs(width)) - 1;
        command.fillMode = ToolConstants.FillMode.FILL_ONLY;

        const expectedWidth = width - Math.sign(width) * command.lineWidth;
        const expectedHeight = height - Math.sign(height) * command.lineWidth;

        // tslint:disable:no-string-literal
        command['drawRectangle'](command['ctx'], command.cornerCoords);

        expect(drawRectangleTypeSpy).toHaveBeenCalled();
        expect(drawRectangleTypeSpy).toHaveBeenCalledWith(
            baseCtxStub,
            pathStub,
            expectedWidth,
            expectedHeight,
            command.fillMode,
            command.lineWidth,
            command.primaryColor,
            command.primaryColor,
        );
    });

    it('FillMode.FILL_ONLY should fill all pixels between start and end point with the same color.', () => {
        rectangleService.fillMode = ToolConstants.FillMode.FILL_ONLY;

        command.setValues(baseCtxStub, rectangleService);
        command.execute();

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
        rectangleService.fillMode = ToolConstants.FillMode.OUTLINE;
        rectangleService.setLineWidth(BIG_TEST_LINE_WIDTH);

        command.setValues(baseCtxStub, rectangleService);
        command.execute();

        testCtx.beginPath();
        testCtx.lineJoin = 'miter';
        testCtx.rect(START_X, START_Y, TEST_X_OFFSET, TEST_Y_OFFSET);
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
        rectangleService.fillMode = ToolConstants.FillMode.OUTLINE;

        command.setValues(baseCtxStub, rectangleService);
        command.execute();

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
