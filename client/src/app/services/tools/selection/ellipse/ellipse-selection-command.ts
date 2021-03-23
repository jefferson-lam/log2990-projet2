import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { END_ANGLE, END_INDEX, ROTATION, START_ANGLE, START_INDEX } from '@app/constants/ellipse-constants';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';

export class EllipseSelectionCommand extends Command {
    selectionWidth: number;
    selectionHeight: number;
    transformValues: Vec2;
    isCircle: boolean;
    cornerCoords: Vec2[] = [];
    selectionCanvas: HTMLCanvasElement;

    constructor(canvasContext: CanvasRenderingContext2D, selectionCanvas: HTMLCanvasElement, ellipseSelectionService: EllipseSelectionService) {
        super();
        this.setValues(canvasContext, selectionCanvas, ellipseSelectionService);
    }
    setValues(canvasContext: CanvasRenderingContext2D, selectionCanvas: HTMLCanvasElement, ellipseSelectionService: EllipseSelectionService): void {
        this.ctx = canvasContext;
        this.cornerCoords = Object.assign([], ellipseSelectionService.cornerCoords);
        this.selectionCanvas = this.cloneCanvas(selectionCanvas);
        this.selectionHeight = ellipseSelectionService.selectionHeight;
        this.selectionWidth = ellipseSelectionService.selectionWidth;
        this.transformValues = ellipseSelectionService.transformValues;
        this.isCircle = ellipseSelectionService.isCircle;
    }

    execute(): void {
        const ellipseCenter = this.getEllipseCenter(this.cornerCoords[START_INDEX], this.cornerCoords[END_INDEX], this.isCircle);
        const startX = ellipseCenter.x;
        const startY = ellipseCenter.y;
        const radiiXAndY = this.getRadiiXAndY(this.cornerCoords);
        const xRadius = radiiXAndY[0];
        const yRadius = radiiXAndY[1];
        this.ctx.beginPath();
        this.ctx.ellipse(startX, startY, xRadius, yRadius, ROTATION, START_ANGLE, END_ANGLE);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();

        // Clip the ctx to only fit the what is inside the outline that is offset by 1
        this.clipEllipse(this.ctx, this.transformValues, this.selectionHeight, this.selectionWidth, 1);
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
        // restore is called because save is called in clipEllipse function.
        this.ctx.restore();
    }

    cloneCanvas(selectionCanvas: HTMLCanvasElement): HTMLCanvasElement {
        const newCanvas = document.createElement('canvas');
        const context = newCanvas.getContext('2d');
        newCanvas.width = selectionCanvas.width;
        newCanvas.height = selectionCanvas.height;
        // apply the old canvas to the new one
        // tslint:disable:no-non-null-assertion
        context!.drawImage(selectionCanvas, 0, 0);
        // return the new canvas
        return newCanvas;
    }

    clipEllipse(ctx: CanvasRenderingContext2D, start: Vec2, height: number, width: number, offset: number): void {
        const end: Vec2 = {
            x: start.x + width,
            y: start.y + height,
        };
        const ellipseCenter = this.getEllipseCenter(start, end, this.isCircle);
        const startX = ellipseCenter.x;
        const startY = ellipseCenter.y;
        const radiiXAndY = this.getRadiiXAndY([start, end]);
        const xRadius = radiiXAndY[0];
        const yRadius = radiiXAndY[1];
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.transformValues.x, this.transformValues.y);
        ctx.ellipse(startX, startY, xRadius + offset, yRadius + offset, ROTATION, START_ANGLE, END_ANGLE);
        ctx.clip();
    }

    private getRadiiXAndY(path: Vec2[]): number[] {
        let xRadius = Math.abs(path[END_INDEX].x - path[START_INDEX].x) / 2;
        let yRadius = Math.abs(path[END_INDEX].y - path[START_INDEX].y) / 2;
        if (this.isCircle) {
            const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));
            xRadius = yRadius = shortestSide;
        }
        return [xRadius, yRadius];
    }

    private getEllipseCenter(start: Vec2, end: Vec2, isCircle: boolean): Vec2 {
        let displacementX: number;
        let displacementY: number;
        const radiusX = Math.abs(end.x - start.x) / 2;
        const radiusY = Math.abs(end.y - start.y) / 2;
        if (isCircle) {
            const shortestSide = Math.min(radiusX, radiusY);
            displacementX = displacementY = shortestSide;
        } else {
            displacementX = radiusX;
            displacementY = radiusY;
        }
        const xVector = end.x - start.x;
        const yVector = end.y - start.y;
        const centerX = start.x + Math.sign(xVector) * displacementX;
        const centerY = start.y + Math.sign(yVector) * displacementY;
        return { x: centerX, y: centerY };
    }
}
