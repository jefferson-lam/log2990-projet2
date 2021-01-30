import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

enum CornerIndex {
    start = 0,
    end = 1,
    substitute = 2,
}

// TODO: CHANGE WAY TO GET COLOR
const primaryColor = '#B5CF60';
const secondColor = '#2F2A36';

// TODO: Find way to get fill mode
const fillMode: number = 1;

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private pathData: Vec2[];
    private isSquare: boolean;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.isSquare = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.pathData.length < 2) {
                this.pathData.push(mousePosition);
            } else {
                this.pathData[CornerIndex.end] = mousePosition;
            }
            // TODO: draw rectangle based on chosen rectangle (outline, filled, or both)
            this.drawRectangle(this.drawingService.baseCtx, this.pathData, primaryColor);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        // TODO: change to interact with color picker
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.pathData.length < 2) {
                this.pathData.push(mousePosition);
            } else {
                this.pathData[CornerIndex.end] = mousePosition;
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, this.pathData, primaryColor);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key == 'Shift') {
            if (this.mouseDown) {
                this.isSquare = true;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawRectangle(this.drawingService.previewCtx, this.pathData, primaryColor);
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key == 'Shift') {
            if (this.isSquare) {
                this.isSquare = false;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawRectangle(this.drawingService.previewCtx, this.pathData, primaryColor);
            }
        }
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[], color: string) {
        if (path.length < 2) return;

        let width = path[CornerIndex.end].x - path[CornerIndex.start].x;
        let height = path[CornerIndex.end].y - path[CornerIndex.start].y;
        if (this.isSquare) {
            const longestSide = Math.max(Math.abs(width), Math.abs(height));
            width = width > 0 ? longestSide : -longestSide;
            height = height > 0 ? longestSide : -longestSide;
        }
        switch (fillMode) {
            case 0: {
                this.drawFilledRectangle(ctx, path, color, width, height);
                break;
            }
            case 1: {
                this.drawOutlinedRectangle(ctx, path, secondColor, width, height);
                break;
            }
            case 2: {
                this.drawOutlineFilledrectangle(ctx, path, color, secondColor, width, height);
                break;
            }
        }
    }

    private drawFilledRectangle(ctx: CanvasRenderingContext2D, path: Vec2[], primaryColor: string, width: number, height: number) {
        ctx.beginPath();
        ctx.fillStyle = primaryColor;
        ctx.fillRect(path[CornerIndex.start].x, path[CornerIndex.start].y, width, height);
    }

    private drawOutlinedRectangle(ctx: CanvasRenderingContext2D, path: Vec2[], primaryColor: string, width: number, height: number) {
        ctx.beginPath();
        ctx.rect(path[CornerIndex.start].x, path[CornerIndex.start].y, width, height);
        ctx.strokeStyle = primaryColor;
        ctx.stroke();
    }

    private drawOutlineFilledrectangle(
        ctx: CanvasRenderingContext2D,
        path: Vec2[],
        fillColor: string,
        borderColor: string,
        width: number,
        height: number,
    ) {
        ctx.beginPath();
        ctx.rect(path[CornerIndex.start].x, path[CornerIndex.start].y, width, height);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
