import { Injectable } from '@angular/core';
import { PixelData } from '@app/classes/pixel-data';
import { Tool } from '@app/classes/tool';
import { MAX_RGB_VALUE } from '@app/constants/color-constants';
import { MouseButton } from '@app/constants/mouse-constants';
import { DEFAULT_TOLERANCE_VALUE, MIN_RGB_VALUE } from '@app/constants/paint-bucket-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

export interface ColorRgba {
    r: number;
    g: number;
    b: number;
    a: number;
}
@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    primaryColor: string;
    primaryColorHex: number;
    toleranceValue: number = DEFAULT_TOLERANCE_VALUE;
    x: number;
    y: number;
    mouseButtonClicked: MouseButton;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
    }

    setPrimaryColor(newColor: string): void {
        this.primaryColorHex = parseInt(this.argb2hex(this.getArgb(newColor)), 16);
        this.primaryColor = newColor;
    }

    setToleranceValue(toleranceValue: number): void {
        this.toleranceValue = toleranceValue;
    }

    onMouseDown(event: MouseEvent) {
        this.x = event.offsetX;
        this.y = event.offsetY;
        if (event.button === MouseButton.Left) {
            this.floodFill3(this.drawingService.baseCtx, this.x, this.y, { r: 0, g: 0, b: 0, a: 255 | 0 }, 255);
        }
        // this.mouseButtonClicked = event.button;
        // const command: Command = new PaintBucketCommand(this.drawingService.baseCtx, this);
        // this.undoRedoService.executeCommand(command);
    }

    getPixel(pixelData: PixelData, x: number, y: number): number {
        if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
            return -1;
        } else {
            return pixelData.data[y * pixelData.width + x];
        }
    }

    floodFill(ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: number) {
        let imageData = ctx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        let pixelData: PixelData = {
            width: imageData.width,
            height: imageData.height,
            data: new Uint32Array(imageData.data.buffer), // RGBA values are stored in a single value DEC(ABGR) which allows easy get/set
        };
        const targetColor = this.getPixel(pixelData, x, y);
        const matchingColorInterval = this.findBounds(targetColor, this.toleranceValue);
        const lowerBound = matchingColorInterval[0];
        const upperBound = matchingColorInterval[1];
        if (fillColor != targetColor) {
            let pixels = [x, y];
            while (pixels.length > 0) {
                const y = pixels.pop()!;
                const x = pixels.pop()!;
                const currentPixelColor = this.getPixel(pixelData, x, y);
                if (currentPixelColor >= lowerBound && currentPixelColor <= upperBound) {
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

    matchColors(confidenceInterval: any, color: number) {
        if (color <= confidenceInterval[1] && color >= confidenceInterval[0]) {
            return true;
        }
        return false;
    }

    floodFill3(ctx: CanvasRenderingContext2D, startX: number, startY: number, curColor: ColorRgba, tolerance = 0) {
        var idx,
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
        const stack = [startX + startY * width];
        const targetColor = p32[stack[0]];
        const fr = curColor.r | 0;
        const fg = curColor.g | 0;
        const fb = curColor.b | 0;
        const fa = curColor.a | 0;
        const newColor = (fa << 24) + (fb << 16) + (fg << 8) + fr;
        console.log(newColor);
        if (targetColor === newColor || targetColor === undefined) {
            return;
        }

        idx = stack[0] << 2;
        const rightE = width - 1,
            bottomE = height - 1;
        const distances = new Uint16Array(width * height);
        tolerance = (tolerance * tolerance * 4) ** 0.5;

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        function colorDist(idx: number) {
            if (distances[idx]) {
                return Infinity;
            }
            idx <<= 2;
            const R = r - data[idx];
            const G = g - data[idx + 1];
            const B = b - data[idx + 2];
            const A = a - data[idx + 3];
            return (R * R + B * B + G * G + A * A) ** 0.5;
        }

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
                        data[idx1] = data[idx1] * dist + fr * invDist;
                        data[idx1 + 1] = data[idx1 + 1] * dist + fg * invDist;
                        data[idx1 + 2] = data[idx1 + 2] * dist + fb * invDist;
                        data[idx1 + 3] = data[idx1 + 3] * dist + fa * invDist;
                    } else {
                        p32[idx] = newColor;
                    }
                }
            }
            idx++;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    // Taken from: https://stackoverflow.com/questions/59833738/how-can-i-avoid-exceeding-the-max-call-stack-size-during-a-flood-fill-algorithm
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
        let iter = 0;
        if (targetColor === fillColor || targetColor === undefined) {
            return;
        } // avoid endless loop
        while (stack.length) {
            iter++;
            let idx = stack.pop()!;
            while (idx >= w && this.matchColors(confidenceInterval, p32[idx - w])) {
                idx -= w;
            } // move to top edge
            right = left = false;
            leftEdge = idx % w === 0;
            rightEdge = (idx + 1) % w === 0;
            while (this.matchColors(confidenceInterval, p32[idx])) {
                iter++;
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
        console.log(iter);
        console.log(p32.length);
        return;
    }

    fill(ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: number) {
        const imageData = ctx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
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

    private getArgb(color: string): RegExpMatchArray {
        const match = color.match(/[.?\d]+/g)!;
        match.unshift(match.pop()!);
        return match;
    }

    private argb2hex(argb: string[]) {
        let alpha = Math.round((parseFloat(argb[0]) * 255) | (1 << 8))
            .toString(16)
            .slice(1);
        let hex =
            alpha +
            (parseInt(argb[3]) | (1 << 8)).toString(16).slice(1) +
            (parseInt(argb[2]) | (1 << 8)).toString(16).slice(1) +
            (parseInt(argb[1]) | (1 << 8)).toString(16).slice(1);
        return hex;
    }

    // Tolerance d'ecart: chaque rgba +/- tolerance d'ecart (%) reconvertie en number
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

    onToolChange() {
        this.toleranceValue = 0;
    }

    // private matchColors(confidenceInterval: any, currentPixelColor: number): boolean {
    //     const currentRgba = this.number2rgba(currentPixelColor);
    //     if (
    //         currentRgba.blue > confidenceInterval[1].blue ||
    //         currentRgba.red > confidenceInterval[1].red ||
    //         currentRgba.green > confidenceInterval[1].green ||
    //         currentRgba.green < confidenceInterval[0].green ||
    //         currentRgba.blue < confidenceInterval[0].blue ||
    //         currentRgba.red < confidenceInterval[0].red
    //     ) {
    //         return false;
    //     }
    //     return true;
    // }

    // private matchColors(currentPixelColor: number, targetColor: number): boolean {
    //     const l = this.hasSeen.get(currentPixelColor);
    //     if (l) {
    //         return true;
    //     } else if (l === false) {
    //         return false;
    //     }
    //     const dist = (Math.sqrt(Math.pow(currentPixelColor - targetColor, 2)) / 16777215) * 100;
    //     if (dist <= this.toleranceValue) {
    //         this.hasSeen.set(currentPixelColor, true);
    //         return true;
    //     }
    //     this.hasSeen.set(currentPixelColor, false);
    //     return false;
    // }
}
