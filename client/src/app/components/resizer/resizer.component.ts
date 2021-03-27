import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Command } from '@app/classes/command';
import { ResizerCommand } from '@app/components/resizer/resizer-command';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-resizer',
    templateUrl: './resizer.component.html',
    styleUrls: ['./resizer.component.scss'],
})
export class ResizerComponent implements AfterViewInit {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;

    isSideResizerDown: boolean = false;
    isCornerResizerDown: boolean = false;
    isBottomResizerDown: boolean = false;

    @ViewChild('sideResizer', { static: false }) sideResizer: ElementRef<HTMLElement>;
    @ViewChild('cornerResizer', { static: false }) cornerResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomResizer', { static: false }) bottomResizer: ElementRef<HTMLElement>;

    constructor(private undoRedoService: UndoRedoService, private drawingService: DrawingService, private autoSaveService: AutoSaveService) {}

    ngAfterViewInit(): void {
        this.previewCtx = this.drawingService.previewCtx;
        this.baseCtx = this.drawingService.baseCtx;
        this.sideResizer.nativeElement.style.left = this.baseCtx.canvas.width + 'px';
        this.sideResizer.nativeElement.style.top = this.baseCtx.canvas.height / 2 + 'px';
        this.cornerResizer.nativeElement.style.left = this.baseCtx.canvas.width + 'px';
        this.cornerResizer.nativeElement.style.top = this.baseCtx.canvas.height + 'px';
        this.bottomResizer.nativeElement.style.left = this.baseCtx.canvas.width / 2 + 'px';
        this.bottomResizer.nativeElement.style.top = this.baseCtx.canvas.height + 'px';

        this.autoSaveService.loadDrawing();
    }

    /**
     * This function is repeatedly called when the user drags one of the sliders, while holding
     * his mouse down. It displays a preview of the size of the canvas defined by the user's
     * mouse position. It also dynamically repositions the sliders to while the preview is ongoing.
     *
     */
    setPreviewSize(event: CdkDragMove): void {
        if (this.isSideResizerDown) {
            this.previewCtx.canvas.width = event.pointerPosition.x - CanvasConstants.LEFT_MARGIN;
        } else if (this.isCornerResizerDown) {
            this.previewCtx.canvas.width = event.pointerPosition.x - CanvasConstants.LEFT_MARGIN;
            this.previewCtx.canvas.height = event.pointerPosition.y;
        } else if (this.isBottomResizerDown) {
            this.previewCtx.canvas.height = event.pointerPosition.y;
        }
        this.lockMinCanvasValue();
        this.drawPreviewOfNewSize();
    }

    drawPreviewOfNewSize(): void {
        this.sideResizer.nativeElement.style.left = this.previewCtx.canvas.width + 'px';
        this.sideResizer.nativeElement.style.top = this.previewCtx.canvas.height / 2 + 'px';
        this.cornerResizer.nativeElement.style.left = this.previewCtx.canvas.width + 'px';
        this.cornerResizer.nativeElement.style.top = this.previewCtx.canvas.height + 'px';
        this.bottomResizer.nativeElement.style.top = this.previewCtx.canvas.height + 'px';
        this.bottomResizer.nativeElement.style.left = this.previewCtx.canvas.width / 2 + 'px';

        this.sideResizer.nativeElement.style.transform = '';
        this.cornerResizer.nativeElement.style.transform = '';
        this.bottomResizer.nativeElement.style.transform = '';
    }

    expandCanvas(event: CdkDragEnd): void {
        this.lockMinCanvasValue();
        this.drawingService.canvasHeightObservable.next(this.previewCtx.canvas.height);
        this.drawingService.canvasWidthObservable.next(this.previewCtx.canvas.width);
        const command: Command = new ResizerCommand();
        this.undoRedoService.executeCommand(command);
        this.isSideResizerDown = false;
        this.isCornerResizerDown = false;
        this.isBottomResizerDown = false;
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
