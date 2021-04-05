import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';
@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent implements AfterViewInit {
    @ViewChild('selectionCanvas', { static: false }) selectionCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewSelectionCanvas', { static: false }) previewSelectionCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('selectionBox', { static: false }) selectionContainer: ElementRef<HTMLCanvasElement>;

    @ViewChild('leftResizer', { static: false }) leftResizer: ElementRef<HTMLElement>;
    @ViewChild('rightResizer', { static: false }) rightResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomResizer', { static: false }) bottomResizer: ElementRef<HTMLElement>;
    @ViewChild('topResizer', { static: false }) topResizer: ElementRef<HTMLElement>;
    @ViewChild('topLeftResizer', { static: false }) topLeftResizer: ElementRef<HTMLElement>;
    @ViewChild('topRightResizer', { static: false }) topRightResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomLeftResizer', { static: false }) bottomLeftResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomRightResizer', { static: false }) bottomRightResizer: ElementRef<HTMLElement>;

    selectionCtx: CanvasRenderingContext2D;
    previewSelectionCtx: CanvasRenderingContext2D;

    constructor(private drawingService: DrawingService, public resizerHandlerService: ResizerHandlerService) {}

    ngAfterViewInit(): void {
        this.selectionCtx = this.selectionCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewSelectionCtx = this.selectionCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.selectionCtx = this.selectionCtx;
        this.drawingService.previewSelectionCtx = this.previewSelectionCtx;
        this.drawingService.selectionCanvas = this.selectionCanvas.nativeElement;
        this.drawingService.previewSelectionCanvas = this.previewSelectionCanvas.nativeElement;

        this.resizerHandlerService.leftResizer = this.leftResizer.nativeElement;
        this.resizerHandlerService.rightResizer = this.rightResizer.nativeElement;
        this.resizerHandlerService.bottomResizer = this.bottomResizer.nativeElement;
        this.resizerHandlerService.topResizer = this.topResizer.nativeElement;
        this.resizerHandlerService.topLeftResizer = this.topLeftResizer.nativeElement;
        this.resizerHandlerService.topRightResizer = this.topRightResizer.nativeElement;
        this.resizerHandlerService.bottomLeftResizer = this.bottomLeftResizer.nativeElement;
        this.resizerHandlerService.bottomRightResizer = this.bottomRightResizer.nativeElement;

        this.drawingService.canvasSizeSubject.asObservable().subscribe((size) => {
            this.resizeContainer(size[0], size[1]);
        });
    }

    resizeContainer(width: number, height: number): void {
        this.selectionContainer.nativeElement.style.width = width + 'px';
        this.selectionContainer.nativeElement.style.height = height + 'px';
    }

    onCanvasMove(didCanvasMove: boolean): void {
        if (didCanvasMove) {
            this.repositionResizers({} as CdkDragMove);
        }
    }

    repositionResizers(event: CdkDragMove): void {
        const transformValues: Vec2 = this.getTransformValues(this.selectionCanvas.nativeElement);
        this.setResizerPosition(transformValues, this.selectionCanvas.nativeElement, this.previewSelectionCanvas.nativeElement);
    }

    repositionPreviewResizers(event: CdkDragMove): void {
        const transformValues: Vec2 = this.getTransformValues(this.previewSelectionCanvas.nativeElement);
        this.setResizerPosition(transformValues, this.previewSelectionCanvas.nativeElement, this.selectionCanvas.nativeElement);
    }

    setSelectionCanvasPosition(event: CdkDragEnd): void {
        const newTopPosition = parseInt(this.selectionCanvas.nativeElement.style.top, 10) + event.distance.y;
        const newLeftPosition = parseInt(this.selectionCanvas.nativeElement.style.left, 10) + event.distance.x;
        this.selectionCanvas.nativeElement.style.top = newTopPosition + 'px';
        this.selectionCanvas.nativeElement.style.left = newLeftPosition + 'px';
        this.previewSelectionCanvas.nativeElement.style.top = newTopPosition + 'px';
        this.previewSelectionCanvas.nativeElement.style.left = newLeftPosition + 'px';
        event.source._dragRef.reset();
    }

    setPreviewSelectionCanvasPosition(event: CdkDragEnd): void {
        const newTopPosition = parseInt(this.previewSelectionCanvas.nativeElement.style.top, 10) + event.distance.y;
        const newLeftPosition = parseInt(this.previewSelectionCanvas.nativeElement.style.left, 10) + event.distance.x;
        this.selectionCanvas.nativeElement.style.top = newTopPosition + 'px';
        this.selectionCanvas.nativeElement.style.left = newLeftPosition + 'px';
        this.previewSelectionCanvas.nativeElement.style.top = newTopPosition + 'px';
        this.previewSelectionCanvas.nativeElement.style.left = newLeftPosition + 'px';
        event.source._dragRef.reset();
    }

    getTransformValues(element: HTMLElement): Vec2 {
        const style = window.getComputedStyle(element);
        const matrix = new WebKitCSSMatrix(style.transform);
        return {
            x: matrix.m41,
            y: matrix.m42,
        };
    }

    setResizerPosition(transformValues: Vec2, movedCanvas: HTMLCanvasElement, backgroundCanvas: HTMLCanvasElement): void {
        const canvasWidth = movedCanvas.width;
        const canvasHeight = movedCanvas.height;
        const newCanvasPosition = {
            x: parseInt(movedCanvas.style.left, 10) + transformValues.x,
            y: parseInt(movedCanvas.style.top, 10) + transformValues.y,
        };
        backgroundCanvas.style.left = newCanvasPosition.x + 'px';
        backgroundCanvas.style.top = newCanvasPosition.y + 'px';
        this.resizerHandlerService.setResizerPosition(newCanvasPosition, canvasWidth, canvasHeight);
    }
}
