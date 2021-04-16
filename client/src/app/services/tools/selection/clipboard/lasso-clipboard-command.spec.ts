import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { ClipboardService } from './clipboard.service';
import { LassoClipboardCommand } from './lasso-clipboard-command';

describe('LassoClipboardCommand', () => {
    let command: LassoClipboardCommand;
    let clipboardService: ClipboardService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    let pathStub: Vec2[];

    beforeEach(() => {
        TestBed.configureTestingModule({});
        clipboardService = TestBed.inject(ClipboardService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        pathStub = [
            { x: 394, y: 432 },
            { x: 133, y: 256 },
            { x: 257, y: 399 },
            { x: 394, y: 432 },
        ] as Vec2[];
        clipboardService.cornerCoords = Object.assign([], pathStub);

        command = new LassoClipboardCommand(baseCtxStub, clipboardService);
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('setValues should bind correct values to Command', () => {
        command.setValues(baseCtxStub, clipboardService);
        expect(command.pathData).toEqual(clipboardService.cornerCoords);
    });

    it('execute should correctly call with correct parameters', () => {
        // tslint:disable:no-any
        const fillLassoSpy = spyOn<any>(command, 'fillLasso');
        command.execute();
        expect(fillLassoSpy).toHaveBeenCalled();
    });

    it('fillLasso should fill the correct path', () => {
        const moveToSpy = spyOn(baseCtxStub, 'moveTo');
        const lineToSpy = spyOn(baseCtxStub, 'lineTo');
        const fillSpy = spyOn(baseCtxStub, 'fill');
        // tslint:disable:no-string-literal
        command['fillLasso'](baseCtxStub, command.pathData, 'white');
        expect(moveToSpy).toHaveBeenCalled();
        for (const point of command.pathData) {
            expect(lineToSpy).toHaveBeenCalledWith(point.x, point.y);
        }
        expect(fillSpy).toHaveBeenCalled();
    });
});
