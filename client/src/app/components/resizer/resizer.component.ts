import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as CanvasConstants from '@app/constants/canvas-constants';

@Component({
    selector: 'app-resizer',
    templateUrl: './resizer.component.html',
    styleUrls: ['./resizer.component.scss'],
})
export class ResizerComponent implements AfterViewInit, OnInit {
    baseCanvas: HTMLCanvasElement | null;
    previewCanvas: HTMLCanvasElement;
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;

    isSideResizerDown: boolean = false;
    isCornerResizerDown: boolean = false;
    isBottomResizerDown: boolean = false;

    @ViewChild('sideResizer', { static: false }) sideResizer: ElementRef<HTMLElement>;
    @ViewChild('cornerResizer', { static: false }) cornerResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomResizer', { static: false }) bottomResizer: ElementRef<HTMLElement>;

    ngOnInit(): void {
        this.baseCanvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.previewCanvas = document.getElementById('previewLayer') as HTMLCanvasElement;
    }

    ngAfterViewInit(): void {
        if (this.baseCanvas != null) {
            this.baseCtx = this.baseCanvas.getContext('2d') as CanvasRenderingContext2D;
            this.previewCtx = this.previewCanvas.getContext('2d') as CanvasRenderingContext2D;

            this.sideResizer.nativeElement.style.left = this.baseCtx.canvas.width + 'px';
            this.sideResizer.nativeElement.style.top = this.baseCtx.canvas.height / 2 + 'px';
            this.cornerResizer.nativeElement.style.left = this.baseCtx.canvas.width + 'px';
            this.cornerResizer.nativeElement.style.top = this.baseCtx.canvas.height + 'px';
            this.bottomResizer.nativeElement.style.left = this.baseCtx.canvas.width / 2 + 'px';
            this.bottomResizer.nativeElement.style.top = this.baseCtx.canvas.height + 'px';
        }
    }

    /**
     * This function is repeatedly called when the user drags one of the sliders, while holding
     * his mouse down. It displays a preview of the size of the canvas defined by the user's
     * mouse position. It also dynamically repositions the sliders to while the preview is ongoing.
     *
     */
    setPreviewSize(event: CdkDragMove): void {
        let canvasX: number = event.pointerPosition.x;
        let canvasY: number = event.pointerPosition.y;
        if (canvasY < CanvasConstants.MIN_HEIGHT_CANVAS) {
            canvasY = CanvasConstants.MIN_HEIGHT_CANVAS;
        }
        if (canvasX < CanvasConstants.MIN_LENGTH_CANVAS) {
            canvasX = CanvasConstants.MIN_LENGTH_CANVAS;
        }
        this.drawPreviewOfNewSize(canvasX, canvasY);
    }

    drawPreviewOfNewSize(x: number, y: number): void {
        if (this.isSideResizerDown) {
            this.previewCtx.canvas.width = x;
            this.cornerResizer.nativeElement.style.left = this.previewCtx.canvas.width + 'px';
            this.bottomResizer.nativeElement.style.left = this.previewCtx.canvas.width / 2 + 'px';

            this.sideResizer.nativeElement.style.left = this.previewCtx.canvas.width + 'px';
            this.sideResizer.nativeElement.style.transform = '';
        } else if (this.isCornerResizerDown) {
            this.previewCtx.canvas.width = x;
            this.previewCtx.canvas.height = y;

            this.sideResizer.nativeElement.style.left = this.previewCtx.canvas.width + 'px';
            this.sideResizer.nativeElement.style.top = this.previewCtx.canvas.height / 2 + 'px';

            this.bottomResizer.nativeElement.style.left = this.previewCtx.canvas.width / 2 + 'px';
            this.bottomResizer.nativeElement.style.top = this.previewCtx.canvas.height + 'px';

            this.cornerResizer.nativeElement.style.left = this.previewCtx.canvas.width + 'px';
            this.cornerResizer.nativeElement.style.top = this.previewCtx.canvas.height + 'px';
            this.cornerResizer.nativeElement.style.transform = '';
        } else if (this.isBottomResizerDown) {
            this.previewCtx.canvas.height = y;
            this.cornerResizer.nativeElement.style.top = this.previewCtx.canvas.height + 'px';
            this.sideResizer.nativeElement.style.top = this.previewCtx.canvas.height / 2 + 'px';

            this.bottomResizer.nativeElement.style.top = this.previewCtx.canvas.height + 'px';
            this.bottomResizer.nativeElement.style.transform = '';
        }
    }

    /**
     * This function is called when the user does a mouseup event, while dragging
     * the button. It sets the base canvas' size to the one defined by the user.
     * It also saves the drawing that was on the canvas by doing a swap with the
     * preview canvas.
     */
    expandCanvas(event: CdkDragEnd): void {
        this.lockMinCanvasValue();
        // Save drawing to preview canvas before drawing is wiped due to resizing
        this.previewCtx.drawImage(this.baseCtx.canvas, 0, 0);
        if (this.isSideResizerDown) {
            this.baseCtx.canvas.width = this.previewCtx.canvas.width;
            this.sideResizer.nativeElement.style.left = this.baseCtx.canvas.width + 'px';
            this.isSideResizerDown = false;
        } else if (this.isCornerResizerDown) {
            this.baseCtx.canvas.width = this.previewCtx.canvas.width;
            this.baseCtx.canvas.height = this.previewCtx.canvas.height;
            this.cornerResizer.nativeElement.style.left = this.baseCtx.canvas.width + 'px';
            this.cornerResizer.nativeElement.style.top = this.baseCtx.canvas.height + 'px';
            this.isCornerResizerDown = false;
        } else if (this.isBottomResizerDown) {
            this.baseCtx.canvas.height = this.previewCtx.canvas.height;
            this.bottomResizer.nativeElement.style.top = this.baseCtx.canvas.height + 'px';
            this.isBottomResizerDown = false;
        }
        // Canvas resize wipes drawing -> copy drawing from preview layer to base layer
        this.baseCtx.drawImage(this.previewCtx.canvas, 0, 0);
    }

    lockMinCanvasValue(): void {
        if (this.previewCtx.canvas.width < CanvasConstants.MIN_LENGTH_CANVAS) {
            this.previewCtx.canvas.width = CanvasConstants.MIN_LENGTH_CANVAS;

            this.sideResizer.nativeElement.style.left = CanvasConstants.MIN_LENGTH_CANVAS + 'px';

            this.cornerResizer.nativeElement.style.left = CanvasConstants.MIN_LENGTH_CANVAS + 'px';

            this.bottomResizer.nativeElement.style.left = this.previewCtx.canvas.width / 2 + 'px';
        }
        if (this.previewCtx.canvas.height < CanvasConstants.MIN_HEIGHT_CANVAS) {
            this.previewCtx.canvas.height = CanvasConstants.MIN_HEIGHT_CANVAS;
            this.bottomResizer.nativeElement.style.top = CanvasConstants.MIN_HEIGHT_CANVAS + 'px';
            this.cornerResizer.nativeElement.style.top = CanvasConstants.MIN_HEIGHT_CANVAS + 'px';
            this.sideResizer.nativeElement.style.top = this.previewCtx.canvas.height / 2 + 'px';
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
