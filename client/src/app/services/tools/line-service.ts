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
    private initialPoint: Vec2;
    private mousePosition: Vec2;
    private linePathData: Vec2[];
    isDrawing: boolean = false;
    withJunction: boolean = true;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    onKeyboardDown(event: KeyboardEvent): void {
        if (event.key == 'a' && this.isDrawing) {
            //0 degrees
            //angle could be a attribute of the setting service?
            //clarify how these angles will be selected
            this.linePathData[1] = this.rotateLine(this.linePathData[0], this.linePathData[1], 0);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.linePathData);
        }
    }

    //Computes the new coordinates of the point with regards to the specified angle, and
    //makes sure that length of line matches requirements
    private rotateLine(initialPoint: Vec2, currentPoint: Vec2, angle: number): Vec2 {
        let lineLength: number = 0;
        if (angle % 180 == 0) {
            lineLength = this.linePathData[1].x - this.linePathData[0].x;
            this.linePathData[1].x = this.linePathData[0].x + lineLength;
            this.linePathData[1].y = this.linePathData[0].y;
        }
        return this.rotate(this.linePathData[0], this.linePathData[1], angle);
    }

    onKeyboardUp(event: KeyboardEvent): void {
        if (event.key == 'a' && this.isDrawing) {
            this.linePathData[1] = this.mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.linePathData);
        }
    }

    onKeyboardPress(event: KeyboardEvent): void {
        if (event.key == 'd' && this.isDrawing) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.isDrawing = false;
        } else if (event.key == 'u') {
            this.drawingService.baseCtx.restore();
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
            this.drawingService.baseCtx.save();
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
        ctx.arc(this.linePathData[1].x, this.linePathData[1].y, 1, 0, 2 * Math.PI);
        ctx.moveTo(this.linePathData[0].x, this.linePathData[0].y);
        ctx.lineTo(this.linePathData[1].x, this.linePathData[1].y);
        ctx.stroke();
    }

    private clearPath(): void {
        this.linePathData = [];
    }

    private calculateDistance(initialPoint: Vec2, currentPoint: Vec2): number {
        return Math.sqrt(Math.pow(currentPoint.x - initialPoint.x, 2) + Math.pow(currentPoint.y - initialPoint.y, 2));
    }

    private rotate(initialPoint: Vec2, currentPoint: Vec2, degrees: number): Vec2 {
        let radians = (Math.PI / 180) * degrees;
        let x = (currentPoint.x - initialPoint.x) * Math.cos(radians) + (currentPoint.y - initialPoint.y) * Math.sin(radians) + initialPoint.x;
        let y = (currentPoint.y - initialPoint.y) * Math.cos(radians) - (currentPoint.x - initialPoint.x) * Math.sin(radians) + initialPoint.y;
        return { x, y };
    }
}
