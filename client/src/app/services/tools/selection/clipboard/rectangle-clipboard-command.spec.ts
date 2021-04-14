import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { START_INDEX } from '@app/constants/selection-constants';
import { ClipboardService } from './clipboard.service';
import { RectangleClipboardCommand } from './rectangle-clipboard-command';

describe('RectangleClipboardCommandService', () => {
    let command: RectangleClipboardCommand;
    let clipboardService: ClipboardService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    let baseCtxFillRectSpy: jasmine.Spy;

    const TEST_X_OFFSET = 3;
    const TEST_Y_OFFSET = 3;
    const TEST_SELECTION_WIDTH = 3;
    const TEST_SELECTION_HEIGHT = 3;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        clipboardService = TestBed.inject(ClipboardService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        clipboardService.cornerCoords = [
            { x: 0, y: 0 },
            { x: TEST_X_OFFSET, y: TEST_Y_OFFSET },
        ] as Vec2[];

        clipboardService.selectionHeight = TEST_SELECTION_HEIGHT;
        clipboardService.selectionWidth = TEST_SELECTION_WIDTH;

        baseCtxFillRectSpy = spyOn(baseCtxStub, 'fillRect').and.callThrough();

        command = new RectangleClipboardCommand(baseCtxStub, clipboardService);
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('setValues should bind correct values to Command', () => {
        command.setValues(baseCtxStub, clipboardService);
        expect(command.selectionHeight).toEqual(clipboardService.selectionHeight);
        expect(command.selectionWidth).toEqual(clipboardService.selectionWidth);
    });

    it('execute should correctly fillRect with correct parameters', () => {
        command.execute();
        expect(baseCtxFillRectSpy).toHaveBeenCalled();
        expect(baseCtxFillRectSpy).toHaveBeenCalledWith(
            command.cornerCoords[START_INDEX].x,
            command.cornerCoords[START_INDEX].y,
            command.selectionWidth,
            command.selectionHeight,
        );
    });
});
