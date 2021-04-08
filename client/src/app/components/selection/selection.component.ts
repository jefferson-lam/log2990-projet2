import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { ResizerDown } from '@app/constants/resize-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';

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
    initialPosition: Vec2;
    bottomRight: Vec2;

    // canvasHeightSubscriber: Subscription;
    // canvasWidthSubscriber: Subscription;

    constructor(private drawingService: DrawingService, public resizerHandlerService: ResizerHandlerService) {
        this.initialPosition = { x: 0, y: 0 };
        this.bottomRight = { x: 0, y: 0 };
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

        this.resizerHandlerService.resizers
            .set(ResizerDown.TopLeft, this.topLeftResizer.nativeElement)
            .set(ResizerDown.Left, this.leftResizer.nativeElement)
            .set(ResizerDown.BottomLeft, this.bottomLeftResizer.nativeElement)
            .set(ResizerDown.Bottom, this.bottomResizer.nativeElement)
            .set(ResizerDown.BottomRight, this.bottomRightResizer.nativeElement)
            .set(ResizerDown.Right, this.rightResizer.nativeElement)
            .set(ResizerDown.TopRight, this.topRightResizer.nativeElement)
            .set(ResizerDown.Top, this.topResizer.nativeElement);

        this.resizerHandlerService.assignComponent(this);
    }

    onCanvasMove(didCanvasMove: boolean): void {
        if (didCanvasMove) {
            this.setCanvasPosition();
        }
    }

    setCanvasPosition(): void {
        const transformValues = this.getTransformValues(this.previewSelectionCanvas);
        this.selectionCanvas.style.left = parseInt(this.previewSelectionCanvas.style.left, 10) + transformValues.x + 'px';
        this.selectionCanvas.style.top = parseInt(this.previewSelectionCanvas.style.top, 10) + transformValues.y + 'px';
        this.resizerHandlerService.setResizerPositions(this.selectionCanvas);
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

    drawPreview(event: CdkDragMove): void {
        if (this.resizerHandlerService.inUse) {
            this.resizerHandlerService.resize(event);
            this.resizerHandlerService.setResizerPositions(this.previewSelectionCanvas);
            this.drawWithScalingFactors(this.previewSelectionCtx, this.selectionCanvas);
            this.selectionCanvas.style.visibility = 'hidden';
        }
    }

    resizeSelectionCanvas(event: CdkDragEnd): void {
        if (this.resizerHandlerService.inUse) {
            this.resizerHandlerService.inUse = false;
            event.source._dragRef.reset();
            this.selectionCanvas.style.visibility = 'visible';

            // Save drawing to preview canvas before drawing is wiped due to resizing
            this.drawWithScalingFactors(this.previewSelectionCtx, this.selectionCanvas);

            // Replace base canvas
            this.selectionCanvas.style.top = this.previewSelectionCanvas.style.top;
            this.selectionCanvas.style.left = this.previewSelectionCanvas.style.left;

            // Resize base canvas
            this.selectionCanvas.width = this.previewSelectionCanvas.width;
            this.selectionCanvas.height = this.previewSelectionCanvas.height;

            // Clear the contents of the selectionCtx before redrawing the scaled image
            this.selectionCtx.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);

            // Canvas resize wipes drawing -> copy drawing from preview layer to base layer
            this.selectionCtx.drawImage(this.previewSelectionCanvas, 0, 0);
            this.previewSelectionCtx.clearRect(0, 0, this.previewSelectionCanvas.width, this.previewSelectionCanvas.height);
        }
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
        } else if (leftResizers.includes(this.resizerDown) && parseInt(this.previewSelectionCanvas.style.left, 10) === this.bottomRight.x) {
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
        } else if (topResizers.includes(this.resizerDown) && parseInt(this.previewSelectionCanvas.style.top, 10) === this.bottomRight.y) {
            // tslint:disable-next-line:no-magic-numbers
            return -1;
        }
        return 1;
    }

    setInitialValues(resizer: number): void {
        this.resizerHandlerService.inUse = true;
        this.resizerDown = resizer;
        this.initialPosition = { x: parseInt(this.previewSelectionCanvas.style.left, 10), y: parseInt(this.previewSelectionCanvas.style.top, 10) };
        this.bottomRight = {
            x: this.initialPosition.x + this.previewSelectionCanvas.width,
            y: this.initialPosition.y + this.previewSelectionCanvas.height,
        };
        this.resizerHandlerService.setResizeStrategy(this.resizerDown);
    }

    @HostListener('window:keydown.shift', ['$event'])
    onShiftKeyDown(event: KeyboardEvent): void {
        if (this.resizerHandlerService.inUse) {
            this.resizerHandlerService.resizeSquare();
            this.resizerHandlerService.setResizerPositions(this.previewSelectionCanvas);
            this.drawWithScalingFactors(this.previewSelectionCtx, this.selectionCanvas);
        }
        this.resizerHandlerService.isShiftDown = true;
    }

    @HostListener('window:keyup.shift', ['$event'])
    onShiftKeyUp(event: KeyboardEvent): void {
        if (this.resizerHandlerService.inUse) {
            this.resizerHandlerService.restoreLastDimensions();
            this.resizerHandlerService.setResizerPositions(this.previewSelectionCanvas);
            this.drawWithScalingFactors(this.previewSelectionCtx, this.selectionCanvas);
        }
        this.resizerHandlerService.isShiftDown = false;
    }
}
