import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as EraserConstants from '@app/constants/eraser-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserCommand } from '@app/services/tools/eraser/eraser-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    pathData: Vec2[];
    lineWidth: number;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
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
            const command: Command = new EraserCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
            // this.erase(this.drawingService.baseCtx, this.pathData);
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

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            const command: Command = new EraserCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearPath();
    }

    onMouseEnter(event: MouseEvent): void {
        if (event.buttons === MouseConstants.MouseButton.Left) {
            this.mouseDown = false;
        }
    }

    private clearPath(): void {
        this.pathData = [];
    }

    erase(ctx: CanvasRenderingContext2D, path: Vec2[], lineWidth?: number, index?: number): void {
        if (!lineWidth) lineWidth = this.lineWidth;
        if (!index) index = 1;

        const beforeLastPoint = path[path.length - (index + 1)];
        const lastPoint = path[path.length - index];
        const corners = this.getCorners(lastPoint, beforeLastPoint, lineWidth);
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

        this.eraseSquare(ctx, path, lineWidth, index + 1);
    }

    eraseSquare(ctx: CanvasRenderingContext2D, path: Vec2[], lineWidth?: number, index?: number): void {
        if (!lineWidth) lineWidth = this.lineWidth;
        if (!index) index = 1;
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.rect(path[path.length - index].x - lineWidth / 2, path[path.length - index].y - lineWidth / 2, lineWidth, lineWidth);
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
