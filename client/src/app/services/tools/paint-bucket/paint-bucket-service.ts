import { Injectable } from '@angular/core';
import { PixelData } from '@app/classes/pixel-data';
import { Tool } from '@app/classes/tool';
import { MouseButton } from '@app/constants/mouse-constants';
import { DEFAULT_TOLERANCE_VALUE } from '@app/constants/paint-bucket-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    primaryColor: string;
    toleranceValue: number = DEFAULT_TOLERANCE_VALUE;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
    }

    setPrimaryColor(newColor: string): void {
        this.primaryColor = newColor;
    }

    setToleranceValue(toleranceValue: number): void {
        this.toleranceValue = toleranceValue;
    }

    onMouseDown(event: MouseEvent) {
        const fillColor = 4278190080;
        if (event.button === MouseButton.Left) {
            this.floodFill(this.drawingService.baseCtx, event.offsetX, event.offsetY, fillColor);
        } else if (event.button === MouseButton.Right) {
            this.fill(this.drawingService.baseCtx, event.offsetX, event.offsetY, fillColor);
        }
    }

    getPixel(pixelData: PixelData, x: number, y: number): number {
        if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
            return -1;
        } else {
            return pixelData.data[y * pixelData.width + x];
        }
    }

    floodFill(ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: number) {
        const imageData = ctx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        const pixelData: PixelData = {
            width: imageData.width,
            height: imageData.height,
            data: new Uint32Array(imageData.data.buffer),
        };
        const targetColor = this.getPixel(pixelData, x, y);
        console.log(targetColor);
        if (fillColor != targetColor) {
            const pixels = [x, y];
            while (pixels.length > 0) {
                const y = pixels.pop()!;
                const x = pixels.pop()!;
                const currentPixelColor = this.getPixel(pixelData, x, y);
                if (currentPixelColor === targetColor) {
                    pixelData.data[y * pixelData.width + x] = fillColor;
                    pixels.push(x + 1, y);
                    pixels.push(x - 1, y);
                    pixels.push(x, y + 1);
                    pixels.push(x, y - 1);
                }
            }
        }
        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.putImageData(imageData, 0, 0);
        ctx.restore();
    }

    fill(ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: number) {
        const imageData = ctx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        const pixelData: PixelData = {
            width: imageData.width,
            height: imageData.height,
            data: new Uint32Array(imageData.data.buffer),
        };
        const targetColor = this.getPixel(pixelData, x, y);
        console.log(targetColor);
        for (let y = 0; y < pixelData.height; y++) {
            for (let x = 0; x < pixelData.width; x++) {
                const currentPixelColor = this.getPixel(pixelData, x, y);
                if (currentPixelColor === targetColor) {
                    pixelData.data[y * pixelData.width + x] = fillColor;
                }
            }
        }

        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.putImageData(imageData, 0, 0);
        ctx.restore();
    }

    //Convert color value tothe CIE Lab color space: https://stackoverflow.com/questions/1678457/best-algorithm-for-matching-colours
    matchColor(currentPixelColor: number, targetColor: number) {}
}
