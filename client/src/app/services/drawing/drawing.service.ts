import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    gridCtx: CanvasRenderingContext2D;
    selectionCtx: CanvasRenderingContext2D;
    previewSelectionCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    imageURL: string;
    selectionCanvas: HTMLCanvasElement;
    previewSelectionCanvas: HTMLCanvasElement;
    canvasSizeSubject: Subject<number[]>;

    constructor() {
        this.imageURL = '';
        this.canvasSizeSubject = new Subject<number[]>();
    }

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    newDrawing(): void {
        this.whiteOut(this.baseCtx);
        this.clearCanvas(this.previewCtx);
    }

    whiteOut(context: CanvasRenderingContext2D): void {
        context.fillStyle = 'white';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
}
