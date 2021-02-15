import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as EraserConstants from '@app/constants/eraser-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    private pathData: Vec2[];
    lineWidth: number;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.lineWidth = EraserConstants.MIN_SIZE_ERASER;
    }

    setLineWidth(width: number): void {
        if (width >= EraserConstants.MIN_SIZE_ERASER && width <= EraserConstants.MAX_SIZE_ERASER) {
            this.lineWidth = width;
        } else if (width > EraserConstants.MAX_SIZE_ERASER) {
            this.lineWidth = EraserConstants.MAX_SIZE_ERASER;
        } else {
            this.lineWidth = EraserConstants.MIN_SIZE_ERASER;
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseConstants.MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.eraseSquare(this.drawingService.baseCtx, this.pathData);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.erase(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        this.moveCursor(this.drawingService.previewCtx, event);

        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.erase(this.drawingService.baseCtx, this.pathData);
        }
    }

    private moveCursor(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);

        this.drawingService.clearCanvas(ctx);

        ctx.lineWidth = 1;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';

        ctx.beginPath();
        ctx.rect(mousePosition.x - this.lineWidth / 2, mousePosition.y - this.lineWidth / 2, this.lineWidth, this.lineWidth);
        ctx.fillRect(mousePosition.x - this.lineWidth / 2, mousePosition.y - this.lineWidth / 2, this.lineWidth, this.lineWidth);
        ctx.stroke();
    }

    private eraseSquare(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.rect(path[path.length - 1].x - this.lineWidth / 2, path[path.length - 1].y - this.lineWidth / 2, this.lineWidth, this.lineWidth);
        ctx.fill();
    }

    private erase(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const beforeLastPoint = path[path.length - 2];
        const lastPoint = path[path.length - 1];
        const corners = this.getCorners(lastPoint, beforeLastPoint);
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

        this.eraseSquare(ctx, path);
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private getCorners(lastPoint: Vec2, beforeLastPoint: Vec2): Vec2[] {
        const beforeLastRectangle = beforeLastPoint;
        const lastRectangle = lastPoint;
        const vectorCenter: Vec2 = { x: lastRectangle.x - beforeLastRectangle.x, y: lastRectangle.y - beforeLastRectangle.y };
        let bottomBefore: Vec2;
        let topBefore: Vec2;
        let bottomLast: Vec2;
        let topLast: Vec2;
        const displacement = Math.floor(this.lineWidth / 2);

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
