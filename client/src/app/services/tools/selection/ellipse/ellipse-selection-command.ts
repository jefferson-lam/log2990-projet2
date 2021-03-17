import { Command } from '@app/classes/command';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';

export class EllipseSelectionCommand extends Command {
    constructor(canvasContext: CanvasRenderingContext2D, selectionCanvas: HTMLCanvasElement, ellipseSelectionService: EllipseSelectionService) {
        super();
        this.setValues(canvasContext, selectionCanvas, ellipseSelectionService);
    }
    setValues(canvasContext: CanvasRenderingContext2D, selectionCanvas: HTMLCanvasElement, ellipseSelectionService: EllipseSelectionService): void {}

    execute(): void {}
}
