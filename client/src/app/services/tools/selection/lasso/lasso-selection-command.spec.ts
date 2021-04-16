import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { LassoSelectionCommand } from '@app/services/tools/selection/lasso/lasso-selection-command';
import { LassoSelectionService } from './lasso-selection';

describe('LassoSelectionCommand', () => {
    let command: LassoSelectionCommand;
    let lassoSelectionService: LassoSelectionService;
    let pathStub: Vec2[];

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let selectionCtxStub: CanvasRenderingContext2D;

    const TOP_LEFT = { x: 13, y: 50 };
    const TEST_SELECTION_WIDTH = 3;
    const TEST_SELECTION_HEIGHT = 3;
    const TEST_TRANSFORM_X = 250;
    const TEST_TRANSFORM_Y = 300;
    const TEST_TRANSFORM_VALUES = {
        x: TEST_TRANSFORM_X,
        y: TEST_TRANSFORM_Y,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        lassoSelectionService = TestBed.inject(LassoSelectionService);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        selectionCtxStub = canvasTestHelper.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;

        pathStub = [
            { x: 394, y: 432 },
            { x: 133, y: 256 },
            { x: 257, y: 399 },
            { x: 394, y: 432 },
        ] as Vec2[];

        lassoSelectionService.linePathData = Object.assign([], pathStub);
        lassoSelectionService.transformValues = TEST_TRANSFORM_VALUES;
        lassoSelectionService.selectionHeight = TEST_SELECTION_HEIGHT;
        lassoSelectionService.selectionWidth = TEST_SELECTION_WIDTH;
        lassoSelectionService.topLeft = TOP_LEFT;

        selectionCtxStub.canvas.width = TEST_SELECTION_WIDTH;
        selectionCtxStub.canvas.height = TEST_SELECTION_HEIGHT;

        command = new LassoSelectionCommand(baseCtxStub, selectionCtxStub.canvas, lassoSelectionService);
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('setValues should set correct values', () => {
        command.setValues(baseCtxStub, selectionCtxStub.canvas, lassoSelectionService);
        expect(command.selectionCanvas).toEqual(selectionCtxStub.canvas);
        expect(command.selectionHeight).toEqual(TEST_SELECTION_HEIGHT);
        expect(command.selectionWidth).toEqual(TEST_SELECTION_WIDTH);
        expect(command.transformValues).toEqual(TEST_TRANSFORM_VALUES);
    });

    it('execute should correctly fill lasso shape', () => {
        // tslint:disable:no-any
        const fillLassoSpy = spyOn<any>(command, 'fillLasso');
        const baseCtxDrawImageSpy = spyOn(baseCtxStub, 'drawImage');
        command.isFromClipboard = false;
        command.execute();
        expect(fillLassoSpy).toHaveBeenCalled();
        expect(fillLassoSpy).toHaveBeenCalledWith(baseCtxStub, pathStub, 'white');
        expect(baseCtxDrawImageSpy).toHaveBeenCalled();
        expect(baseCtxDrawImageSpy).toHaveBeenCalledWith(
            selectionCtxStub.canvas,
            0,
            0,
            TEST_SELECTION_WIDTH,
            TEST_SELECTION_HEIGHT,
            TEST_TRANSFORM_VALUES.x,
            TEST_TRANSFORM_VALUES.y,
            TEST_SELECTION_WIDTH,
            TEST_SELECTION_HEIGHT,
        );
    });

    it('execute should correctly not fill lasso shape if from clipboard', () => {
        // tslint:disable:next:no-any
        const fillLassoSpy = spyOn<any>(command, 'fillLasso');
        const baseCtxDrawImageSpy = spyOn(baseCtxStub, 'drawImage');
        command.isFromClipboard = true;
        command.execute();
        expect(fillLassoSpy).not.toHaveBeenCalled();
        expect(baseCtxDrawImageSpy).toHaveBeenCalled();
        expect(baseCtxDrawImageSpy).toHaveBeenCalledWith(
            selectionCtxStub.canvas,
            0,
            0,
            TEST_SELECTION_WIDTH,
            TEST_SELECTION_HEIGHT,
            TEST_TRANSFORM_VALUES.x,
            TEST_TRANSFORM_VALUES.y,
            TEST_SELECTION_WIDTH,
            TEST_SELECTION_HEIGHT,
        );
    });

    it('fillLasso should fill the correct path', () => {
        const moveToSpy = spyOn(baseCtxStub, 'moveTo');
        const lineToSpy = spyOn(baseCtxStub, 'lineTo');
        const fillSpy = spyOn(baseCtxStub, 'fill');

        // tslint:disable:no-string-literal
        command['fillLasso'](baseCtxStub, command.linePathData, 'white');
        expect(moveToSpy).toHaveBeenCalled();
        for (const point of command.linePathData) {
            expect(lineToSpy).toHaveBeenCalledWith(point.x, point.y);
        }
        expect(fillSpy).toHaveBeenCalled();
    });
});
