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
    isGridDisplayed: boolean = false;
    gridCtx: CanvasRenderingContext2D;
    gridVisibilitySubject: Subject<boolean> = new Subject<boolean>();
    widthSubject: Subject<number> = new Subject<number>();

    constructor(private drawingService: DrawingService) {
        this.drawingService.canvasHeightObservable.asObservable().subscribe((height) => {
            this.resize(this.gridCtx.canvas.width, height);
        });
        this.drawingService.canvasWidthObservable.asObservable().subscribe((width) => {
            this.resize(width, this.gridCtx.canvas.height);
        });
        this.setValues();
    }

    increaseGridSize(): void {
        if(this.isGridDisplayed) {
            const newWidth = this.squareWidth - (this.squareWidth % GridConstants.SQUARE_WIDTH_INTERVAL) + GridConstants.SQUARE_WIDTH_INTERVAL;
            this.setSquareWidth(newWidth);
            this.resetGrid();
        }
    }

    reduceGridSize(): void {
        const newWidth = this.squareWidth - (this.squareWidth % GridConstants.SQUARE_WIDTH_INTERVAL) - GridConstants.SQUARE_WIDTH_INTERVAL;
        this.setSquareWidth(newWidth);
        this.resetGrid();
    }

    setOpacityValue(opacityValue: number): void {
        this.opacityValue = opacityValue;
        if (this.opacityValue > GridConstants.MAX_OPACITY_VALUE) this.opacityValue = GridConstants.MAX_OPACITY_VALUE;
        else if (this.opacityValue < GridConstants.MIN_OPACITY_VALUE) this.opacityValue = GridConstants.MIN_OPACITY_VALUE;
        if (this.isGridDisplayed) this.resetGrid();
    }

    setSquareWidth(squareWidth: number): void {
        this.squareWidth = squareWidth;
        if (this.squareWidth > GridConstants.MAX_SQUARE_WIDTH) this.squareWidth = GridConstants.MAX_SQUARE_WIDTH;
        else if (this.squareWidth < GridConstants.MIN_SQUARE_WIDTH) this.squareWidth = GridConstants.MIN_SQUARE_WIDTH;
        if (this.isGridDisplayed) this.resetGrid();
        this.widthSubject.next(this.squareWidth);
    }

    setVisibility(gridVisibility: boolean): void {
        this.isGridDisplayed = gridVisibility;
        if (this.isGridDisplayed) {
            this.createGrid();
        } else {
            this.removeGrid();
        }
    }

    private setValues(): void {
        this.opacityValue = GridConstants.DEFAULT_OPACITY;
        this.squareWidth = GridConstants.DEFAULT_SQUARE_WIDTH;
    }

    private createGrid(): void {
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
        this.gridCtx.strokeStyle = `rgba(0, 0, 0, ${this.opacityValue})`;
        this.gridCtx.stroke();
    }

    private removeGrid(): void {
        const canvasWidth = this.gridCtx.canvas.width;
        const canvasHeight = this.gridCtx.canvas.height;
        this.gridCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    toggleGrid(): void {
        if (!this.isGridDisplayed) {
            this.createGrid();
            this.isGridDisplayed = true;
        } else {
            this.removeGrid();
            this.isGridDisplayed = false;
        }
        this.gridVisibilitySubject.next(this.isGridDisplayed);
    }

    private resetGrid(): void {
        this.removeGrid();
        this.createGrid();
    }

    resize(width: number, height: number): void {
        this.gridCtx.canvas.width = width;
        this.gridCtx.canvas.height = height;
        if (this.isGridDisplayed) {
            this.createGrid();
        } else {
            this.removeGrid();
        }
    }
}
