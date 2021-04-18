import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { ROTATION } from '@app/constants/ellipse-constants';
import { END_ANGLE, END_INDEX, START_ANGLE, START_INDEX } from '@app/constants/shapes-constants';
import { ClipboardService } from './clipboard.service';
import { EllipseClipboardCommand } from './ellipse-clipboard-command';

describe('EllipseClipboardCommandService', () => {
    let command: EllipseClipboardCommand;
    let clipboardService: ClipboardService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    let baseCtxFillSpy: jasmine.Spy;
    let ellipseCtxSpy: jasmine.Spy;

    const TEST_X_OFFSET = 3;
    const TEST_Y_OFFSET = 3;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        clipboardService = TestBed.inject(ClipboardService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        clipboardService.pathData = [
            { x: 0, y: 0 },
            { x: TEST_X_OFFSET, y: TEST_Y_OFFSET },
        ] as Vec2[];
        clipboardService.isCircle = false;

        baseCtxFillSpy = spyOn(baseCtxStub, 'fill').and.callThrough();
        ellipseCtxSpy = spyOn(baseCtxStub, 'ellipse').and.callThrough();

        command = new EllipseClipboardCommand(baseCtxStub, clipboardService);
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('setValues should bind correct values to Command', () => {
        command.setValues(baseCtxStub, clipboardService);
        expect(command.isCircle).toEqual(clipboardService.isCircle);
        expect(command.pathData).toEqual(clipboardService.pathData);
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
    });

    it('getEllipseCenter should set displacement to shortest side if isCircle', () => {
        const start = command.pathData[START_INDEX];
        const end = command.pathData[END_INDEX];

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

        const start = command.pathData[START_INDEX];

        const end = command.pathData[END_INDEX];

        const xRadius = Math.abs(end.x - start.x) / 2;
        const yRadius = Math.abs(end.y - start.y) / 2;

        const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));

        // tslint:disable:no-string-literal
        const radii = command['getRadiiXAndY'](command.pathData);

        expect(radii[0]).toEqual(shortestSide);
        expect(radii[1]).toEqual(shortestSide);
    });
});
