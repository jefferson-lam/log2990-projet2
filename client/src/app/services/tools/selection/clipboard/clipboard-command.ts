import { Command } from '@app/classes/command';
import { ClipboardService } from '@app/services/tools/selection/clipboard/clipboard.service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';

export class ClipboardCommand extends Command {
    currentTool: RectangleSelectionService | EllipseSelectionService;
    selectionCanvas: HTMLCanvasElement;
    previewSelectionCanvas: HTMLCanvasElement;

    constructor(
        canvasContext: CanvasRenderingContext2D,
        selectionCanvas: HTMLCanvasElement,
        previewSelectionCanvas: HTMLCanvasElement,
        clipboardService: ClipboardService,
    ) {
        super();
        this.setValues(canvasContext, selectionCanvas, previewSelectionCanvas, clipboardService);
    }

    setValues(
        canvasContext: CanvasRenderingContext2D,
        selectionCanvas: HTMLCanvasElement,
        previewSelectionCanvas: HTMLCanvasElement,
        clipboardService: ClipboardService,
    ): void {
        this.ctx = canvasContext;
        this.currentTool = clipboardService.currentTool;
        this.selectionCanvas = selectionCanvas;
        this.previewSelectionCanvas = previewSelectionCanvas;
    }

    execute(): void {
        this.currentTool.resetSelectedToolSettings();
        this.currentTool.resetCanvasState(this.selectionCanvas);
        this.currentTool.resetCanvasState(this.previewSelectionCanvas);
        this.currentTool.resizerHandlerService.resetResizers();
    }
}
