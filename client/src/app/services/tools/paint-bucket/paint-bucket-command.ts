import { Command } from '@app/classes/command';
import { PixelData } from '@app/classes/pixel-data';
import { MouseButton } from '@app/constants/mouse-constants';
import { ALPHA_INDEX, BIT_16, BIT_24, BIT_8, DIMENSION_4D, DISTANCE_MASK, INVALID_VALUE, MAX_RGB_VALUE } from '@app/constants/paint-bucket-constants';
import { ColorRgba, PaintBucketService } from './paint-bucket-service';

// tslint:disable:no-bitwise
// tslint:disable:cyclomatic-complexity
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

    setValues(canvasContext: CanvasRenderingContext2D, paintBucketService: PaintBucketService): void {
        this.ctx = canvasContext;
        this.primaryColorRgba = paintBucketService.primaryColorRgba;
        this.primaryColor = paintBucketService.primaryColor;
        this.startX = paintBucketService.startX;
        this.startY = paintBucketService.startY;
        this.toleranceValue = paintBucketService.toleranceValue;
        this.mouseButtonClicked = paintBucketService.mouseButtonClicked;
    }

    execute(): void {
        if (this.mouseButtonClicked === MouseButton.Left) {
            this.floodFill(this.ctx, this.startX, this.startY, this.primaryColorRgba, this.toleranceValue);
        } else if (this.mouseButtonClicked === MouseButton.Right) {
            this.fill(this.ctx, this.startX, this.startY, this.primaryColorRgba, this.toleranceValue);
        }
    }

    fill(ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: ColorRgba, toleranceValue: number): void {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const pixelData: PixelData = {
            width: imageData.width,
            height: imageData.height,
            data: new Uint32Array(imageData.data.buffer),
        };
        const color = (fillColor.alpha << BIT_24) + (fillColor.blue << BIT_16) + (fillColor.green << BIT_8) + fillColor.red;

        // Normalise tolerance to be able to compare with 4d space
        const tolerance = Math.sqrt(toleranceValue * toleranceValue * DIMENSION_4D);
        const targetColor = this.getPixel(pixelData, startX, startY);
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
    // Uses the span-fill flood fill algorithm.
    floodFill(ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: ColorRgba, toleranceValue: number): void {
        let pixelPosition;
        let blend;
        let distance;
        let spanLeft = true;
        let spanRight = true;
        let leftEdge = false;
        let rightEdge = false;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = width * height;
        const data = imageData.data;
        const pixelData = {
            width: { width },
            height: { height },
            data: new Uint32Array(imageData.data.buffer),
        };

        // Add the starting mouse click to the stack. We use a stack to simulate recursion.
        const stack = [startX + startY * width];

        // Get the color in decimal form
        const targetColor = pixelData.data[stack[0]];

        // Convert fillColor into its decimal form as ABGR.
        const newColor = (fillColor.alpha << BIT_24) + (fillColor.blue << BIT_16) + (fillColor.green << BIT_8) + fillColor.red;

        if (targetColor === newColor || targetColor === undefined) {
            return;
        }

        // Shift by 2 allows us to access typical RGBA color from the original data, not the buffer.
        pixelPosition = stack[0] << 2;
        const rightE = width - 1;
        const bottomE = height - 1;

        // Array of distances will keep track which pixel has been marked as valid to paint on
        // If distance is 0 for that specific pixel, it means that it did not pass the tolerance check
        const distances = new Uint16Array(width * height);

        // Normalise tolerance to account for 4d space
        const tolerance = Math.sqrt(toleranceValue * toleranceValue * DIMENSION_4D);

        const red = data[pixelPosition];
        const green = data[pixelPosition + 1];
        const blue = data[pixelPosition + 2];
        const alpha = data[pixelPosition + ALPHA_INDEX];

        // Inline function so we have access to all local variables and to accelerate computation
        const colorDist = (pixelIndex: number) => {
            if (distances[pixelIndex]) {
                return Infinity;
            }
            pixelIndex <<= 2;
            const R = red - data[pixelIndex];
            const G = green - data[pixelIndex + 1];
            const B = blue - data[pixelIndex + 2];
            const A = alpha - data[pixelIndex + ALPHA_INDEX];
            const colorDistance = Math.sqrt(R * R + B * B + G * G + A * A);
            return colorDistance; // Euclidian distance between two colors
        };

        while (stack.length) {
            pixelPosition = stack.pop()!;
            while (pixelPosition >= width && colorDist(pixelPosition - width) <= tolerance) {
                pixelPosition -= width;
            } // move to top edge
            spanLeft = spanRight = false; // not going left right yet
            leftEdge = pixelPosition % width === 0;
            rightEdge = (pixelPosition + 1) % width === 0;
            distance = colorDist(pixelPosition);
            while (distance <= tolerance) {
                distances[pixelPosition] = ((distance / tolerance) * MAX_RGB_VALUE) | DISTANCE_MASK;
                if (!leftEdge) {
                    if (colorDist(pixelPosition - 1) <= tolerance) {
                        if (!spanLeft) {
                            stack.push(pixelPosition - 1);
                            spanLeft = true;
                        } else if (spanLeft) {
                            spanLeft = false;
                        }
                    }
                }
                if (!rightEdge) {
                    if (colorDist(pixelPosition + 1) <= tolerance) {
                        if (!spanRight) {
                            stack.push(pixelPosition + 1);
                            spanRight = true;
                        } else if (spanRight) {
                            spanRight = false;
                        }
                    }
                }
                pixelPosition += width;
                distance = colorDist(pixelPosition);
            }
        }
        pixelPosition = 0;
        while (pixelPosition < pixels) {
            distance = distances[pixelPosition];
            if (distance !== 0) {
                if (distance === DISTANCE_MASK) {
                    pixelData.data[pixelPosition] = newColor;
                } else {
                    blend = false;
                    const x = pixelPosition % width;
                    const y = (pixelPosition / width) | 0;
                    if (x > 0 && distances[pixelPosition - 1] === 0) {
                        blend = true;
                    } else if (x < rightE && distances[pixelPosition + 1] === 0) {
                        blend = true;
                    } else if (y > 0 && distances[pixelPosition - width] === 0) {
                        blend = true;
                    } else if (y < bottomE && distances[pixelPosition + width] === 0) {
                        blend = true;
                    }
                    if (blend) {
                        distance &= MAX_RGB_VALUE;
                        distance = distance / MAX_RGB_VALUE;
                        const invDist = 1 - distance;
                        const idx1 = pixelPosition << 2;
                        data[idx1] = data[idx1] * distance + fillColor.red * invDist;
                        data[idx1 + 1] = data[idx1 + 1] * distance + fillColor.green * invDist;
                        data[idx1 + 2] = data[idx1 + 2] * distance + fillColor.blue * invDist;
                        data[idx1 + ALPHA_INDEX] = data[idx1 + ALPHA_INDEX] * distance + fillColor.alpha * invDist;
                    } else {
                        pixelData.data[pixelPosition] = newColor;
                    }
                }
            }
            pixelPosition++;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    number2rgba(color: number): ColorRgba {
        const rgba = {
            red: color & MAX_RGB_VALUE,
            green: (color >> BIT_8) & MAX_RGB_VALUE,
            blue: (color >> BIT_16) & MAX_RGB_VALUE,
            alpha: ((color >> BIT_24) & MAX_RGB_VALUE) / MAX_RGB_VALUE,
        };
        return rgba;
    }

    getPixel(pixelData: PixelData, x: number, y: number): number {
        if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
            return INVALID_VALUE;
        } else {
            return pixelData.data[y * pixelData.width + x];
        }
    }

    calculateColorDistance(currentColor: ColorRgba, fillColor: ColorRgba): number {
        const R = currentColor.red - fillColor.red;
        const G = currentColor.green - fillColor.green;
        const B = currentColor.blue - fillColor.blue;
        const distance = Math.sqrt(R * R + G * G + B * B);
        return distance;
    }
}
