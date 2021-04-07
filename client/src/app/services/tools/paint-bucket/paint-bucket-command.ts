import { Command } from '@app/classes/command';
import { PixelData } from '@app/classes/pixel-data';
import { MouseButton } from '@app/constants/mouse-constants';
import { ColorRgba, PaintBucketService } from './paint-bucket-service';

export class PaintBucketCommand extends Command {
    primaryColorRgba: ColorRgba;
    primaryColor: string;
    toleranceValue: number;
    startX: number;
    startY: number;
    mouseButtonClicked: MouseButton;

    constructor(canvasContext: CanvasRenderingContext2D, paintBucketService: PaintBucketService) {
        super();
        this.setValues(canvasContext, paintBucketService);
    }

    setValues(canvasContext: CanvasRenderingContext2D, paintBucketService: PaintBucketService) {
        this.ctx = canvasContext;
        this.primaryColorRgba = paintBucketService.primaryColorRgba;
        this.primaryColor = paintBucketService.primaryColor;
        this.startX = paintBucketService.startX;
        this.startY = paintBucketService.startY;
        this.toleranceValue = paintBucketService.toleranceValue;
        this.mouseButtonClicked = paintBucketService.mouseButtonClicked;
    }

    execute() {
        if (this.mouseButtonClicked === MouseButton.Left) {
            this.floodFill(this.ctx, this.startX, this.startY, this.primaryColorRgba, this.toleranceValue);
        } else if (this.mouseButtonClicked === MouseButton.Right) {
            this.fill(this.ctx, this.startX, this.startY, this.primaryColorRgba, this.toleranceValue);
        }
    }

    fill(ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: ColorRgba, toleranceValue: number) {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const pixelData: PixelData = {
            width: imageData.width,
            height: imageData.height,
            data: new Uint32Array(imageData.data.buffer),
        };
        const color = (fillColor.alpha << 24) + (fillColor.blue << 16) + (fillColor.green << 8) + fillColor.red;
        const tolerance = (toleranceValue * toleranceValue * 4) ** 0.5;
        const targetColor = this.getPixel(pixelData, x, y);
        for (let y = 0; y < pixelData.height; y++) {
            for (let x = 0; x < pixelData.width; x++) {
                const currentPixelColor = this.getPixel(pixelData, x, y);
                if (this.calculateColorDistance(this.number2rgba(currentPixelColor), this.number2rgba(targetColor)) <= tolerance) {
                    pixelData.data[y * pixelData.width + x] = color;
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // Referenced from:
    // https://stackoverflow.com/questions/65359146/canvas-floodfill-leaves-white-pixels-at-edges-for-png-images-with-transparent
    floodFill(ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: ColorRgba, tolerance = 0) {
        let idx,
            blend,
            dist,
            spanLeft = true,
            spanRight = true,
            leftEdge = false,
            rightEdge = false;
        const width = ctx.canvas.width,
            height = ctx.canvas.height,
            pixels = width * height;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const p32 = new Uint32Array(data.buffer);

        // Add the starting mouse click to the stack
        const stack = [startX + startY * width];

        // Get the color in decimal form
        const targetColor = p32[stack[0]];

        const fillRed = fillColor.red | 0;
        const fillGreen = fillColor.green | 0;
        const fillBlue = fillColor.blue | 0;
        const fillAlpha = fillColor.alpha | 0;

        const newColor = (fillAlpha << 24) + (fillBlue << 16) + (fillGreen << 8) + fillRed;
        if (targetColor === newColor || targetColor === undefined) {
            return;
        }

        // Shift by 2 allows us to access typical RGBA color from the original data, not the buffer.
        idx = stack[0] << 2;

        const rightE = width - 1,
            bottomE = height - 1;
        const distances = new Uint16Array(width * height);

        // Normaliser pour espace 4d
        tolerance = (tolerance * tolerance * 4) ** 0.5;

        const red = data[idx];
        const green = data[idx + 1];
        const blue = data[idx + 2];
        const alpha = data[idx + 3];

        // Inline function so we have access to all local variables
        const colorDist = (idx: number) => {
            if (distances[idx]) {
                return Infinity;
            }
            idx <<= 2;
            const R = red - data[idx];
            const G = green - data[idx + 1];
            const B = blue - data[idx + 2];
            const A = alpha - data[idx + 3];
            const dist = (R * R + B * B + G * G + A * A) ** 0.5;
            return dist; // Euclidian distance between two colors
        };

        while (stack.length) {
            idx = stack.pop()!;
            while (idx >= width && colorDist(idx - width) <= tolerance) {
                idx -= width;
            } // move to top edge
            spanLeft = spanRight = false; // not going left right yet
            leftEdge = idx % width === 0;
            rightEdge = (idx + 1) % width === 0;
            while ((dist = colorDist(idx)) <= tolerance) {
                distances[idx] = ((dist / tolerance) * 255) | 0x8000;
                if (!leftEdge) {
                    if (colorDist(idx - 1) <= tolerance) {
                        if (!spanLeft) {
                            stack.push(idx - 1);
                            spanLeft = true;
                        } else if (spanLeft) {
                            spanLeft = false;
                        }
                    }
                }
                if (!rightEdge) {
                    if (colorDist(idx + 1) <= tolerance) {
                        if (!spanRight) {
                            stack.push(idx + 1);
                            spanRight = true;
                        } else if (spanRight) {
                            spanRight = false;
                        }
                    }
                }
                idx += width;
            }
        }
        idx = 0;
        while (idx < pixels) {
            dist = distances[idx];
            if (dist !== 0) {
                if (dist === 0x8000) {
                    p32[idx] = newColor;
                } else {
                    blend = false;
                    const x = idx % width;
                    const y = (idx / width) | 0;
                    if (x > 0 && distances[idx - 1] === 0) {
                        blend = true;
                    } else if (x < rightE && distances[idx + 1] === 0) {
                        blend = true;
                    } else if (y > 0 && distances[idx - width] === 0) {
                        blend = true;
                    } else if (y < bottomE && distances[idx + width] === 0) {
                        blend = true;
                    }
                    if (blend) {
                        dist &= 0xff;
                        dist = dist / 255;
                        const invDist = 1 - dist;
                        const idx1 = idx << 2;
                        data[idx1] = data[idx1] * dist + fillRed * invDist;
                        data[idx1 + 1] = data[idx1 + 1] * dist + fillGreen * invDist;
                        data[idx1 + 2] = data[idx1 + 2] * dist + fillBlue * invDist;
                        data[idx1 + 3] = data[idx1 + 3] * dist + fillAlpha * invDist;
                    } else {
                        p32[idx] = newColor;
                    }
                }
            }
            idx++;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    number2rgba(color: number): ColorRgba {
        const rgba = {
            red: color & 0xff,
            green: (color >> 8) & 0xff,
            blue: (color >> 16) & 0xff,
            alpha: ((color >> 24) & 0xff) / 255,
        };
        return rgba;
    }

    getPixel(pixelData: PixelData, x: number, y: number): number {
        if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
            return -1;
        } else {
            return pixelData.data[y * pixelData.width + x];
        }
    }

    calculateColorDistance(currentColor: ColorRgba, fillColor: ColorRgba): number {
        const R = currentColor.red - fillColor.red;
        const G = currentColor.green - fillColor.green;
        const B = currentColor.blue - fillColor.blue;

        const dist = (R * R + G * G + B * B) ** 0.5;
        return dist;
    }
}
