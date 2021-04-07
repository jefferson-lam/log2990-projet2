import { Command } from '@app/classes/command';
import { PixelData } from '@app/classes/pixel-data';
import { MouseButton } from '@app/constants/mouse-constants';
import { MAX_RGB_VALUE, MIN_RGB_VALUE } from '@app/constants/paint-bucket-constants';
import { PaintBucketService } from './paint-bucket-service';

export class PaintBucketCommand extends Command {
    primaryColorHex: number;
    primaryColor: string;
    toleranceValue: number;
    x: number;
    y: number;
    mouseButtonClicked: MouseButton;

    constructor(canvasContext: CanvasRenderingContext2D, paintBucketService: PaintBucketService) {
        super();
        this.setValues(canvasContext, paintBucketService);
    }

    setValues(canvasContext: CanvasRenderingContext2D, paintBucketService: PaintBucketService) {
        this.ctx = canvasContext;
        this.primaryColorHex = paintBucketService.primaryColorHex;
        this.primaryColor = paintBucketService.primaryColor;
        this.x = paintBucketService.x;
        this.y = paintBucketService.y;
        this.toleranceValue = paintBucketService.toleranceValue;
        this.mouseButtonClicked = paintBucketService.mouseButtonClicked;
    }

    execute() {
        if (this.mouseButtonClicked === MouseButton.Left) {
            this.floodFill2(this.ctx, this.x, this.y, this.primaryColorHex);
        } else if (this.mouseButtonClicked === MouseButton.Right) {
            this.fill(this.ctx, this.x, this.y, this.primaryColorHex);
        }
    }

    fill(ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: number) {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const pixelData: PixelData = {
            width: imageData.width,
            height: imageData.height,
            data: new Uint32Array(imageData.data.buffer),
        };
        const targetColor = this.getPixel(pixelData, x, y);
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

    floodFill2(ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: number) {
        let left, right, leftEdge, rightEdge;
        const w = ctx.canvas.width,
            h = ctx.canvas.height;
        if (this.toleranceValue === 100) {
            ctx.fillStyle = this.primaryColor;
            ctx.fillRect(0, 0, w, h);
            return;
        }
        const visited = new Uint8Array(w * h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const p32 = new Uint32Array(imgData.data.buffer);
        const stack = [x + y * w]; // add starting pos to stack
        const targetColor = p32[stack[0]];
        const confidenceInterval = this.findBounds(targetColor, this.toleranceValue);
        if (targetColor === fillColor || targetColor === undefined) {
            return;
        } // avoid endless loop
        while (stack.length) {
            let idx = stack.pop()!;
            while (idx >= w && this.matchColors(confidenceInterval, p32[idx - w])) {
                idx -= w;
            } // move to top edge
            right = left = false;
            leftEdge = idx % w === 0;
            rightEdge = (idx + 1) % w === 0;
            while (this.matchColors(confidenceInterval, p32[idx])) {
                p32[idx] = fillColor;
                if (!leftEdge) {
                    if (this.matchColors(confidenceInterval, p32[idx - 1])) {
                        // check left
                        if (!left) {
                            if (!visited[idx - 1]) {
                                stack.push(idx - 1); // found new column to left
                                visited[idx - 1] = 1;
                                left = true; //
                            }
                        }
                    } else if (left) {
                        left = false;
                    }
                }
                if (!rightEdge) {
                    if (this.matchColors(confidenceInterval, p32[idx + 1])) {
                        if (!right) {
                            if (!visited[idx + 1]) {
                                stack.push(idx + 1); // new column to right
                                visited[idx + 1] = 1;
                                right = true;
                            }
                        }
                    } else if (right) {
                        right = false;
                    }
                }
                idx += w;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        return;
    }

    getPixel(pixelData: PixelData, x: number, y: number): number {
        if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
            return -1;
        } else {
            return pixelData.data[y * pixelData.width + x];
        }
    }

    matchColors(confidenceInterval: any, color: number) {
        if (color <= confidenceInterval[1] && color >= confidenceInterval[0]) {
            return true;
        }
        return false;
    }

    number2rgba(color: number) {
        const rgba = {
            red: color & 0xff,
            green: (color >> 8) & 0xff,
            blue: (color >> 16) & 0xff,
            alpha: ((color >> 24) & 0xff) / 255,
        };
        return rgba;
    }

    private findBounds(targetColor: number, toleranceValue: number): [any, any] {
        const rgba = this.number2rgba(targetColor);
        // Convert to decimal
        const tolerancePercentage = toleranceValue / 100;
        // Find upper bound
        let upperBoundRed = this.findUpperBound(rgba.red, tolerancePercentage);
        let upperBoundGreen = this.findUpperBound(rgba.green, tolerancePercentage);
        let upperBoundBlue = this.findUpperBound(rgba.blue, tolerancePercentage);
        let upperBound = parseInt(
            ((rgba.alpha * 255) | (1 << 8)).toString(16).slice(1) +
                (upperBoundBlue | (1 << 8)).toString(16).slice(1) +
                (upperBoundGreen | (1 << 8)).toString(16).slice(1) +
                (upperBoundRed | (1 << 8)).toString(16).slice(1),
            16,
        );

        let lowerBoundRed = this.findLowerBound(rgba.red, tolerancePercentage);
        let lowerBoundGreen = this.findLowerBound(rgba.green, tolerancePercentage);
        let lowerBoundBlue = this.findLowerBound(rgba.blue, tolerancePercentage);
        let lowerBound = parseInt(
            ((rgba.alpha * 255) | (1 << 8)).toString(16).slice(1) +
                (lowerBoundBlue | (1 << 8)).toString(16).slice(1) +
                (lowerBoundGreen | (1 << 8)).toString(16).slice(1) +
                (lowerBoundRed | (1 << 8)).toString(16).slice(1),
            16,
        );

        return [lowerBound, upperBound];
    }

    private findUpperBound(colorValue: number, tolerancePercentage: number): number {
        let newColorValue = Math.round(colorValue + MAX_RGB_VALUE * tolerancePercentage);
        if (newColorValue > MAX_RGB_VALUE) {
            newColorValue = MAX_RGB_VALUE;
        }
        return newColorValue;
    }

    private findLowerBound(colorValue: number, tolerancePercentage: number): number {
        let newColorValue = Math.round(colorValue - MAX_RGB_VALUE * tolerancePercentage);
        if (newColorValue < MIN_RGB_VALUE) {
            newColorValue = MIN_RGB_VALUE;
        }
        return newColorValue;
    }
}
