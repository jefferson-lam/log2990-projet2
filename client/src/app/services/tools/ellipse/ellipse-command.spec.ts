import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as EllipseConstants from '@app/constants/ellipse-constants';
import * as ShapeConstants from '@app/constants/shapes-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { EllipseCommand } from './ellipse-command';

// tslint:disable:no-any
describe('EllipseCommand', () => {
    let command: EllipseCommand;
    let ellipseService: EllipseService;
    let mockPoint: Vec2;
    let mockRadii: number[];

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let testCanvas: HTMLCanvasElement;
    let testCtx: CanvasRenderingContext2D;

    const RED_VALUE = 110;
    const GREEN_VALUE = 225;
    const BLUE_VALUE = 202;
    const OPACITY = 1;
    const TEST_PRIMARY_COLOR = `rgb(${RED_VALUE}, ${GREEN_VALUE}, ${BLUE_VALUE}, ${OPACITY})`;
    const TEST_SECONDARY_COLOR = 'black';
    const TEST_LINE_WIDTH = 1;

    const END_X = 10;
    const END_Y = 15;

    const TEST_START_X = END_X / 2;
    const TEST_START_Y = END_Y / 2;
    const TEST_X_RADIUS = (END_X - TEST_LINE_WIDTH) / 2;
    const TEST_Y_RADIUS = (END_Y - TEST_LINE_WIDTH) / 2;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        ellipseService = TestBed.inject(EllipseService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        mockPoint = { x: 10, y: 10 };
        mockRadii = [END_X, END_Y];

        // Test ellipse to compare
        testCanvas = document.createElement('canvas');
        testCtx = testCanvas.getContext('2d') as CanvasRenderingContext2D;

        ellipseService.setPrimaryColor(TEST_PRIMARY_COLOR);
        ellipseService.setSecondaryColor(TEST_SECONDARY_COLOR);
        ellipseService.setLineWidth(TEST_LINE_WIDTH);
        ellipseService.cornerCoords[0] = { x: 0, y: 0 };
        ellipseService.cornerCoords[1] = { x: END_X, y: END_Y };

        command = new EllipseCommand(baseCtxStub, ellipseService);
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('execute should call drawEllipse', () => {
        const drawEllipseSpy = spyOn<any>(command, 'drawEllipse');
        command.execute();

        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it('setValues should set values', () => {
        command.setValues({} as CanvasRenderingContext2D, ellipseService);

        expect(command.isCircle).toEqual(ellipseService.isCircle);
        expect(command.fillMode).toEqual(ellipseService.fillMode);
        expect(command.primaryColor).toEqual(ellipseService.primaryColor);
        expect(command.secondaryColor).toEqual(ellipseService.secondaryColor);
        expect(command.lineWidth).toEqual(ellipseService.lineWidth);
        expect(command.cornerCoords).toEqual(ellipseService.cornerCoords);
    });

    it('drawEllipse should call getEllipseCenter', () => {
        const getEllipseCenterSpy = spyOn<any>(command, 'getEllipseCenter').and.callThrough();
        // tslint:disable:no-string-literal
        command['drawEllipse'](command['ctx'], command.cornerCoords);

        expect(getEllipseCenterSpy).toHaveBeenCalled();
    });

    it('drawEllipse should call getRadiiXAndY', () => {
        const getRadiiSpy = spyOn<any>(command, 'getRadiiXAndY').and.callFake(() => {
            return mockRadii;
        });
        // tslint:disable:no-string-literal
        command['drawEllipse'](command['ctx'], command.cornerCoords);

        expect(getRadiiSpy).toHaveBeenCalled();
    });

    it('drawEllipse should call drawTypeEllipse with unchanged radius if smaller or equal to half of lineWidth', () => {
        spyOn<any>(command, 'getEllipseCenter').and.callFake(() => {
            return mockPoint;
        });
        spyOn<any>(command, 'getRadiiXAndY').and.callFake(() => {
            return mockRadii;
        });
        const drawTypeSpy = spyOn<any>(command, 'drawTypeEllipse');

        command.fillMode = ToolConstants.FillMode.OUTLINE_FILL;
        command.centerPosition.x = mockPoint.x;
        command.centerPosition.y = mockPoint.y;
        command.radiiPosition.x = mockRadii[0];
        command.radiiPosition.y = mockRadii[1];
        command.borderColor = command.primaryColor;
        command.lineWidth = EllipseConstants.HIDDEN_BORDER_WIDTH;

        // tslint:disable:no-string-literal
        command['drawEllipse'](command['ctx'], command.cornerCoords);

        expect(drawTypeSpy).toHaveBeenCalled();
        expect(drawTypeSpy).toHaveBeenCalledWith(baseCtxStub);
    });

    it('drawEllipse should call drawTypeEllipse with changed radius if radii bigger than lineWidths', () => {
        spyOn<any>(command, 'getEllipseCenter').and.callFake(() => {
            return mockPoint;
        });
        spyOn<any>(command, 'getRadiiXAndY').and.callFake(() => {
            return mockRadii;
        });
        const drawTypeSpy = spyOn<any>(command, 'drawTypeEllipse');

        command.fillMode = ToolConstants.FillMode.FILL_ONLY;
        command.lineWidth = mockRadii[0];
        command.centerPosition.x = mockPoint.x;
        command.centerPosition.y = mockPoint.y;
        command.radiiPosition.x = mockRadii[0] - command.lineWidth / 2;
        command.radiiPosition.y = mockRadii[1] - command.lineWidth / 2;
        command.borderColor = command.primaryColor;

        // tslint:disable:no-string-literal
        command['drawEllipse'](command['ctx'], command.cornerCoords);

        expect(drawTypeSpy).toHaveBeenCalled();
        expect(drawTypeSpy).toHaveBeenCalledWith(baseCtxStub);
    });

    it('should make an ellipse with border and fill color of same color on FillMode.FILL_ONLY', () => {
        ellipseService.setFillMode(ToolConstants.FillMode.FILL_ONLY);

        command.setValues(baseCtxStub, ellipseService);

        command.execute();

        // Trace test ellipse to be compared with stub.
        testCtx.fillStyle = TEST_PRIMARY_COLOR;
        testCtx.beginPath();
        testCtx.ellipse(
            TEST_START_X,
            TEST_START_Y,
            TEST_X_RADIUS + ellipseService.lineWidth / 2,
            TEST_Y_RADIUS + ellipseService.lineWidth / 2,
            EllipseConstants.ROTATION,
            ShapeConstants.START_ANGLE,
            ShapeConstants.END_ANGLE,
        );
        testCtx.fill();

        const imageData: ImageData = baseCtxStub.getImageData(0, 0, END_X, END_Y);
        const testData: ImageData = testCtx.getImageData(0, 0, END_X, END_Y);
        for (let i = 0; i < imageData.data.length; i++) {
            expect(imageData.data[i]).toEqual(testData.data[i]);
        }
    });

    it('should make an ellipse with only border on FillMode.OUTLINE', () => {
        ellipseService.setFillMode(ToolConstants.FillMode.OUTLINE);

        command.setValues(baseCtxStub, ellipseService);

        command.execute();

        // Trace test ellipse to be compared with stub.
        testCtx.save();
        testCtx.beginPath();
        const smallRadii = { x: TEST_X_RADIUS - ellipseService.lineWidth / 2, y: TEST_Y_RADIUS - ellipseService.lineWidth / 2 };
        testCtx.ellipse(
            TEST_START_X,
            TEST_START_Y,
            smallRadii.x,
            smallRadii.y,
            EllipseConstants.ROTATION,
            ShapeConstants.START_ANGLE,
            ShapeConstants.END_ANGLE,
        );
        testCtx.ellipse(
            TEST_START_X,
            TEST_START_Y,
            smallRadii.x + ellipseService.lineWidth,
            smallRadii.y + ellipseService.lineWidth,
            EllipseConstants.ROTATION,
            ShapeConstants.START_ANGLE,
            ShapeConstants.END_ANGLE,
        );
        testCtx.clip('evenodd');
        testCtx.fillStyle = TEST_SECONDARY_COLOR;
        testCtx.fill();
        testCtx.restore();

        const imageData: ImageData = baseCtxStub.getImageData(0, 0, END_X, END_Y);
        const testData: ImageData = testCtx.getImageData(0, 0, END_X, END_Y);
        for (let i = 0; i < imageData.data.length; i++) {
            expect(imageData.data[i]).toEqual(testData.data[i]);
        }
    });

    it('should only call ctx.ellipse once if xRadius is smaller than lineWidth / 2', () => {
        const ellipseSpy = spyOn(command['ctx'], 'ellipse');
        const LINE_WIDTH = 5;

        command.centerPosition.x = mockPoint.x;
        command.centerPosition.y = mockPoint.y;
        command.radiiPosition.x = LINE_WIDTH / 2 - 1;
        command.radiiPosition.y = LINE_WIDTH / 2 - 1;
        command.fillMode = ToolConstants.FillMode.OUTLINE_FILL;
        command.primaryColor = 'black';
        command.borderColor = 'black';
        command.lineWidth = LINE_WIDTH;

        // tslint:disable:no-string-literal
        command['drawTypeEllipse'](command['ctx']);

        expect(ellipseSpy).toHaveBeenCalledTimes(2);
    });

    it('getEllipseCenter should set displacement to shortest side if isCircle', () => {
        const start = command.cornerCoords[ShapeConstants.START_INDEX];
        const end = command.cornerCoords[ShapeConstants.END_INDEX];

        const shortestSide = Math.min(Math.abs(end.x - start.x) / 2, Math.abs(end.y - start.y) / 2);

        const xVector = end.x - start.x;
        const yVector = end.y - start.y;

        // tslint:disable:no-string-literal
        command['getEllipseCenter'](start, end, true);

        expect(command.centerPosition.x).toEqual(start.x + Math.sign(xVector) * shortestSide);
        expect(command.centerPosition.y).toEqual(start.y + Math.sign(yVector) * shortestSide);
    });

    it('getRadiiXAndY should set radius to shortest side if isCircle', () => {
        command.isCircle = true;

        const start = command.cornerCoords[ShapeConstants.START_INDEX];
        const end = command.cornerCoords[ShapeConstants.END_INDEX];

        const xRadius = Math.abs(end.x - start.x) / 2;
        const yRadius = Math.abs(end.y - start.y) / 2;

        const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));

        // tslint:disable:no-string-literal
        command['getRadiiXAndY'](command.cornerCoords);

        expect(command.radiiPosition.x).toEqual(shortestSide);
        expect(command.radiiPosition.y).toEqual(shortestSide);
    });
});
