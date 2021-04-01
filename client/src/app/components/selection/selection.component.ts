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
            this.repositionResizers({} as CdkDragMove);
        }
    }

    repositionResizers(event: CdkDragMove): void {
        const transformValues: Vec2 = this.getTransformValues(this.selectionCanvas);
        this.setResizerPosition(transformValues, this.selectionCanvas, this.previewSelectionCanvas);
    }

    repositionPreviewResizers(event: CdkDragMove): void {
        const transformValues: Vec2 = this.getTransformValues(this.previewSelectionCanvas);
        this.setResizerPosition(transformValues, this.previewSelectionCanvas, this.selectionCanvas);
    }

    setSelectionCanvasPosition(event: CdkDragEnd): void {
        const newTopPosition = parseInt(this.selectionCanvas.style.top, 10) + event.distance.y;
        const newLeftPosition = parseInt(this.selectionCanvas.style.left, 10) + event.distance.x;
        this.selectionCanvas.style.top = newTopPosition + 'px';
        this.selectionCanvas.style.left = newLeftPosition + 'px';
        this.previewSelectionCanvas.style.top = newTopPosition + 'px';
        this.previewSelectionCanvas.style.left = newLeftPosition + 'px';
        event.source._dragRef.reset();
    }

    setPreviewSelectionCanvasPosition(event: CdkDragEnd): void {
        const newTopPosition = parseInt(this.previewSelectionCanvas.style.top, 10) + event.distance.y;
        const newLeftPosition = parseInt(this.previewSelectionCanvas.style.left, 10) + event.distance.x;
        this.selectionCanvas.style.top = newTopPosition + 'px';
        this.selectionCanvas.style.left = newLeftPosition + 'px';
        this.previewSelectionCanvas.style.top = newTopPosition + 'px';
        this.previewSelectionCanvas.style.left = newLeftPosition + 'px';
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
        this.resizePreviewSelection();
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

    // TODO : rename to something like setResizerPosition
    // Another function already called this, should rename both for ambiguity reasons
    resizePreviewSelection(): void {
        const newCanvasPosition = {
            x: parseInt(this.previewSelectionCanvas.style.left, 10),
            y: parseInt(this.previewSelectionCanvas.style.top, 10),
        };
        this.resizerHandlerService.setResizerPosition(newCanvasPosition, this.previewSelectionCanvas.width, this.previewSelectionCanvas.height);

        this.resizerHandlerService.topLeftResizer.style.transform = '';
        this.resizerHandlerService.leftResizer.style.transform = '';
        this.resizerHandlerService.bottomLeftResizer.style.transform = '';
        this.resizerHandlerService.bottomResizer.style.transform = '';
        this.resizerHandlerService.bottomRightResizer.style.transform = '';
        this.resizerHandlerService.rightResizer.style.transform = '';
        this.resizerHandlerService.topRightResizer.style.transform = '';
        this.resizerHandlerService.topResizer.style.transform = '';
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
        // this.drawWithScalingFactors(scalingFactors,this.previewSelectionCtx,this.selectionCanvas);
        this.selectionCtx.drawImage(this.previewSelectionCanvas, 0, 0);
    }

    drawWithScalingFactors(targetContext: CanvasRenderingContext2D, sourceCanvas: HTMLCanvasElement): void {
        const scalingFactors = this.getScalingFactors();
        targetContext.scale(scalingFactors[0], scalingFactors[1]);
        targetContext.drawImage(sourceCanvas, 0, 0, scalingFactors[0] * targetContext.canvas.width, scalingFactors[1] * targetContext.canvas.height);
    }

    // TODO : find elegant way to get rid of ifs??
    getScalingFactors(): number[] {
        const scalingFactors = [1, 1];
        // Resizing on the left but started right
        if (this.resizerDown >= 0 && this.resizerDown <= 2) {
            if (this.initialResizer >= 4 && this.initialResizer <= 6) {
                scalingFactors[0] = -1;
            }
            // Resizing on the right but started left
        } else if (this.resizerDown >= 4 && this.resizerDown <= 6) {
            if (this.initialResizer >= 0 && this.initialResizer <= 2) {
                scalingFactors[0] = -1;
            }
        }
        // Resizing on the top but started bottom
        if (this.resizerDown === 0 || (this.resizerDown >= 6 && this.resizerDown <= 7)) {
            if (this.initialResizer >= 2 && this.initialResizer <= 4) {
                scalingFactors[1] = -1;
            }
            // Resizing on the bottom but started top
        } else if (this.resizerDown >= 2 && this.resizerDown <= 4) {
            if (this.initialResizer === 0 || (this.initialResizer >= 6 && this.initialResizer <= 7)) {
                scalingFactors[1] = -1;
            }
        }
        return scalingFactors;
    }

    setResizerUsed(order: number): void {
        this.initialResizer = order;
    }

    onTopLeftResizerDown(): void {
        this.resizerDown = ResizerDown.TopLeft;
    }

    onLeftResizerDown(): void {
        this.resizerDown = ResizerDown.Left;
    }

    onBottomLeftResizerDown(): void {
        this.resizerDown = ResizerDown.BottomLeft;
    }

    onBottomResizerDown(): void {
        this.resizerDown = ResizerDown.Bottom;
    }

    onBottomRightResizerDown(): void {
        this.resizerDown = ResizerDown.BottomRight;
    }

    onRightResizerDown(): void {
        this.resizerDown = ResizerDown.Right;
    }

    onTopRightResizerDown(): void {
        this.resizerDown = ResizerDown.TopRight;
    }

    onTopResizerDown(): void {
        this.resizerDown = ResizerDown.Top;
    }
}
