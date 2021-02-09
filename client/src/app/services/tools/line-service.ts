import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as LineConstants from '@app/constants/line-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    mousePosition: Vec2;
    initialPoint: Vec2;
    linePathData: Vec2[];
    shiftDown: boolean = false;
    isDrawing: boolean = false;
    withJunction: boolean = true;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    onKeyboardDown(event: KeyboardEvent): void {
        if (this.isDrawing) {
            if (event.key === 'Shift' && !this.shiftDown) {
                const finalLineCoord: Vec2 = this.calculateLengthAndFlatten(
                    this.linePathData[LineConstants.STARTING_POINT],
                    this.mousePosition,
                    LineConstants.DEGREES_135,
                );
                this.linePathData[LineConstants.ENDING_POINT] = this.rotateLine(
                    this.linePathData[LineConstants.STARTING_POINT],
                    finalLineCoord,
                    LineConstants.DEGREES_135,
                );
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.linePathData);
                this.shiftDown = true;
            }
        }
    }

    // Computes the new coordinates of the point with regards to the specified angle, and
    // makes sure that length of line matches requirements
    private calculateLengthAndFlatten(initialPoint: Vec2, mousePosition: Vec2, angle: number): Vec2 {
        let lineLength = 0;
        switch (angle) {
            case LineConstants.DEGREES_45:
            case LineConstants.DEGREES_135:
            case LineConstants.DEGREES_225:
            case LineConstants.DEGREES_315:
                lineLength = Math.abs(Math.abs(mousePosition.x - initialPoint.x) / Math.cos(angle * (Math.PI / LineConstants.DEGREES_180)));
                break;
            case LineConstants.DEGREES_90:
            case LineConstants.DEGREES_270:
                lineLength = Math.abs(mousePosition.y - initialPoint.y);
                break;
            default:
                lineLength = Math.abs(mousePosition.x - initialPoint.x);
                break;
        }
        return {
            x: Math.round(initialPoint.x + lineLength),
            y: Math.round(initialPoint.y),
        };
    }

    onKeyboardUp(event: KeyboardEvent): void {
        if (this.isDrawing) {
            if (event.key === 'Shift') {
                this.shiftDown = false;
                this.linePathData[LineConstants.ENDING_POINT] = this.mousePosition;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.linePathData);
            }
        }
    }

    // TODO
    onKeyboardPress(event: KeyboardEvent): void {
        if (event.key === 'Escape' && this.isDrawing) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.isDrawing = false;
        }
    }

    onMouseClick(event: MouseEvent): void {
        if (!this.isDrawing) {
            this.clearPath();
            this.isDrawing = true;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.initialPoint = this.mouseDownCoord;
            this.linePathData[LineConstants.STARTING_POINT] = this.mouseDownCoord;
        } else {
            const distanceToInitialPoint = this.calculateDistance(
                this.linePathData[LineConstants.STARTING_POINT],
                this.linePathData[LineConstants.ENDING_POINT],
            );
            if (distanceToInitialPoint < LineConstants.PIXEL_PROXIMITY_LIMIT) {
                this.linePathData[LineConstants.ENDING_POINT] = this.linePathData[LineConstants.STARTING_POINT];
            }
            this.drawLine(this.drawingService.baseCtx, this.linePathData);
            this.linePathData[LineConstants.STARTING_POINT] = this.linePathData[LineConstants.ENDING_POINT];
        }
    }

    onMouseDoubleClick(event: MouseEvent): void {
        if (this.isDrawing) {
            this.clearPath();
            this.isDrawing = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isDrawing) {
            this.mousePosition = this.getPositionFromMouse(event);
            this.linePathData[LineConstants.ENDING_POINT] = this.mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.linePathData);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        // Arc draws a circle of diameter 1 on every click, to refactor
        ctx.arc(path[LineConstants.ENDING_POINT].x, path[LineConstants.ENDING_POINT].y, 1, 0, 2 * Math.PI);
        ctx.moveTo(path[LineConstants.STARTING_POINT].x, path[LineConstants.STARTING_POINT].y);
        ctx.lineTo(path[LineConstants.ENDING_POINT].x, path[LineConstants.ENDING_POINT].y);
        ctx.stroke();
    }

    private clearPath(): void {
        this.linePathData = [];
    }

    private calculateDistance(initialPoint: Vec2, currentPoint: Vec2): number {
        return Math.abs(Math.sqrt(Math.pow(currentPoint.x - initialPoint.x, 2) + Math.pow(currentPoint.y - initialPoint.y, 2)));
    }

    private rotateLine(initialPoint: Vec2, currentPoint: Vec2, angle: number): Vec2 {
        const radians = (Math.PI / LineConstants.DEGREES_180) * angle;
        return {
            x: Math.round(
                (currentPoint.x - initialPoint.x) * Math.cos(radians) + (currentPoint.y - initialPoint.y) * Math.sin(radians) + initialPoint.x,
            ),
            y: Math.round(
                (currentPoint.y - initialPoint.y) * Math.cos(radians) - (currentPoint.x - initialPoint.x) * Math.sin(radians) + initialPoint.y,
            ),
        };
    }
}
