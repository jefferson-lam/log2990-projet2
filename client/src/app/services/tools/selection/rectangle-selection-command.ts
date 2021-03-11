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

    execute() {
        this.ctx.clearRect(this.cornerCoords[0].x, this.cornerCoords[0].y, this.selectionWidth, this.selectionHeight);
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

    cloneCanvas(selectionCanvas: HTMLCanvasElement) {
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');
        newCanvas.width = selectionCanvas.width;
        newCanvas.height = selectionCanvas.height;
        //apply the old canvas to the new one
        context?.drawImage(selectionCanvas, 0, 0);

        //return the new canvas
        return newCanvas;
    }
}
