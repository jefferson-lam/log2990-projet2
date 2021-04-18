import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { START_INDEX } from '@app/constants/selection-constants';
import { RectangleSelectionCommand } from './rectangle-selection-command';
import { RectangleSelectionService } from './rectangle-selection-service';

describe('RectangleSelectionCommandService', () => {
    let command: RectangleSelectionCommand;
    let rectangleSelectionService: RectangleSelectionService;

    let pathStub: Vec2[];

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    let selectionCtxStub: CanvasRenderingContext2D;

    let baseCtxFillRectSpy: jasmine.Spy;
    let baseCtxDrawImageSpy: jasmine.Spy;

    const TEST_X_OFFSET = 3;
    const TEST_Y_OFFSET = 3;
    const TEST_SELECTION_WIDTH = 3;
    const TEST_SELECTION_HEIGHT = 3;
    const TEST_TRANSFORM_X = 250;
    const TEST_TRANSFORM_Y = 300;
    const TEST_TRANSFORM_VALUES = {
        x: TEST_TRANSFORM_X,
        y: TEST_TRANSFORM_Y,
    };
    const TEST_IS_SQUARE = false;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        rectangleSelectionService = TestBed.inject(RectangleSelectionService);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        selectionCtxStub = canvasTestHelper.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;

        pathStub = [
            { x: 0, y: 0 },
            { x: TEST_X_OFFSET, y: TEST_Y_OFFSET },
        ] as Vec2[];

        rectangleSelectionService.pathData = Object.assign([], pathStub);
        selectionCtxStub.canvas.height = TEST_SELECTION_HEIGHT;
        selectionCtxStub.canvas.width = TEST_SELECTION_WIDTH;
        rectangleSelectionService.transformValues = TEST_TRANSFORM_VALUES;
        rectangleSelectionService.isSquare = TEST_IS_SQUARE;
        rectangleSelectionService.selectionHeight = TEST_SELECTION_HEIGHT;
        rectangleSelectionService.selectionWidth = TEST_SELECTION_WIDTH;

        baseCtxFillRectSpy = spyOn(baseCtxStub, 'fillRect').and.callThrough();
        baseCtxDrawImageSpy = spyOn(baseCtxStub, 'drawImage').and.callThrough();

        command = new RectangleSelectionCommand(baseCtxStub, selectionCtxStub.canvas, rectangleSelectionService);
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('setValues should bind correct values to Command', () => {
        command.setValues(baseCtxStub, selectionCtxStub.canvas, rectangleSelectionService);
        expect(command.selectionCanvas).toEqual(selectionCtxStub.canvas);
        expect(command.selectionHeight).toEqual(TEST_SELECTION_HEIGHT);
        expect(command.selectionWidth).toEqual(TEST_SELECTION_WIDTH);
        expect(command.initialSelectionHeight).toEqual(TEST_SELECTION_HEIGHT);
        expect(command.initialSelectionWidth).toEqual(TEST_SELECTION_WIDTH);
        expect(command.transformValues).toEqual(TEST_TRANSFORM_VALUES);
        expect(command.isSquare).toEqual(TEST_IS_SQUARE);
    });

    it('execute should correctly clearRect with correct parameters', () => {
        command.execute();
        expect(baseCtxFillRectSpy).toHaveBeenCalled();
        expect(baseCtxFillRectSpy).toHaveBeenCalledWith(
            command.pathData[START_INDEX].x,
            command.pathData[START_INDEX].y,
            command.initialSelectionWidth,
            command.initialSelectionHeight,
        );
        expect(baseCtxDrawImageSpy).toHaveBeenCalled();
    });

    it('execute should not fill shape if isFromClipboard is set to true', () => {
        command.isFromClipboard = true;
        command.execute();
        expect(baseCtxFillRectSpy).not.toHaveBeenCalled();
    });
});
