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
    imageURL: string = '';
    selectionCanvas: HTMLCanvasElement;
    previewSelectionCanvas: HTMLCanvasElement;

    canvasSizeSubject: Subject<number[]>;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setInitialImage(dataUrl: string): void {
        this.imageURL = dataUrl;
    }
}
