import { Injectable } from '@angular/core';

const WIDTH = 100;
const HEIGHT = 100;

@Injectable({
    providedIn: 'root',
})
export class CanvasTestHelper {
    canvas: HTMLCanvasElement;
    drawCanvas: HTMLCanvasElement;
    selectionCanvas: HTMLCanvasElement;
    borderCanvas: HTMLCanvasElement;
    previewSelectionCanvas: HTMLCanvasElement;

    constructor() {
        this.canvas = this.createCanvas(WIDTH, HEIGHT);
        this.drawCanvas = this.createCanvas(WIDTH, HEIGHT);
        this.selectionCanvas = this.createCanvas(WIDTH, HEIGHT);
        this.previewSelectionCanvas = this.createCanvas(WIDTH, HEIGHT);
        this.borderCanvas = this.createCanvas(WIDTH, HEIGHT);
    }

    private createCanvas(width: number, height: number): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
}
