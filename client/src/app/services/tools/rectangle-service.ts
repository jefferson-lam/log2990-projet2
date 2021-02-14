import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as RectangleConstants from '@app/constants/rectangle-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    cornerCoords: Vec2[] = new Array<Vec2>(2);
    isSquare: boolean = false;
    isShiftDown: boolean = false;
    lineWidth: number = 30;
    fillMode: ToolConstants.FillMode = ToolConstants.FillMode.OUTLINE_FILL;
    primaryColor: string = 'red';
    secondaryColor: string = 'grey';

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearCorners();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseConstants.MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.cornerCoords[RectangleConstants.START_INDEX] = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.cornerCoords[RectangleConstants.END_INDEX] = mousePosition;
            this.drawRectangle(this.drawingService.baseCtx, this.cornerCoords);
        }
        this.mouseDown = false;
        this.clearCorners();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            const exitCoords = this.getPositionFromMouse(event);
            this.cornerCoords[RectangleConstants.END_INDEX] = exitCoords;
            this.drawRectangle(this.drawingService.previewCtx, this.cornerCoords);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        const LEFT_CLICK_BUTTONS = 1;
        if (event.buttons === LEFT_CLICK_BUTTONS && this.mouseDown) {
            this.mouseDown = true;
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.cornerCoords[RectangleConstants.END_INDEX] = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, this.cornerCoords);
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    onKeyboardDown(event: KeyboardEvent): void {
        if (this.mouseDown) {
            if (event.key === 'Shift' && !this.isShiftDown) {
                this.isShiftDown = true;
                this.isSquare = true;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawRectangle(this.drawingService.previewCtx, this.cornerCoords);
            }
        }
    }

    onKeyboardUp(event: KeyboardEvent): void {
        if (this.mouseDown) {
            if (event.key === 'Shift') {
                this.isShiftDown = false;
                this.isSquare = false;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawRectangle(this.drawingService.previewCtx, this.cornerCoords);
            }
        } else {
            this.isSquare = false;
        }
    }

    setSize(width: number): void {
        if (width < RectangleConstants.MIN_BORDER_WIDTH) {
            this.lineWidth = RectangleConstants.MIN_BORDER_WIDTH;
        } else if (width > RectangleConstants.MAX_BORDER_WIDTH) {
            this.lineWidth = RectangleConstants.MAX_BORDER_WIDTH;
        } else {
            this.lineWidth = width;
        }
    }

    setFillMode(newFillMode: ToolConstants.FillMode): void {
        this.fillMode = newFillMode;
    }

    setPrimaryColor(newColor: string): void {
        // TODO: add color check
        this.primaryColor = newColor;
    }

    setSecondaryColor(newColor: string): void {
        // TODO: add color check
        this.secondaryColor = newColor;
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        let width = path[RectangleConstants.END_INDEX].x - path[RectangleConstants.START_INDEX].x;
        let height = path[RectangleConstants.END_INDEX].y - path[RectangleConstants.START_INDEX].y;
        if (this.isSquare) {
            const longestSide = Math.min(Math.abs(width), Math.abs(height));
            width = Math.sign(width) * longestSide;
            height = Math.sign(height) * longestSide;
        }
        const borderColor: string = this.fillMode === ToolConstants.FillMode.FILL_ONLY ? this.primaryColor : this.secondaryColor;
        if (Math.abs(width) > this.lineWidth && Math.abs(height) > this.lineWidth) {
            width -= Math.sign(width) * this.lineWidth;
            height -= Math.sign(height) * this.lineWidth;
            this.drawTypeRectangle(ctx, path, width, height, this.fillMode, this.lineWidth, this.primaryColor, borderColor);
        } else {
            this.drawTypeRectangle(
                ctx,
                path,
                width,
                height,
                ToolConstants.FillMode.OUTLINE_FILL,
                RectangleConstants.MIN_BORDER_WIDTH,
                borderColor,
                borderColor,
            );
        }
    }

    private drawTypeRectangle(
        ctx: CanvasRenderingContext2D,
        path: Vec2[],
        width: number,
        height: number,
        fillMode: ToolConstants.FillMode,
        lineWidth: number,
        fillColor: string,
        borderColor: string,
    ): void {
        ctx.beginPath();
        ctx.lineJoin = 'miter';
        const startX = path[RectangleConstants.START_INDEX].x + (Math.sign(width) * lineWidth) / 2;
        const startY = path[RectangleConstants.START_INDEX].y + (Math.sign(height) * lineWidth) / 2;
        ctx.rect(startX, startY, width, height);

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        if (fillMode !== ToolConstants.FillMode.OUTLINE) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
    }

    private clearCorners(): void {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }
}
