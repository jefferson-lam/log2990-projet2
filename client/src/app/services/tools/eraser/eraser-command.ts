import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as EraserConstants from '@app/constants/eraser-constants';
import { EraserService } from '@app/services/tools/eraser/eraser-service';

export class EraserCommand extends Command {
    private path: Vec2[] = [];
    private lineWidth: number;
    private preview: boolean = false;

    constructor(canvasContext: CanvasRenderingContext2D, eraserService: EraserService) {
        super();
        this.ctx = canvasContext;
        this.path = Object.assign([], eraserService.pathData);
        this.lineWidth = eraserService.lineWidth;
    }

    setValues(canvasContext: CanvasRenderingContext2D, eraserService: EraserService): void {
        this.preview = true;
        this.ctx = canvasContext;
        this.path = [];
        Object.assign(this.path, eraserService.pathData);
        this.lineWidth = eraserService.lineWidth;
    }

    execute(): void {
        if (this.path.length > 1) {
            if (!this.preview) {
                for (let i = 1; i < this.path.length; i++) {
                    this.erase(this.ctx, this.path, i);
                }
            } else {
                this.erase(this.ctx, this.path);
            }
        }
        this.eraseSquare(this.ctx, this.path);
    }

    private erase(ctx: CanvasRenderingContext2D, path: Vec2[], index?: number): void {
        if (!index) index = 1;

        const beforeLastPoint = path[path.length - (index + 1)];
        const lastPoint = path[path.length - index];
        const corners = this.getCorners(lastPoint, beforeLastPoint, this.lineWidth);
        const bottomBefore = corners[EraserConstants.CornerIndex.BOTTOM_BEFORE];
        const topBefore = corners[EraserConstants.CornerIndex.TOP_BEFORE];
        const bottomLast = corners[EraserConstants.CornerIndex.BOTTOM_LAST];
        const topLast = corners[EraserConstants.CornerIndex.TOP_LAST];

        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.moveTo(bottomBefore.x, bottomBefore.y);
        ctx.lineTo(topBefore.x, topBefore.y);
        ctx.lineTo(topLast.x, topLast.y);
        ctx.lineTo(bottomLast.x, bottomLast.y);
        ctx.closePath();
        ctx.fill();

        this.eraseSquare(ctx, path, index + 1);
    }

    private eraseSquare(ctx: CanvasRenderingContext2D, path: Vec2[], index?: number): void {
        if (!index) index = 1;
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.rect(path[path.length - index].x - this.lineWidth / 2, path[path.length - index].y - this.lineWidth / 2, this.lineWidth, this.lineWidth);
        ctx.fill();
    }

    private getCorners(lastPoint: Vec2, beforeLastPoint: Vec2, lineWidth: number): Vec2[] {
        const beforeLastRectangle = beforeLastPoint;
        const lastRectangle = lastPoint;
        const vectorCenter: Vec2 = { x: lastRectangle.x - beforeLastRectangle.x, y: lastRectangle.y - beforeLastRectangle.y };
        let bottomBefore: Vec2;
        let topBefore: Vec2;
        let bottomLast: Vec2;
        let topLast: Vec2;
        const displacement = Math.floor(lineWidth / 2);

        if (vectorCenter.x * vectorCenter.y >= 0) {
            // Take bottom left and top right corners
            bottomBefore = { x: beforeLastRectangle.x - displacement, y: beforeLastRectangle.y + displacement };
            topBefore = { x: beforeLastRectangle.x + displacement, y: beforeLastRectangle.y - displacement };
            bottomLast = { x: lastRectangle.x - displacement, y: lastRectangle.y + displacement };
            topLast = { x: lastRectangle.x + displacement, y: lastRectangle.y - displacement };
        } else {
            // Take bottom right and top left corners
            bottomBefore = { x: beforeLastRectangle.x + displacement, y: beforeLastRectangle.y + displacement };
            topBefore = { x: beforeLastRectangle.x - displacement, y: beforeLastRectangle.y - displacement };
            bottomLast = { x: lastRectangle.x + displacement, y: lastRectangle.y + displacement };
            topLast = { x: lastRectangle.x - displacement, y: lastRectangle.y - displacement };
        }
        return [bottomBefore, topBefore, bottomLast, topLast];
    }
}
