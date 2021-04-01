import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { ResizerDown } from '@app/constants/resize-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
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
    initialResizer: ResizerDown;

    // canvasHeightSubscriber: Subscription;
    // canvasWidthSubscriber: Subscription;

    constructor(private drawingService: DrawingService, public resizerHandlerService: ResizerHandlerService) {}

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

    // TODO : find elegant way to get rid of switch case??
    setResizePreviewSelection(event: CdkDragMove): void {
        const relativeX = event.pointerPosition.x - CanvasConstants.LEFT_MARGIN - parseInt(this.previewSelectionCanvas.style.left, 10);
        const relativeY = event.pointerPosition.y - parseInt(this.previewSelectionCanvas.style.top, 10);
        switch (this.resizerDown) {
            case ResizerDown.TopLeft:
                this.setResizeTopLeft(event, relativeX, relativeY);
                break;
            case ResizerDown.Left:
                this.setResizeLeft(event, relativeX);
                break;
            case ResizerDown.BottomLeft:
                this.setResizeBottomLeft(event, relativeX, relativeY);
                break;
            case ResizerDown.Bottom:
                this.setResizeBottom(event, relativeY);
                break;
            case ResizerDown.BottomRight:
                this.setResizeBottomRight(event, relativeX, relativeY);
                break;
            case ResizerDown.Right:
                this.setResizeRight(event, relativeX);
                break;
            case ResizerDown.TopRight:
                this.setResizeTopRight(event, relativeX, relativeY);
                break;
            case ResizerDown.Top:
                this.setResizeTop(event, relativeY);
                break;
            default:
                break;
        }
        this.setResizerPositions();
    }

    // TODO for all the setResizeX functions : find elegant way to get rid of ifs??
    setResizeTopLeft(event: CdkDragMove, relativeX: number, relativeY: number): void {
        const newWidth = this.previewSelectionCanvas.width - relativeX;
        const newHeight = this.previewSelectionCanvas.height - relativeY;
        if (newWidth >= 0 && newHeight >= 0) {
            this.previewSelectionCanvas.width = newWidth;
            this.previewSelectionCanvas.height = newHeight;
            this.previewSelectionCanvas.style.top = event.pointerPosition.y + 'px';
            this.previewSelectionCanvas.style.left = event.pointerPosition.x - CanvasConstants.LEFT_MARGIN + 'px';
        } else if (newWidth < 0 && newHeight >= 0) {
            this.resizerDown = ResizerDown.TopRight;
            this.previewSelectionCanvas.width = -newWidth;
            this.previewSelectionCanvas.style.left = event.pointerPosition.x - this.previewSelectionCanvas.width - CanvasConstants.LEFT_MARGIN + 'px';
        } else if (newWidth >= 0 && newHeight < 0) {
            this.resizerDown = ResizerDown.BottomLeft;
            this.previewSelectionCanvas.height = relativeY - this.previewSelectionCanvas.height;
            this.previewSelectionCanvas.style.top = event.pointerPosition.y - this.previewSelectionCanvas.height + 'px';
        } else {
            this.resizerDown = ResizerDown.BottomRight;
            this.previewSelectionCanvas.width = -newWidth;
            this.previewSelectionCanvas.style.left = event.pointerPosition.x - this.previewSelectionCanvas.width - CanvasConstants.LEFT_MARGIN + 'px';
            this.previewSelectionCanvas.height = relativeY - this.previewSelectionCanvas.height;
            this.previewSelectionCanvas.style.top = event.pointerPosition.y - this.previewSelectionCanvas.height + 'px';
        }
    }

    setResizeBottomLeft(event: CdkDragMove, relativeX: number, relativeY: number): void {
        const newWidth = this.previewSelectionCanvas.width - relativeX;
        if (newWidth >= 0 && relativeY >= 0) {
            this.previewSelectionCanvas.width = newWidth;
            this.previewSelectionCanvas.height = relativeY;
            this.previewSelectionCanvas.style.left = event.pointerPosition.x - CanvasConstants.LEFT_MARGIN + 'px';
        } else if (newWidth < 0 && relativeY >= 0) {
            this.resizerDown = ResizerDown.BottomRight;
            this.previewSelectionCanvas.width = -newWidth;
            this.previewSelectionCanvas.style.left = event.pointerPosition.x - this.previewSelectionCanvas.width - CanvasConstants.LEFT_MARGIN + 'px';
        } else if (newWidth >= 0 && relativeY < 0) {
            this.resizerDown = ResizerDown.TopLeft;
            this.previewSelectionCanvas.height = -relativeY;
            this.previewSelectionCanvas.style.top = event.pointerPosition.y + 'px';
        } else {
            this.resizerDown = ResizerDown.TopRight;
            this.previewSelectionCanvas.width = -newWidth;
            this.previewSelectionCanvas.style.left = event.pointerPosition.x - this.previewSelectionCanvas.width - CanvasConstants.LEFT_MARGIN + 'px';
            this.previewSelectionCanvas.height = -relativeY;
            this.previewSelectionCanvas.style.top = event.pointerPosition.y + 'px';
        }
    }

    setResizeTopRight(event: CdkDragMove, relativeX: number, relativeY: number): void {
        const newWidth = relativeX;
        const newHeight = this.previewSelectionCanvas.height - relativeY;
        if (newWidth >= 0 && newHeight >= 0) {
            this.previewSelectionCanvas.height = newHeight;
            this.previewSelectionCanvas.width = newWidth;
            this.previewSelectionCanvas.style.top = event.pointerPosition.y + 'px';
        } else if (newWidth < 0 && newHeight >= 0) {
            this.resizerDown = ResizerDown.TopLeft;
            this.previewSelectionCanvas.width = -relativeX;
            this.previewSelectionCanvas.style.left = parseInt(this.previewSelectionCanvas.style.left, 10) - this.previewSelectionCanvas.width + 'px';
        } else if (newWidth >= 0 && newHeight < 0) {
            this.resizerDown = ResizerDown.BottomRight;
            this.previewSelectionCanvas.height = relativeY - this.previewSelectionCanvas.height;
            this.previewSelectionCanvas.style.top = event.pointerPosition.y - this.previewSelectionCanvas.height + 'px';
        } else {
            this.previewSelectionCanvas.style.top = parseInt(this.previewSelectionCanvas.style.top, 10) + this.previewSelectionCanvas.height + 'px';
            this.resizerDown = ResizerDown.BottomLeft;
            this.previewSelectionCanvas.width = -relativeX;
            this.previewSelectionCanvas.style.left = parseInt(this.previewSelectionCanvas.style.left, 10) - this.previewSelectionCanvas.width + 'px';
            this.previewSelectionCanvas.height = relativeY - this.previewSelectionCanvas.height;
            this.previewSelectionCanvas.style.top = event.pointerPosition.y - this.previewSelectionCanvas.height + 'px';
        }
    }

    setResizeBottomRight(event: CdkDragMove, relativeX: number, relativeY: number): void {
        if (relativeX >= 0 && relativeY >= 0) {
            this.previewSelectionCanvas.width = relativeX;
            this.previewSelectionCanvas.height = relativeY;
        } else if (relativeX < 0 && relativeY >= 0) {
            this.resizerDown = ResizerDown.BottomLeft;
            this.previewSelectionCanvas.width = -relativeX;
            this.previewSelectionCanvas.style.left = parseInt(this.previewSelectionCanvas.style.left, 10) - this.previewSelectionCanvas.width + 'px';
        } else if (relativeX >= 0 && relativeY < 0) {
            this.resizerDown = ResizerDown.TopRight;
            this.previewSelectionCanvas.height = -relativeY;
            this.previewSelectionCanvas.style.top = event.pointerPosition.y + 'px';
        } else {
            this.resizerDown = ResizerDown.TopLeft;
            this.previewSelectionCanvas.width = -relativeX;
            this.previewSelectionCanvas.style.left = parseInt(this.previewSelectionCanvas.style.left, 10) - this.previewSelectionCanvas.width + 'px';
            this.previewSelectionCanvas.height = -relativeY;
            this.previewSelectionCanvas.style.top = event.pointerPosition.y + 'px';
        }
    }

    setResizeLeft(event: CdkDragMove, relativeX: number): void {
        const newWidth = this.previewSelectionCanvas.width - relativeX;
        if (newWidth >= 0) {
            this.previewSelectionCanvas.width = newWidth;
            this.previewSelectionCanvas.style.left = event.pointerPosition.x - CanvasConstants.LEFT_MARGIN + 'px';
        } else {
            this.resizerDown = ResizerDown.Right;
            this.previewSelectionCanvas.width = -newWidth;
            this.previewSelectionCanvas.style.left = event.pointerPosition.x - this.previewSelectionCanvas.width - CanvasConstants.LEFT_MARGIN + 'px';
        }
    }

    setResizeRight(event: CdkDragMove, relativeX: number): void {
        if (relativeX >= 0) {
            this.previewSelectionCanvas.width = relativeX;
        } else {
            this.resizerDown = ResizerDown.Left;
            this.previewSelectionCanvas.width = -relativeX;
            this.previewSelectionCanvas.style.left = parseInt(this.previewSelectionCanvas.style.left, 10) - this.previewSelectionCanvas.width + 'px';
        }
    }

    setResizeBottom(event: CdkDragMove, relativeY: number): void {
        if (relativeY >= 0) {
            this.previewSelectionCanvas.height = relativeY;
        } else {
            this.resizerDown = ResizerDown.Top;
            this.previewSelectionCanvas.height = -relativeY;
            this.previewSelectionCanvas.style.top = event.pointerPosition.y + 'px';
        }
    }

    setResizeTop(event: CdkDragMove, relativeY: number): void {
        const newHeight = this.previewSelectionCanvas.height - relativeY;
        if (newHeight >= 0) {
            this.previewSelectionCanvas.height = newHeight;
            this.previewSelectionCanvas.style.top = event.pointerPosition.y + 'px';
        } else {
            this.resizerDown = ResizerDown.Bottom;
            this.previewSelectionCanvas.height = relativeY - this.previewSelectionCanvas.height;
            this.previewSelectionCanvas.style.top = event.pointerPosition.y - this.previewSelectionCanvas.height + 'px';
        }
    }

    resizeSelectionCanvas(): void {
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
        // Resizing on the left but started right
        if (leftResizers.includes(this.resizerDown) && rightResizers.includes(this.initialResizer)) {
            // tslint:disable-next-line:no-magic-numbers
            return -1;
            // Resizing on the right but started left
        } else if (rightResizers.includes(this.resizerDown) && leftResizers.includes(this.initialResizer)) {
            // tslint:disable-next-line:no-magic-numbers
            return -1;
        }
        return 1;
    }

    getHeightScalingFactor(): number {
        const topResizers = [ResizerDown.Top, ResizerDown.TopLeft, ResizerDown.TopRight];
        const bottomResizers = [ResizerDown.Bottom, ResizerDown.BottomLeft, ResizerDown.BottomRight];
        // Resizing on the top but started bottom
        if (topResizers.includes(this.resizerDown) && bottomResizers.includes(this.initialResizer)) {
            // tslint:disable-next-line:no-magic-numbers
            return -1;
            // Resizing on the bottom but started top
        } else if (bottomResizers.includes(this.resizerDown) && topResizers.includes(this.initialResizer)) {
            // tslint:disable-next-line:no-magic-numbers
            return -1;
        }
        return 1;
    }

    setResizerUsed(resizer: number): void {
        this.resizerDown = resizer;
        this.initialResizer = resizer;
    }
}
