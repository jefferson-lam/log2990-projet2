import { Inject, Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';

@Injectable({
    providedIn: 'root',
})
export class ResizerCommand extends Command {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;

    sideResizer: HTMLElement;
    cornerResizer: HTMLElement;
    bottomResizer: HTMLElement;

    previewWidth: number;
    previewHeight: number;

    constructor(private canvasGridService: CanvasGridService, @Inject(Number) width?: number, @Inject(Number) height?: number) {
        super();
        this.baseCtx = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = (document.getElementById('previewLayer') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;

        this.sideResizer = document.getElementById('sideResizer') as HTMLElement;
        this.cornerResizer = document.getElementById('cornerResizer') as HTMLElement;
        this.bottomResizer = document.getElementById('bottomResizer') as HTMLElement;

        this.previewWidth = this.previewCtx.canvas.width;
        this.previewHeight = this.previewCtx.canvas.height;
        if (width && height) {
            this.previewWidth = width;
            this.previewHeight = height;
        }
    }

    execute(): void {
        this.resizeCanvas();
    }

    /**
     * This function sets the base and preview canvas sizes to the one defined by the user.
     * It also saves the drawing that was on the canvas by doing a swap with the
     * preview canvas.
     */
    resizeCanvas(): void {
        // Save drawing to preview canvas before drawing is wiped due to resizing
        this.previewCtx.drawImage(this.baseCtx.canvas, 0, 0);

        // Resize base canvas ctx
        this.baseCtx.canvas.width = this.previewWidth;
        this.baseCtx.canvas.height = this.previewHeight;

        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.previewWidth, this.previewHeight);

        // Place resizers
        this.sideResizer.style.left = this.baseCtx.canvas.width + 'px';
        this.sideResizer.style.top = this.baseCtx.canvas.height / 2 + 'px';
        this.cornerResizer.style.left = this.baseCtx.canvas.width + 'px';
        this.cornerResizer.style.top = this.baseCtx.canvas.height + 'px';
        this.bottomResizer.style.top = this.baseCtx.canvas.height + 'px';
        this.bottomResizer.style.left = this.baseCtx.canvas.width / 2 + 'px';

        // Canvas resize wipes drawing -> copy drawing from preview layer to base layer
        this.baseCtx.drawImage(this.previewCtx.canvas, 0, 0);

        // Resize preview canvas ctx
        this.previewCtx.canvas.width = this.previewWidth;
        this.previewCtx.canvas.height = this.previewHeight;

        // Resize grid canvas ctx
        this.canvasGridService.resize(this.previewWidth, this.previewHeight);
    }
}
