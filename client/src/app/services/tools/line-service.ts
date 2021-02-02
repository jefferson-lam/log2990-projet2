import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
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
    initialPoint: Vec2;
    mousePosition: Vec2;
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
            if (event.key == 'Shift' && !this.shiftDown) {
                this.linePathData[1] = this.rotateLine(this.linePathData[0], this.mousePosition, 315);
                let currentMousePosition = this.mousePosition;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.linePathData);
                this.mousePosition = currentMousePosition;
                this.shiftDown = true;
            }
        }
    }

    //Computes the new coordinates of the point with regards to the specified angle, and
    //makes sure that length of line matches requirements
    private rotateLine(initialPoint: Vec2, mousePosition: Vec2, angle: number): Vec2 {
        let lineLength: number = 0;
        if (angle == 45 || angle == 135 || angle == 225 || angle == 315) {
            lineLength = Math.abs(Math.abs(mousePosition.x - initialPoint.x) / Math.cos(angle * (Math.PI / 180)));
        } else if (angle == 90 || angle == 270) {
            lineLength = Math.abs(mousePosition.y - initialPoint.y);
        } else if (angle == 0 || angle == 180) {
            lineLength = Math.abs(mousePosition.x - initialPoint.x);
        }
        this.mousePosition = mousePosition;
        let currentPoint: Vec2 = {
            x: initialPoint.x + lineLength,
            y: initialPoint.y,
        };
        return this.rotate(initialPoint, currentPoint, angle);
    }

    onKeyboardUp(event: KeyboardEvent): void {
        if (this.isDrawing) {
            if (event.key == 'Shift') {
                this.shiftDown = false;
                this.linePathData[1] = this.mousePosition;
                console.log(this.linePathData[1]);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.linePathData);
            }
        }
    }

    onKeyboardPress(event: KeyboardEvent): void {
        if (event.key == 'd' && this.isDrawing) {
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
            this.linePathData[0] = this.mouseDownCoord;
        } else {
            const distanceToInitialPoint = this.calculateDistance(this.initialPoint, this.linePathData[1]);
            if (distanceToInitialPoint < 20) {
                this.linePathData[1] = this.initialPoint;
            }
            this.drawLine(this.drawingService.baseCtx, this.linePathData);
            this.linePathData[0] = this.linePathData[1];
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
            this.linePathData[1] = this.mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.linePathData);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        //Arc draws a circle of diameter 1 on every click, to refactor
        ctx.arc(path[1].x, path[1].y, 1, 0, 2 * Math.PI);
        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        ctx.stroke();
    }

    private clearPath(): void {
        this.linePathData = [];
    }

    private calculateDistance(initialPoint: Vec2, currentPoint: Vec2): number {
        return Math.sqrt(Math.pow(currentPoint.x - initialPoint.x, 2) + Math.pow(currentPoint.y - initialPoint.y, 2));
    }

    private rotate(initialPoint: Vec2, currentPoint: Vec2, angle: number): Vec2 {
        let radians = (Math.PI / 180) * angle;
        return {
            x: (currentPoint.x - initialPoint.x) * Math.cos(radians) + (currentPoint.y - initialPoint.y) * Math.sin(radians) + initialPoint.x,
            y: (currentPoint.y - initialPoint.y) * Math.cos(radians) - (currentPoint.x - initialPoint.x) * Math.sin(radians) + initialPoint.y,
        };
    }
}
