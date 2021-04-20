import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { ROTATION } from '@app/constants/ellipse-constants';
import { END_ANGLE, END_INDEX, START_ANGLE, START_INDEX } from '@app/constants/shapes-constants';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';

export class EllipseSelectionCommand extends Command {
    private selectionWidth: number;
    private selectionHeight: number;
    private transformValues: Vec2;
    private isCircle: boolean;
    private pathData: Vec2[];
    private selectionCanvas: HTMLCanvasElement;
    private isFromClipboard: boolean;

    constructor(canvasContext: CanvasRenderingContext2D, selectionCanvas: HTMLCanvasElement, ellipseSelectionService: EllipseSelectionService) {
        super();
        this.setValues(canvasContext, selectionCanvas, ellipseSelectionService);
    }

    private setValues(
        canvasContext: CanvasRenderingContext2D,
        selectionCanvas: HTMLCanvasElement,
        ellipseSelectionService: EllipseSelectionService,
    ): void {
        this.ctx = canvasContext;
        this.pathData = Object.assign([], ellipseSelectionService.pathData);
        this.selectionCanvas = this.cloneCanvas(selectionCanvas);
        this.selectionHeight = selectionCanvas.height;
        this.selectionWidth = selectionCanvas.width;
        this.transformValues = ellipseSelectionService.transformValues;
        this.isCircle = ellipseSelectionService.isCircle;
        this.isFromClipboard = ellipseSelectionService.isFromClipboard;
    }

    execute(): void {
        const ellipseCenter = this.getEllipseCenter(this.pathData[START_INDEX], this.pathData[END_INDEX], this.isCircle);
        const radiiXAndY = this.getRadiiXAndY(this.pathData);

        if (!this.isFromClipboard) {
            this.ctx.beginPath();
            this.ctx.ellipse(ellipseCenter.x, ellipseCenter.y, radiiXAndY.x, radiiXAndY.y, ROTATION, START_ANGLE, END_ANGLE);
            this.ctx.fillStyle = 'white';
            this.ctx.fill();
        }

        // Clip the ctx to only fit the what is inside the outline that is offset by 1
        this.clipEllipse(this.ctx);
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

    private clipEllipse(ctx: CanvasRenderingContext2D): void {
        const end: Vec2 = {
            x: this.transformValues.x + this.selectionWidth,
            y: this.transformValues.y + this.selectionHeight,
        };
        const ellipseCenter = this.getEllipseCenter(this.transformValues, end, this.isCircle);
        const radiiXAndY = this.getRadiiXAndY([this.transformValues, end]);
        const offset = 1;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.transformValues.x, this.transformValues.y);
        ctx.ellipse(ellipseCenter.x, ellipseCenter.y, radiiXAndY.x + offset, radiiXAndY.y + offset, ROTATION, START_ANGLE, END_ANGLE);
        ctx.clip();
    }

    private getRadiiXAndY(path: Vec2[]): Vec2 {
        let xRadius = Math.abs(path[END_INDEX].x - path[START_INDEX].x) / 2;
        let yRadius = Math.abs(path[END_INDEX].y - path[START_INDEX].y) / 2;
        if (this.isCircle) {
            const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));
            xRadius = yRadius = shortestSide;
        }
        return { x: xRadius, y: yRadius };
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
