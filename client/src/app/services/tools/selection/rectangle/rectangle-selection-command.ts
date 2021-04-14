import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { RectangleSelectionService } from './rectangle-selection-service';

export class RectangleSelectionCommand extends Command {
    initialSelectionWidth: number;
    initialSelectionHeight: number;
    selectionWidth: number;
    selectionHeight: number;
    transformValues: Vec2;
    isSquare: boolean;
    cornerCoords: Vec2[] = [];
    selectionCanvas: HTMLCanvasElement;
    isFromClipboard: boolean;

    constructor(canvasContext: CanvasRenderingContext2D, selectionCanvas: HTMLCanvasElement, rectangleSelectionService: RectangleSelectionService) {
        super();
        this.setValues(canvasContext, selectionCanvas, rectangleSelectionService);
    }

    setValues(
        canvasContext: CanvasRenderingContext2D,
        selectionCanvas: HTMLCanvasElement,
        rectangleSelectionService: RectangleSelectionService,
    ): void {
        this.ctx = canvasContext;
        this.cornerCoords = Object.assign([], rectangleSelectionService.cornerCoords);
        this.selectionCanvas = this.cloneCanvas(selectionCanvas);
        this.initialSelectionHeight = rectangleSelectionService.selectionHeight;
        this.initialSelectionWidth = rectangleSelectionService.selectionWidth;
        this.selectionHeight = selectionCanvas.height;
        this.selectionWidth = selectionCanvas.width;
        this.transformValues = rectangleSelectionService.transformValues;
        this.isSquare = rectangleSelectionService.isSquare;
        this.isFromClipboard = rectangleSelectionService.isFromClipboard;
    }

    execute(): void {
        if (!this.isFromClipboard) {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(this.cornerCoords[0].x, this.cornerCoords[0].y, this.initialSelectionWidth, this.initialSelectionHeight);
        }
        // When implementing scaling, we will have to sum selectionWidth and selectionHeight to a
        // the distance scaled by the mouse
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
}
