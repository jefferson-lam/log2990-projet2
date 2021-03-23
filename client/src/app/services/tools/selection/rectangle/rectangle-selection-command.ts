import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { RectangleSelectionService } from './rectangle-selection-service';

export class RectangleSelectionCommand extends Command {
    selectionWidth: number;
    selectionHeight: number;
    transformValues: Vec2;
    isSquare: boolean;
    cornerCoords: Vec2[] = [];
    selectionCanvas: HTMLCanvasElement;

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
        this.selectionHeight = rectangleSelectionService.selectionHeight;
        this.selectionWidth = rectangleSelectionService.selectionWidth;
        this.transformValues = rectangleSelectionService.transformValues;
        this.isSquare = rectangleSelectionService.isSquare;
    }

    execute(): void {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.cornerCoords[0].x, this.cornerCoords[0].y, this.selectionWidth, this.selectionHeight);
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

    cloneCanvas(selectionCanvas: HTMLCanvasElement): HTMLCanvasElement {
        const newCanvas = document.createElement('canvas');
        const context = newCanvas.getContext('2d') as CanvasRenderingContext2D;
        newCanvas.width = selectionCanvas.width;
        newCanvas.height = selectionCanvas.height;
        context.drawImage(selectionCanvas, 0, 0);
        return newCanvas;
    }
}
