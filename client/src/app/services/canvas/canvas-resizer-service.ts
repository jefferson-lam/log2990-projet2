import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { ElementRef, Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class CanvasResizerService {
    newDrawingSaved: boolean = false;

    newBaseCanvasRef: ImageData;
    newPreviewCanvasRef: ImageData;

    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    baseCanvas: ElementRef<HTMLCanvasElement>;
    previewCanvas: ElementRef<HTMLCanvasElement>;
    canvasSize: Vec2 = { x: 0, y: 0 };
    previewCanvasSize: Vec2 = { x: 0, y: 0 };

    isSideResizerDown: boolean = false;
    isCornerResizerDown: boolean = false;
    isBottomResizerDown: boolean = false;

    sideResizer: ElementRef<HTMLElement>;
    cornerResizer: ElementRef<HTMLElement>;
    bottomResizer: ElementRef<HTMLElement>;

    canvasImageData: ImageData;

    constructor(public drawingService: DrawingService) {}

    /**
     * This function is repeatedly called when the user drags one of the sliders, while holding
     * his mouse down. It displays a preview of the size of the canvas defined by the user's
     * mouse position. It also dynamically repositions the sliders to while the preview is ongoing.
     **/
    drawPreviewOfNewSize(event: CdkDragMove): void {
        this.putDrawingOnBaseCanvas();
        this.newBaseCanvasRef = this.baseCtx.getImageData(0, 0, this.baseCtx.canvas.width, this.baseCtx.canvas.height);
        if (this.isSideResizerDown) {
            this.previewCanvasSize.x = event.pointerPosition.x;
            this.cornerResizer.nativeElement.style.left = event.pointerPosition.x + 'px';
            this.bottomResizer.nativeElement.style.left = event.pointerPosition.x / 2 + 'px';

            this.sideResizer.nativeElement.style.left = event.pointerPosition.x + 'px';
            this.sideResizer.nativeElement.style.transform = '';
        } else if (this.isCornerResizerDown) {
            this.previewCanvasSize.x = event.pointerPosition.x;
            this.previewCanvasSize.y = event.pointerPosition.y;

            this.sideResizer.nativeElement.style.left = this.previewCanvasSize.x + 'px';
            this.sideResizer.nativeElement.style.top = this.previewCanvasSize.y / 2 + 'px';

            this.bottomResizer.nativeElement.style.left = this.previewCanvasSize.x / 2 + 'px';
            this.bottomResizer.nativeElement.style.top = this.previewCanvasSize.y + 'px';

            this.cornerResizer.nativeElement.style.left = this.previewCanvasSize.x + 'px';
            this.cornerResizer.nativeElement.style.top = this.previewCanvasSize.y + 'px';
            this.cornerResizer.nativeElement.style.transform = '';
        } else if (this.isBottomResizerDown) {
            this.previewCanvasSize.y = event.pointerPosition.y;
            this.cornerResizer.nativeElement.style.top = this.previewCanvasSize.y + 'px';
            this.sideResizer.nativeElement.style.top = this.previewCanvasSize.y / 2 + 'px';

            this.bottomResizer.nativeElement.style.top = this.previewCanvasSize.y + 'px';
            this.bottomResizer.nativeElement.style.transform = '';
        }
    }

    expandCanvas(event: CdkDragEnd): void {
        if (this.isSideResizerDown) {
            this.lockMinCanvasValue();
            this.canvasSize.x = this.previewCanvasSize.x;
            this.sideResizer.nativeElement.style.left = this.canvasSize.x + 'px';
            this.isSideResizerDown = false;
        } else if (this.isCornerResizerDown) {
            this.lockMinCanvasValue();
            this.canvasSize.x = this.previewCanvasSize.x;
            this.canvasSize.y = this.previewCanvasSize.y;
            this.cornerResizer.nativeElement.style.left = this.canvasSize.x + 'px';
            this.cornerResizer.nativeElement.style.top = this.canvasSize.y + 'px';
            this.isCornerResizerDown = false;
        } else if (this.isBottomResizerDown) {
            this.lockMinCanvasValue();
            this.canvasSize.y = this.previewCanvasSize.y;
            this.bottomResizer.nativeElement.style.top = this.canvasSize.y + 'px';
            this.isBottomResizerDown = false;
        }
        this.saveDrawingOnPreviewCanvas();
    }

    lockMinCanvasValue(): void {
        if (this.previewCanvasSize.x <= CanvasConstants.MIN_HEIGHT_CANVAS) {
            this.previewCanvasSize.x = CanvasConstants.MIN_HEIGHT_CANVAS;

            this.sideResizer.nativeElement.style.left = CanvasConstants.MIN_HEIGHT_CANVAS + 'px';

            this.cornerResizer.nativeElement.style.left = CanvasConstants.MIN_HEIGHT_CANVAS + 'px';

            this.bottomResizer.nativeElement.style.left = this.previewCanvasSize.x / 2 + 'px';
        }
        if (this.previewCanvasSize.y <= CanvasConstants.MIN_LENGTH_CANVAS) {
            this.previewCanvasSize.y = CanvasConstants.MIN_LENGTH_CANVAS;
            this.bottomResizer.nativeElement.style.top = CanvasConstants.MIN_LENGTH_CANVAS + 'px';
            this.cornerResizer.nativeElement.style.top = CanvasConstants.MIN_LENGTH_CANVAS + 'px';
            this.sideResizer.nativeElement.style.top = this.previewCanvasSize.y / 2 + 'px';
        }
        if (this.previewCanvasSize.x <= CanvasConstants.MIN_HEIGHT_CANVAS && this.previewCanvasSize.y <= CanvasConstants.MIN_LENGTH_CANVAS) {
            this.previewCanvasSize.x = CanvasConstants.MIN_HEIGHT_CANVAS;

            this.previewCanvasSize.y = CanvasConstants.MIN_LENGTH_CANVAS;
            this.cornerResizer.nativeElement.style.left = CanvasConstants.MIN_HEIGHT_CANVAS + 'px';

            this.cornerResizer.nativeElement.style.top = CanvasConstants.MIN_LENGTH_CANVAS + 'px';
            this.sideResizer.nativeElement.style.left = CanvasConstants.MIN_HEIGHT_CANVAS + 'px';

            this.bottomResizer.nativeElement.style.top = CanvasConstants.MIN_LENGTH_CANVAS + 'px';
        }
    }

    putDrawingOnBaseCanvas(): void {
        if (this.newDrawingSaved) {
            this.baseCtx.putImageData(this.newPreviewCanvasRef, 0, 0);
            this.previewCtx.putImageData(this.newPreviewCanvasRef, 0, 0);
            this.newBaseCanvasRef = this.newPreviewCanvasRef;
            this.newDrawingSaved = false;
        }
    }

    saveDrawingOnPreviewCanvas(): void {
        if (!this.newDrawingSaved) {
            this.newPreviewCanvasRef = this.baseCtx.getImageData(0, 0, this.baseCtx.canvas.width, this.baseCtx.canvas.height);
            this.previewCtx.putImageData(this.newBaseCanvasRef, 0, 0);
            this.baseCtx.putImageData(this.newBaseCanvasRef, 0, 0);
            this.newDrawingSaved = true;
        }
    }

    onCornerResizerDown(): void {
        this.isCornerResizerDown = true;
    }

    onSideResizerDown(): void {
        this.isSideResizerDown = true;
    }

    onBottomResizerDown(): void {
        this.isBottomResizerDown = true;
    }
}
