import { Injectable } from '@angular/core';
import * as GridConstants from '@app/constants/canvas-grid-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class CanvasGridService {
    opacityValue: number;
    squareWidth: number;
    gridVisibility: boolean = false;
    previewCtx: CanvasRenderingContext2D;

    constructor(drawingService: DrawingService) {
        this.previewCtx = drawingService.previewCtx;
        this.setValues();
    }

    onKeyboardDown(event: KeyboardEvent): void {
        if (event.key === 'g') {
            this.toggleGrid(this.previewCtx);
        }
        if (event.key === '+' || event.key === '=') {
            this.squareWidth = this.squareWidth - (this.squareWidth % GridConstants.SQUARE_WIDTH_INTERVAL) + GridConstants.SQUARE_WIDTH_INTERVAL;
        }
        if (event.key === '-') {
            this.squareWidth = this.squareWidth - (this.squareWidth % GridConstants.SQUARE_WIDTH_INTERVAL) - GridConstants.SQUARE_WIDTH_INTERVAL;
        }
    }

    setValues(): void {
        this.opacityValue = GridConstants.DEFAULT_OPACITY;
        this.squareWidth = GridConstants.DEFAULT_SQUARE_WIDTH;
    }

    setOpacityValue(opacityValue: number): void {
        this.opacityValue = opacityValue;
    }

    setSquareWidth(squareWidth: number): void {
        this.squareWidth = squareWidth;
    }

    setVisibility(gridVisibility: boolean): void {
        this.gridVisibility = gridVisibility;
        console.log(this.gridVisibility);
    }

    createGrid(ctx: CanvasRenderingContext2D): void {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        ctx.beginPath();
        for (let i = 0; i < canvasWidth; i++) {
            ctx.moveTo(i * this.squareWidth, 0);
            ctx.lineTo(i * this.squareWidth, canvasHeight);
        }
        for (let i = 0; i < canvasHeight; i++) {
            ctx.moveTo(0, i * this.squareWidth);
            ctx.lineTo(canvasWidth, i * this.squareWidth);
        }
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    toggleGrid(ctx: CanvasRenderingContext2D): void {
        if (!this.gridVisibility) {
            this.gridVisibility = true;
            ctx.strokeStyle = 'white';
            ctx.stroke();
        } else {
            this.createGrid(ctx);
            this.gridVisibility = false;
        }
    }
}
