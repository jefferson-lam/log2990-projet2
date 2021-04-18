import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as SelectionConstants from '@app/constants/selection-constants';
import { ClipboardService } from '@app/services/tools/selection/clipboard/clipboard.service';

export class RectangleClipboardCommand extends Command {
    cornerCoords: Vec2[];
    selectionWidth: number;
    selectionHeight: number;

    constructor(canvasContext: CanvasRenderingContext2D, clipboardService: ClipboardService) {
        super();
        this.setValues(canvasContext, clipboardService);
    }

    setValues(canvasContext: CanvasRenderingContext2D, clipboardService: ClipboardService): void {
        this.ctx = canvasContext;
        this.cornerCoords = Object.assign([], clipboardService.cornerCoords);
        this.selectionHeight = clipboardService.selectionHeight;
        this.selectionWidth = clipboardService.selectionWidth;
    }

    execute(): void {
        this.fillRectangle(this.ctx);
    }

    private fillRectangle(baseCtx: CanvasRenderingContext2D): void {
        baseCtx.fillStyle = 'white';
        baseCtx.fillRect(
            this.cornerCoords[SelectionConstants.START_INDEX].x,
            this.cornerCoords[SelectionConstants.START_INDEX].y,
            this.selectionWidth,
            this.selectionHeight,
        );
    }
}
