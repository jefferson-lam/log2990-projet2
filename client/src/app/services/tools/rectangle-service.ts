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
enum FillMode {
    OUTLINE = 0,
    FILL_ONLY = 1,
    OUTLINE_FILL = 2,
}
const fillMode: number = FillMode.OUTLINE_FILL;

// TODO: Find way to get line width
const lineWidth = 5;

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    pathData: Vec2[];
    isSquare: boolean;

    constructor(drawingService: DrawingService) {
        const MAX_PATH_DATA_SIZE = 2;
        super(drawingService);
        this.isSquare = false;
        this.pathData = new Array<Vec2>(MAX_PATH_DATA_SIZE);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData[CornerIndex.start] = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData[CornerIndex.end] = mousePosition;
            this.drawRectangle(this.drawingService.baseCtx, this.pathData, primaryColor);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData[CornerIndex.end] = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, this.pathData, primaryColor);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.mouseDown) {
            if (event.key === 'Shift') {
                this.isSquare = true;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawRectangle(this.drawingService.previewCtx, this.pathData, primaryColor);
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.mouseDown) {
            if (event.key === 'Shift') {
                this.isSquare = false;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawRectangle(this.drawingService.previewCtx, this.pathData, primaryColor);
            }
        } else {
            this.isSquare = false;
        }
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[], color: string): void {
        let width = path[CornerIndex.end].x - path[CornerIndex.start].x;
        let height = path[CornerIndex.end].y - path[CornerIndex.start].y;
        if (this.isSquare) {
            const longestSide = Math.max(Math.abs(width), Math.abs(height));
            width = width > 0 ? longestSide : -longestSide;
            height = height > 0 ? longestSide : -longestSide;
        }
        this.drawTypeRectangle(ctx, path, color, secondColor, width, height, fillMode);
    }

    private drawTypeRectangle(
        ctx: CanvasRenderingContext2D,
        path: Vec2[],
        fillColor: string,
        borderColor: string,
        width: number,
        height: number,
        fillMethod: number,
    ): void {
        ctx.beginPath();
        ctx.rect(path[CornerIndex.start].x, path[CornerIndex.start].y, width, height);
        if (fillMethod !== FillMode.OUTLINE) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        if (fillMethod !== FillMode.FILL_ONLY) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }
    }

    private clearPath(): void {
        this.pathData.fill({ x: 0, y: 0 });
    }
}
