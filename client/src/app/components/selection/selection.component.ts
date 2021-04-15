import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { ResizerDown } from '@app/constants/resize-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismService } from '@app/services/magnetism/magnetism.service';
import { ShortcutManagerService } from '@app/services/manager/shortcut-manager.service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';

@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent implements AfterViewInit {
    @ViewChild('selectionCanvas', { static: false }) selectionCanvasRef: ElementRef<HTMLCanvasElement>;
    @ViewChild('borderCanvas', { static: false }) borderCanvasRef: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewSelectionCanvas', { static: false }) previewSelectionCanvasRef: ElementRef<HTMLCanvasElement>;
    @ViewChild('selectionBox', { static: false }) selectionContainer: ElementRef<HTMLCanvasElement>;
    selectionCanvas: HTMLCanvasElement;
    borderCanvas: HTMLCanvasElement;
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

    constructor(
        private magnetismService: MagnetismService,
        private drawingService: DrawingService,
        public resizerHandlerService: ResizerHandlerService,
        public shortcutManager: ShortcutManagerService,
    ) {
        this.initialPosition = { x: 0, y: 0 };
        this.bottomRight = { x: 0, y: 0 };
    }

    ngAfterViewInit(): void {
        this.selectionCanvas = this.selectionCanvasRef.nativeElement;
        this.borderCanvas = this.borderCanvasRef.nativeElement;
        this.previewSelectionCanvas = this.previewSelectionCanvasRef.nativeElement;

        this.selectionCtx = this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.previewSelectionCtx = this.previewSelectionCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.selectionCtx = this.selectionCtx;
        this.drawingService.previewSelectionCtx = this.previewSelectionCtx;
        this.drawingService.selectionCanvas = this.selectionCanvasRef.nativeElement;
        this.drawingService.previewSelectionCanvas = this.previewSelectionCanvasRef.nativeElement;
        this.drawingService.borderCanvas = this.borderCanvas;

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

        this.drawingService.canvasSizeSubject.asObservable().subscribe((size) => {
            this.resizeContainer(size[0], size[1]);
        });

        this.magnetismService.previewSelectionCanvas = this.previewSelectionCanvas;
    }

    resizeContainer(width: number, height: number): void {
        this.selectionContainer.nativeElement.style.width = width + 'px';
        this.selectionContainer.nativeElement.style.height = height + 'px';
    }

    onCanvasMove(didCanvasMove: boolean): void {
        if (didCanvasMove) {
            this.setCanvasPosition();
        }
    }

    setCanvasPosition(): void {
        const transformValues = this.getTransformValues(this.previewSelectionCanvas);
        this.magnetismService.transformValues = transformValues;
        if (this.magnetismService.isMagnetismOn) {
            const magnetizedCoords: Vec2 = this.magnetismService.magnetizeSelection();
            this.selectionCanvas.style.left = magnetizedCoords.x + 'px';
            this.selectionCanvas.style.top = magnetizedCoords.y + 'px';
        } else {
            this.selectionCanvas.style.left = parseInt(this.previewSelectionCanvas.style.left, 10) + transformValues.x + 'px';
            this.selectionCanvas.style.top = parseInt(this.previewSelectionCanvas.style.top, 10) + transformValues.y + 'px';
        }
        this.resizerHandlerService.setResizerPositions(this.selectionCanvas);
        this.borderCanvas.style.left = this.selectionCanvas.style.left;
        this.borderCanvas.style.top = this.selectionCanvas.style.top;
    }

    resetPreviewSelectionCanvas(event: CdkDragEnd): void {
        this.previewSelectionCanvas.style.left = this.borderCanvas.style.left = this.selectionCanvas.style.left;
        this.previewSelectionCanvas.style.top = this.borderCanvas.style.top = this.selectionCanvas.style.top;
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

            // Replace border canvas
            this.borderCanvas.style.left = this.selectionCanvas.style.left;
            this.borderCanvas.style.top = this.selectionCanvas.style.top;

            // Resize base canvas
            this.selectionCanvas.width = this.previewSelectionCanvas.width;
            this.selectionCanvas.height = this.previewSelectionCanvas.height;

            // Resize border canvas
            this.borderCanvas.width = this.previewSelectionCanvas.width;
            this.borderCanvas.height = this.previewSelectionCanvas.height;

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

    applyFocusBorderStyle(): void {
        this.borderCanvas.style.border = '1px solid black';
    }

    applyFocusOutBorderStyle(): void {
        this.borderCanvas.style.border = '1px dashed black';
    }
    @HostListener('window:keydown.shift')
    onShiftKeyDown(): void {
        this.shortcutManager.selectionOnShiftKeyDown(this);
    }

    @HostListener('window:keyup.shift', ['$event'])
    onShiftKeyUp(): void {
        this.shortcutManager.selectionOnShiftKeyUp(this);
    }

    @HostListener('keyup.ArrowLeft', ['$event'])
    @HostListener('keyup.ArrowDown', ['$event'])
    @HostListener('keyup.ArrowRight', ['$event'])
    @HostListener('keyup.ArrowUp', ['$event'])
    correctPreviewCanvasPosition(): void {
        this.previewSelectionCanvas.style.left = this.borderCanvas.style.left = this.selectionCanvas.style.left;
        this.previewSelectionCanvas.style.top = this.borderCanvas.style.top = this.selectionCanvas.style.top;
    }
}
