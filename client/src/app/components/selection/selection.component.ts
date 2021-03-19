import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent implements AfterViewInit {
    @ViewChild('selectionCanvas', { static: false }) selectionCanvas: ElementRef<HTMLCanvasElement>;

    @ViewChild('leftResizer', { static: false }) leftResizer: ElementRef<HTMLElement>;
    @ViewChild('rightResizer', { static: false }) rightResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomResizer', { static: false }) bottomResizer: ElementRef<HTMLElement>;
    @ViewChild('topResizer', { static: false }) topResizer: ElementRef<HTMLElement>;
    @ViewChild('topLeftResizer', { static: false }) topLeftResizer: ElementRef<HTMLElement>;
    @ViewChild('topRightResizer', { static: false }) topRightResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomLeftResizer', { static: false }) bottomLeftResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomRightResizer', { static: false }) bottomRightResizer: ElementRef<HTMLElement>;

    public selectionCtx: CanvasRenderingContext2D;
    public cdk: CdkDrag;

    constructor(
        private drawingService: DrawingService,
        public resizerHandlerService: ResizerHandlerService,
        public rectangleSelectionService: RectangleSelectionService,
    ) {}

    ngAfterViewInit(): void {
        this.selectionCtx = this.selectionCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.selectionCtx = this.selectionCtx;
        this.drawingService.selectionCanvas = this.selectionCanvas.nativeElement;
        this.resizerHandlerService.leftResizer = this.leftResizer.nativeElement;
        this.resizerHandlerService.rightResizer = this.rightResizer.nativeElement;
        this.resizerHandlerService.bottomResizer = this.bottomResizer.nativeElement;
        this.resizerHandlerService.topResizer = this.topResizer.nativeElement;
        this.resizerHandlerService.topLeftResizer = this.topLeftResizer.nativeElement;
        this.resizerHandlerService.topRightResizer = this.topRightResizer.nativeElement;
        this.resizerHandlerService.bottomLeftResizer = this.bottomLeftResizer.nativeElement;
        this.resizerHandlerService.bottomRightResizer = this.bottomRightResizer.nativeElement;
    }

    repositionResizers(event: CdkDragMove): void {
        const transformValues: Vec2 = this.getTransformValues(this.selectionCanvas.nativeElement);
        this.setResizerPosition(transformValues);
    }

    setCanvasPosition(event: CdkDragEnd): void {
        let newTopPosition = parseInt(this.selectionCanvas.nativeElement.style.top) + event.distance.y;
        let newLeftPosition = parseInt(this.selectionCanvas.nativeElement.style.left) + event.distance.x;
        if (newTopPosition < 0) {
            newTopPosition = 0;
        }
        if (newLeftPosition < 0) {
            newLeftPosition = 0;
        }
        this.selectionCanvas.nativeElement.style.top = newTopPosition + 'px';
        this.selectionCanvas.nativeElement.style.left = newLeftPosition + 'px';
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

    setResizerPosition(transformValues: Vec2): void {
        const canvasWidth = this.selectionCanvas.nativeElement.width;
        const canvasHeight = this.selectionCanvas.nativeElement.height;
        const newCanvasPosition = {
            x: parseInt(this.selectionCanvas.nativeElement.style.left) + transformValues.x,
            y: parseInt(this.selectionCanvas.nativeElement.style.top) + transformValues.y,
        };
        this.resizerHandlerService.setResizerPosition(newCanvasPosition, canvasWidth, canvasHeight);
    }
}
