import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent implements OnInit {
    @ViewChild('selectionCanvas', { static: false }) selectionCanvas: ElementRef<HTMLCanvasElement>;

    @ViewChild('leftResizer', { static: false }) leftResizer: ElementRef<HTMLElement>;
    @ViewChild('rightResizer', { static: false }) rightResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomResizer', { static: false }) bottomResizer: ElementRef<HTMLElement>;
    @ViewChild('topResizer', { static: false }) topResizer: ElementRef<HTMLElement>;
    @ViewChild('topLeftResizer', { static: false }) topLeftResizer: ElementRef<HTMLElement>;
    @ViewChild('topRightResizer', { static: false }) topRightResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomLeftResizer', { static: false }) bottomLeftResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomRightResizer', { static: false }) bottomRightResizer: ElementRef<HTMLElement>;

    private selectionCtx: CanvasRenderingContext2D;

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

    ngOnInit(): void {}

    repositionResizers(event: CdkDragMove): void {
        const transformValues: Vec2 = this.getTransformValues(this.selectionCanvas.nativeElement);
        this.setResizersPosition(transformValues);
    }

    setPosition(event: CdkDragEnd): void {
        this.selectionCanvas.nativeElement.style.top = parseInt(this.selectionCanvas.nativeElement.style.top) + event.distance.y + 'px';
        this.selectionCanvas.nativeElement.style.left = parseInt(this.selectionCanvas.nativeElement.style.left) + event.distance.x + 'px';
        event.source._dragRef.reset();
    }

    getTransformValues(element: HTMLElement): Vec2 {
        const style = window.getComputedStyle(element);
        const matrix = new WebKitCSSMatrix(style.transform);
        if (!matrix) {
            return { x: 0, y: 0 };
        }
        return {
            x: matrix.m41,
            y: matrix.m42,
        };
    }

    setResizersPosition(transformValues: Vec2): void {
        const canvasWidth = this.selectionCanvas.nativeElement.width;
        const canvasHeight = this.selectionCanvas.nativeElement.height;
        const newCanvasPosition = {
            x: parseInt(this.selectionCanvas.nativeElement.style.left) + transformValues.x,
            y: parseInt(this.selectionCanvas.nativeElement.style.top) + transformValues.y,
        };
        this.resizerHandlerService.setResizerPosition(newCanvasPosition, canvasWidth, canvasHeight);
    }
}
