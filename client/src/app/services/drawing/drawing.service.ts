import { Injectable } from '@angular/core';
import { ResizerCommand } from '@app/components/resizer/resizer-command';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSavedImage(dataUrl: string): void {
        const image = new Image();
        image.src = dataUrl;
        image.onload = () => {
            const resizeCanvas = new ResizerCommand(image.width, image.height);
            resizeCanvas.execute();
            this.baseCtx.drawImage(image, 0, 0, image.width, image.height);
        };
    }
}
