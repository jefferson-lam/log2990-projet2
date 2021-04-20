import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { LassoSelectionService } from './lasso-selection';
export class LassoSelectionCommand extends Command {
    private selectionWidth: number;
    private selectionHeight: number;
    private transformValues: Vec2;
    topLeft: Vec2;
    private pathData: Vec2[];
    private selectionCanvas: HTMLCanvasElement;
    private isFromClipboard: boolean;

    constructor(canvasContext: CanvasRenderingContext2D, selectionCanvas: HTMLCanvasElement, lassoSelectionService: LassoSelectionService) {
        super();
        this.setValues(canvasContext, selectionCanvas, lassoSelectionService);
    }

    private setValues(
        canvasContext: CanvasRenderingContext2D,
        selectionCanvas: HTMLCanvasElement,
        lassoSelectionService: LassoSelectionService,
    ): void {
        this.ctx = canvasContext;
        this.selectionCanvas = this.cloneCanvas(selectionCanvas);
        this.pathData = Object.assign([], lassoSelectionService.pathData);
        this.selectionHeight = selectionCanvas.height;
        this.selectionWidth = selectionCanvas.width;
        this.transformValues = lassoSelectionService.transformValues;
        this.topLeft = lassoSelectionService.topLeft;
        this.isFromClipboard = lassoSelectionService.isFromClipboard;
    }

    execute(): void {
        if (!this.isFromClipboard) {
            this.fillLasso();
        }
        this.ctx.drawImage(
            this.selectionCanvas,
            0,
            0,
            this.selectionWidth,
            this.selectionHeight,
            this.transformValues.x,
            this.transformValues.y,
            this.selectionWidth,
            this.selectionHeight,
        );
    }

    private fillLasso(): void {
        this.ctx.beginPath();
        this.ctx.moveTo(this.pathData[0].x, this.pathData[0].y);
        for (const point of this.pathData) {
            this.ctx.lineTo(point.x, point.y);
        }
        this.ctx.save();
        this.ctx.clip();
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.restore();
    }
}
