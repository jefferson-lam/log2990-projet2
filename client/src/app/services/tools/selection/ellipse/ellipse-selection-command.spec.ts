import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { END_ANGLE, END_INDEX, ROTATION, START_ANGLE, START_INDEX } from '@app/constants/ellipse-constants';
import { OFFSET_RADIUS } from '@app/constants/selection-constants';
import { EllipseSelectionCommand } from './ellipse-selection-command';
import { EllipseSelectionService } from './ellipse-selection-service';

fdescribe('EllipseSelectionCommandService', () => {
    let command: EllipseSelectionCommand;
    let ellipseSelectionService: EllipseSelectionService;
    let pathStub: Vec2[];

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    let selectionCtxStub: CanvasRenderingContext2D;

    let baseCtxFillSpy: jasmine.Spy;
    let baseCtxDrawImageSpy: jasmine.Spy;
    let restoreCtxSpy: jasmine.Spy;
    let ellipseCtxSpy: jasmine.Spy;
    let clipCtxSpy: jasmine.Spy;

    // Constants
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
    const TEST_IS_CIRCLE = false;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ellipseSelectionService = TestBed.inject(EllipseSelectionService);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        selectionCtxStub = canvasTestHelper.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;

        pathStub = [
            { x: 0, y: 0 },
            { x: TEST_X_OFFSET, y: TEST_Y_OFFSET },
        ] as Vec2[];

        ellipseSelectionService.cornerCoords = Object.assign([], pathStub);
        ellipseSelectionService.selectionHeight = TEST_SELECTION_HEIGHT;
        ellipseSelectionService.selectionWidth = TEST_SELECTION_WIDTH;
        ellipseSelectionService.transformValues = TEST_TRANSFORM_VALUES;
        ellipseSelectionService.isCircle = TEST_IS_CIRCLE;

        baseCtxFillSpy = spyOn(baseCtxStub, 'fill').and.callThrough();
        baseCtxDrawImageSpy = spyOn(baseCtxStub, 'drawImage').and.callThrough();
        restoreCtxSpy = spyOn(baseCtxStub, 'restore').and.callThrough();
        ellipseCtxSpy = spyOn(baseCtxStub, 'ellipse').and.callThrough();
        clipCtxSpy = spyOn(baseCtxStub, 'clip').and.callThrough();

        command = new EllipseSelectionCommand(baseCtxStub, selectionCtxStub.canvas, ellipseSelectionService);
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('setValues should bind correct values to Command', () => {
        command.setValues(baseCtxStub, selectionCtxStub.canvas, ellipseSelectionService);
        expect(command.selectionCanvas).toEqual(selectionCtxStub.canvas);
        expect(command.selectionHeight).toEqual(TEST_SELECTION_HEIGHT);
        expect(command.selectionWidth).toEqual(TEST_SELECTION_WIDTH);
        expect(command.transformValues).toEqual(TEST_TRANSFORM_VALUES);
        expect(command.isCircle).toEqual(TEST_IS_CIRCLE);
    });

    it('execute should correctly call with correct parameters', () => {
        command.execute();
        const expectedStartX = 1.5;
        const expectedStartY = 1.5;
        const expectedXRadius = 1.5;
        const expectedYRadius = 1.5;
        expect(ellipseCtxSpy).toHaveBeenCalledWith(
            expectedStartX,
            expectedStartY,
            expectedXRadius,
            expectedYRadius,
            ROTATION,
            START_ANGLE,
            END_ANGLE,
        );
        expect(baseCtxFillSpy).toHaveBeenCalled();
        expect(baseCtxDrawImageSpy).toHaveBeenCalled();
        expect(restoreCtxSpy).toHaveBeenCalled();
    });

    it('cloneCanvas should return a cloned copy of canvas passed in parameter', () => {
        const clonedCanvas: HTMLCanvasElement = command.cloneCanvas(canvasTestHelper.selectionCanvas);
        expect(clonedCanvas).toEqual(canvasTestHelper.selectionCanvas);
    });

    it('clipEllipse should clip correct path', () => {
        const size = 250;
        const expectedStartX = 125;
        const expectedStartY = 125;
        const expectedXRadius = 125 - OFFSET_RADIUS;
        const expectedYRadius = 125 - OFFSET_RADIUS;
        command.clipEllise(baseCtxStub, { x: 0, y: 0 }, size, size);
        expect(ellipseCtxSpy).toHaveBeenCalledWith(
            expectedStartX,
            expectedStartY,
            expectedXRadius,
            expectedYRadius,
            ROTATION,
            START_ANGLE,
            END_ANGLE,
        );
        expect(clipCtxSpy).toHaveBeenCalled();
    });

    it('getEllipseCenter should set displacement to shortest side if isCircle', () => {
        const start = command.cornerCoords[START_INDEX];
        const end = command.cornerCoords[END_INDEX];

        const shortestSide = Math.min(Math.abs(end.x - start.x) / 2, Math.abs(end.y - start.y) / 2);

        const xVector = end.x - start.x;
        const yVector = end.y - start.y;

        // tslint:disable:no-string-literal
        const center = command['getEllipseCenter'](start, end, true);

        expect(center.x).toEqual(start.x + Math.sign(xVector) * shortestSide);
        expect(center.y).toEqual(start.y + Math.sign(yVector) * shortestSide);
    });

    it('getRadiiXAndY should set radius to shortest side if isCircle', () => {
        command.isCircle = true;

        const start = command.cornerCoords[START_INDEX];

        const end = command.cornerCoords[END_INDEX];

        const xRadius = Math.abs(end.x - start.x) / 2;
        const yRadius = Math.abs(end.y - start.y) / 2;

        const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));

        // tslint:disable:no-string-literal
        const radii = command['getRadiiXAndY'](command.cornerCoords);

        expect(radii[0]).toEqual(shortestSide);
        expect(radii[1]).toEqual(shortestSide);
    });
});
