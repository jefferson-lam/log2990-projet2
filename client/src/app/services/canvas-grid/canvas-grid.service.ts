import { Injectable } from '@angular/core';
import * as GridConstants from '@app/constants/canvas-grid-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CanvasGridService {
    opacityValue: number;
    squareWidth: number;
    gridVisibility: boolean = false;
    gridCtx: CanvasRenderingContext2D;
    gridVisibilitySubject: Subject<boolean> = new Subject<boolean>();

    constructor(private drawingService: DrawingService) {
        this.drawingService.canvasHeightObservable.asObservable().subscribe((height) => {
            this.resize(this.gridCtx.canvas.width, height);
        });
        this.drawingService.canvasWidthObservable.asObservable().subscribe((width) => {
            this.resize(width, this.gridCtx.canvas.height);
        });
        this.setValues();
    }

    onKeyboardGKeyDown(): void {
        this.toggleGrid();
    }

    onKeyboardPlusOrEqualDown(): void {
        this.squareWidth = this.squareWidth - (this.squareWidth % GridConstants.SQUARE_WIDTH_INTERVAL) + GridConstants.SQUARE_WIDTH_INTERVAL;
        this.removeGrid();
        this.createGrid();
    }

    onKeyboardMinusDown(): void {
        this.squareWidth =
            this.squareWidth - (this.squareWidth % GridConstants.SQUARE_WIDTH_INTERVAL) - GridConstants.SQUARE_WIDTH_INTERVAL < 5
                ? 5
                : this.squareWidth - (this.squareWidth % GridConstants.SQUARE_WIDTH_INTERVAL) - GridConstants.SQUARE_WIDTH_INTERVAL;
        this.removeGrid();
        this.createGrid();
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
        this.gridVisibility = !gridVisibility;
        this.toggleGrid();
    }

    createGrid(): void {
        const canvasWidth = this.gridCtx.canvas.width;
        const canvasHeight = this.gridCtx.canvas.height;
        this.gridCtx.beginPath();
        for (let i = 0; i < canvasWidth; i++) {
            this.gridCtx.moveTo(i * this.squareWidth, 0);
            this.gridCtx.lineTo(i * this.squareWidth, canvasHeight);
        }
        for (let i = 0; i < canvasHeight; i++) {
            this.gridCtx.moveTo(0, i * this.squareWidth);
            this.gridCtx.lineTo(canvasWidth, i * this.squareWidth);
        }
        this.gridCtx.strokeStyle = 'rgba(0, 0, 0, 1)'; // 'black';
        this.gridCtx.stroke();
    }

    removeGrid(): void {
        const canvasWidth = this.gridCtx.canvas.width;
        const canvasHeight = this.gridCtx.canvas.height;
        this.gridCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    private toggleGrid(): void {
        if (!this.gridVisibility) {
            this.createGrid();
            this.gridVisibility = true;
        } else {
            this.removeGrid();
            this.gridVisibility = false;
        }
        this.gridVisibilitySubject.next(this.gridVisibility);
    }

    resize(width: number, height: number): void {
        this.gridCtx.canvas.width = width;
        this.gridCtx.canvas.height = height;
        if (this.gridVisibility) {
            this.createGrid();
        } else {
            this.removeGrid();
        }
    }
}
