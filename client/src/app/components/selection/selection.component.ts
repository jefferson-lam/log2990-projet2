import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { Vec2 } from '@app/classes/vec2';
import { ResizerDown } from '@app/constants/resize-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeBottom } from '@app/services/resizer/resize-strategy/resize-bottom';
import { ResizeBottomLeft } from '@app/services/resizer/resize-strategy/resize-bottom-left';
import { ResizeBottomRight } from '@app/services/resizer/resize-strategy/resize-bottom-right';
import { ResizeLeft } from '@app/services/resizer/resize-strategy/resize-left';
import { ResizeRight } from '@app/services/resizer/resize-strategy/resize-right';
import { ResizeTop } from '@app/services/resizer/resize-strategy/resize-top';
import { ResizeTopLeft } from '@app/services/resizer/resize-strategy/resize-top-left';
import { ResizeTopRight } from '@app/services/resizer/resize-strategy/resize-top-right';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';

@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent implements AfterViewInit {
    @ViewChild('selectionCanvas', { static: false }) selectionCanvasRef: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewSelectionCanvas', { static: false }) previewSelectionCanvasRef: ElementRef<HTMLCanvasElement>;
    @ViewChild('selectionBox', { static: false }) selectionContainer: ElementRef<HTMLCanvasElement>;
    selectionCanvas: HTMLCanvasElement;
    previewSelectionCanvas: HTMLCanvasElement;

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

    resizerDown: ResizerDown;
    resizeStrategy: ResizeStrategy;
    resizerStrategies: Map<number, ResizeStrategy>;
    initialPosition: Vec2;
    initialSize: {
        width: number;
        height: number;
    };

    // canvasHeightSubscriber: Subscription;
    // canvasWidthSubscriber: Subscription;

    constructor(private drawingService: DrawingService, public resizerHandlerService: ResizerHandlerService) {
        this.resizerStrategies = new Map<number, ResizeStrategy>();
        this.resizerStrategies
            .set(ResizerDown.TopLeft, new ResizeTopLeft())
            .set(ResizerDown.Left, new ResizeLeft())
            .set(ResizerDown.BottomLeft, new ResizeBottomLeft())
            .set(ResizerDown.Bottom, new ResizeBottom())
            .set(ResizerDown.BottomRight, new ResizeBottomRight())
            .set(ResizerDown.Right, new ResizeRight())
            .set(ResizerDown.TopRight, new ResizeTopRight())
            .set(ResizerDown.Top, new ResizeTop());
    }

    ngAfterViewInit(): void {
        this.selectionCanvas = this.selectionCanvasRef.nativeElement;
        this.previewSelectionCanvas = this.previewSelectionCanvasRef.nativeElement;
        this.selectionCtx = this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.previewSelectionCtx = this.previewSelectionCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.canvasHeightObservable.asObservable().subscribe((height) => {
            this.selectionContainer.nativeElement.style.height = height + 'px';
        });
        this.drawingService.canvasWidthObservable.asObservable().subscribe((width) => {
            this.selectionContainer.nativeElement.style.width = width + 'px';
        });
        this.drawingService.selectionCtx = this.selectionCtx;
        this.drawingService.previewSelectionCtx = this.previewSelectionCtx;
        this.drawingService.selectionCanvas = this.selectionCanvas;
        this.drawingService.previewSelectionCanvas = this.previewSelectionCanvas;

        this.resizerHandlerService.leftResizer = this.leftResizer.nativeElement;
        this.resizerHandlerService.rightResizer = this.rightResizer.nativeElement;
        this.resizerHandlerService.bottomResizer = this.bottomResizer.nativeElement;
        this.resizerHandlerService.topResizer = this.topResizer.nativeElement;
        this.resizerHandlerService.topLeftResizer = this.topLeftResizer.nativeElement;
        this.resizerHandlerService.topRightResizer = this.topRightResizer.nativeElement;
        this.resizerHandlerService.bottomLeftResizer = this.bottomLeftResizer.nativeElement;
        this.resizerHandlerService.bottomRightResizer = this.bottomRightResizer.nativeElement;
    }

    onCanvasMove(didCanvasMove: boolean): void {
        if (didCanvasMove) {
            this.setSelectionCanvasPosition();
        }
    }

    resetPreviewSelectionCanvas(event: CdkDragEnd): void {
        this.previewSelectionCanvas.style.left = this.selectionCanvas.style.left;
        this.previewSelectionCanvas.style.top = this.selectionCanvas.style.top;
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

    setSelectionCanvasPosition(): void {
        const transformValues = this.getTransformValues(this.previewSelectionCanvas);
        this.selectionCanvas.style.left = parseInt(this.previewSelectionCanvas.style.left, 10) + transformValues.x + 'px';
        this.selectionCanvas.style.top = parseInt(this.previewSelectionCanvas.style.top, 10) + transformValues.y + 'px';
        this.resizerHandlerService.setResizerPosition(this.selectionCanvas);
    }

    setResizerPositions(): void {
        this.resizerHandlerService.setResizerPosition(this.previewSelectionCanvas);

        this.resizerHandlerService.topLeftResizer.style.transform = '';
        this.resizerHandlerService.leftResizer.style.transform = '';
        this.resizerHandlerService.bottomLeftResizer.style.transform = '';
        this.resizerHandlerService.bottomResizer.style.transform = '';
        this.resizerHandlerService.bottomRightResizer.style.transform = '';
        this.resizerHandlerService.rightResizer.style.transform = '';
        this.resizerHandlerService.topRightResizer.style.transform = '';
        this.resizerHandlerService.topResizer.style.transform = '';
    }

    setResizeStrategy(resizer: ResizerDown): void {
        this.resizeStrategy = this.resizerStrategies.get(resizer) as ResizeStrategy;
    }

    drawPreview(event: CdkDragMove): void {
        this.resizeStrategy.resize(this, event);
        this.setResizerPositions();
        this.drawWithScalingFactors(this.previewSelectionCtx, this.selectionCanvas);
        this.selectionCanvas.style.visibility = 'hidden';
    }

    resizeSelectionCanvas(): void {
        this.selectionCanvas.style.visibility = 'visible';

        // Save drawing to preview canvas before drawing is wiped due to resizing
        this.drawWithScalingFactors(this.previewSelectionCtx, this.selectionCanvas);

        // Replace base canvas
        this.selectionCanvas.style.top = this.previewSelectionCanvas.style.top;
        this.selectionCanvas.style.left = this.previewSelectionCanvas.style.left;

        // Resize base canvas
        this.selectionCanvas.width = this.previewSelectionCanvas.width;
        this.selectionCanvas.height = this.previewSelectionCanvas.height;

        this.selectionCtx.fillStyle = 'white';
        this.selectionCtx.fillRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);

        // Canvas resize wipes drawing -> copy drawing from preview layer to base layer
        this.selectionCtx.drawImage(this.previewSelectionCanvas, 0, 0);
    }

    drawWithScalingFactors(targetContext: CanvasRenderingContext2D, sourceCanvas: HTMLCanvasElement): void {
        const scalingFactors = this.getScalingFactors();
        targetContext.scale(scalingFactors[0], scalingFactors[1]);
        targetContext.drawImage(sourceCanvas, 0, 0, scalingFactors[0] * targetContext.canvas.width, scalingFactors[1] * targetContext.canvas.height);
    }

    getScalingFactors(): number[] {
        const scalingFactors = [1, 1];
        scalingFactors[0] = this.getWidthScalingFactor();
        scalingFactors[1] = this.getHeightScalingFactor();
        return scalingFactors;
    }

    getWidthScalingFactor(): number {
        const leftResizers = [ResizerDown.Left, ResizerDown.TopLeft, ResizerDown.BottomLeft];
        const rightResizers = [ResizerDown.Right, ResizerDown.TopRight, ResizerDown.BottomRight];
        if (rightResizers.includes(this.resizerDown) && parseInt(this.previewSelectionCanvas.style.left, 10) !== this.initialPosition.x) {
            // tslint:disable-next-line:no-magic-numbers
            return -1;
        } else if (
            leftResizers.includes(this.resizerDown) &&
            parseInt(this.previewSelectionCanvas.style.left, 10) === this.initialPosition.x + this.initialSize.width
        ) {
            // tslint:disable-next-line:no-magic-numbers
            return -1;
        }
        return 1;
    }

    getHeightScalingFactor(): number {
        const topResizers = [ResizerDown.Top, ResizerDown.TopLeft, ResizerDown.TopRight];
        const bottomResizers = [ResizerDown.Bottom, ResizerDown.BottomLeft, ResizerDown.BottomRight];
        if (bottomResizers.includes(this.resizerDown) && parseInt(this.previewSelectionCanvas.style.top, 10) !== this.initialPosition.y) {
            // tslint:disable-next-line:no-magic-numbers
            return -1;
        } else if (
            topResizers.includes(this.resizerDown) &&
            parseInt(this.previewSelectionCanvas.style.top, 10) === this.initialPosition.y + this.initialSize.height
        ) {
            // tslint:disable-next-line:no-magic-numbers
            return -1;
        }
        return 1;
    }

    setInitialValues(resizer: number): void {
        this.resizerDown = resizer;
        this.initialPosition = { x: parseInt(this.previewSelectionCanvas.style.left, 10), y: parseInt(this.previewSelectionCanvas.style.top, 10) };
        this.initialSize = { width: this.previewSelectionCanvas.width, height: this.previewSelectionCanvas.height };
        this.setResizeStrategy(this.resizerDown);
    }
}
