import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer-service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, OnChanges {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    @ViewChild('sideResizer', { static: false }) sideResizer: ElementRef<HTMLElement>;
    @ViewChild('cornerResizer', { static: false }) cornerResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomResizer', { static: false }) bottomResizer: ElementRef<HTMLElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private previewCanvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    @Input() currentTool: Tool;
    constructor(private drawingService: DrawingService, public toolManager: ToolManagerService, public canvasResizerService: CanvasResizerService) {
        this.currentTool = toolManager.pencilService; // default value
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;

        this.sideResizer.nativeElement.style.left = this.canvasSize.x + 'px';
        this.sideResizer.nativeElement.style.top = this.canvasSize.y / 2 + 'px';
        this.cornerResizer.nativeElement.style.left = this.canvasSize.x + 'px';
        this.cornerResizer.nativeElement.style.top = this.canvasSize.y + 'px';
        this.bottomResizer.nativeElement.style.left = this.canvasSize.x / 2 + 'px';
        this.bottomResizer.nativeElement.style.top = this.canvasSize.y + 'px';

        this.canvasResizerService.baseCanvas = this.baseCanvas;
        this.canvasResizerService.previewCanvas = this.previewCanvas;
        this.canvasResizerService.baseCtx = this.baseCtx;
        this.canvasResizerService.previewCtx = this.previewCtx;
        this.canvasResizerService.canvasSize = this.canvasSize;
        this.canvasResizerService.previewCanvasSize = this.previewCanvasSize;

        this.canvasResizerService.sideResizer = this.sideResizer;
        this.canvasResizerService.cornerResizer = this.cornerResizer;
        this.canvasResizerService.bottomResizer = this.bottomResizer;
    }

    ngOnChanges(changes: SimpleChanges): void {
        const newTool = changes.currentTool.currentValue;
        const canvasStyle = document.getElementsByTagName('canvas')[1].style;
        if (newTool === this.toolManager.pencilService) {
            canvasStyle.cursor = 'url(assets/pencil-icon.png) 0 15, auto';
        } else if (newTool === this.toolManager.eraserService) {
            canvasStyle.cursor = 'none';
        } else {
            canvasStyle.setProperty('cursor', 'crosshair');
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyboardDown(event: KeyboardEvent): void {
        this.currentTool.onKeyboardDown(event);
    }

    @HostListener('keyup', ['$event'])
    onKeyboardUp(event: KeyboardEvent): void {
        this.currentTool.onKeyboardUp(event);
    }

    @HostListener('keypress', ['$event'])
    onKeyboardPress(event: KeyboardEvent): void {
        this.currentTool.onKeyboardPress(event);
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent): void {
        this.currentTool.onMouseClick(event);
    }

    @HostListener('dblclick', ['$event'])
    onMouseDoubleClick(event: MouseEvent): void {
        this.currentTool.onMouseDoubleClick(event);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.currentTool.onMouseLeave(event);
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.currentTool.onMouseEnter(event);
    }

    get baseWidth(): number {
        return this.canvasSize.x;
    }

    get baseHeight(): number {
        return this.canvasSize.y;
    }

    get previewWidth(): number {
        return this.previewCanvasSize.x;
    }

    get previewHeight(): number {
        return this.previewCanvasSize.y;
    }
}
