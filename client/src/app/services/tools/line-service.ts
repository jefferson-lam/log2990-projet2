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
    private linePathData: Vec2[];
    isDrawing: boolean = false;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    onKeyboardDown(event: KeyboardEvent): void {}

    onKeyboardPress(event: KeyboardEvent): void {}

    onMouseClick(event: MouseEvent): void {
        if (!this.isDrawing) {
            this.clearPath();
            console.log('Mouse click!');
            this.isDrawing = true;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.linePathData[0] = this.mouseDownCoord;
        } else {
            console.log(this.linePathData);
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
            const mousePosition = this.getPositionFromMouse(event);
            this.linePathData[1] = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.linePathData);
            console.log(this.linePathData);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.moveTo(this.linePathData[0].x, this.linePathData[0].y);
        ctx.lineTo(this.linePathData[1].x, this.linePathData[1].y);
        ctx.stroke();
    }

    private clearPath(): void {
        this.linePathData = [];
    }
}
