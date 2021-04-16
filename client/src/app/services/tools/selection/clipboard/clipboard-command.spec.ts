import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { ClipboardCommand } from './clipboard-command';
import { ClipboardService } from './clipboard.service';

describe('RectangleClipboardCommandService', () => {
    let command: ClipboardCommand;
    let clipboardService: ClipboardService;
    let resizerHandlerServiceSpy: jasmine.SpyObj<ResizerHandlerService>;
    let rectangleSelectionServiceSpy: RectangleSelectionService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let selectionCanvasStub: HTMLCanvasElement;
    let previewSelectionCanvasStub: HTMLCanvasElement;

    beforeEach(() => {
        resizerHandlerServiceSpy = jasmine.createSpyObj('ResizerHandlerService', ['resetResizers']);
        drawServiceSpy = jasmine.createSpyObj(
            'DrawingService',
            ['clearCanvas'],
            ['baseCtx', 'selectionCtx', 'selectionCanvas', 'previewSelectionCanvas'],
        );
        rectangleSelectionServiceSpy = new RectangleSelectionService(
            drawServiceSpy,
            {} as UndoRedoService,
            resizerHandlerServiceSpy,
            new RectangleService(drawServiceSpy, {} as UndoRedoService),
        );

        TestBed.configureTestingModule({});
        clipboardService = TestBed.inject(ClipboardService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        selectionCanvasStub = canvasTestHelper.selectionCanvas;
        previewSelectionCanvasStub = canvasTestHelper.previewSelectionCanvas;

        command = new ClipboardCommand(baseCtxStub, selectionCanvasStub, previewSelectionCanvasStub, clipboardService);
        command.currentTool = rectangleSelectionServiceSpy;
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('setValues should bind correct values to Command', () => {
        command.setValues(baseCtxStub, selectionCanvasStub, previewSelectionCanvasStub, clipboardService);
        expect(command.selectionCanvas).toEqual(canvasTestHelper.selectionCanvas);
        expect(command.previewSelectionCanvas).toEqual(canvasTestHelper.previewSelectionCanvas);
        expect(command.currentTool).toEqual(clipboardService.currentTool);
    });

    it('execute should correctly delete selection with correct parameters', () => {
        const resetSettingsSpy = spyOn(command.currentTool, 'resetSelectedToolSettings');
        const resetCanvasStateSpy = spyOn(command.currentTool, 'resetCanvasState');
        command.execute();
        expect(resetSettingsSpy).toHaveBeenCalled();
        expect(resetCanvasStateSpy).toHaveBeenCalledWith(selectionCanvasStub);
        expect(resetCanvasStateSpy).toHaveBeenCalledWith(previewSelectionCanvasStub);
        expect(resizerHandlerServiceSpy.resetResizers).toHaveBeenCalled();
    });
});
