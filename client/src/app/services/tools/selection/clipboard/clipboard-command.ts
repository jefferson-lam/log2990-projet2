import { Command } from '@app/classes/command';
import { ClipboardService } from './clipboard.service';

export class ClipboardCommand extends Command {
    constructor(canvasContext: CanvasRenderingContext2D, clipboardService: ClipboardService) {
        super();
        this.setValues(canvasContext);
    }

    setValues(canvasContext: CanvasRenderingContext2D): void {
        this.ctx = canvasContext;
    }

    execute(): void {}
}
