import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, OnChanges {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: CanvasConstants.DEFAULT_WIDTH, y: CanvasConstants.DEFAULT_HEIGHT };
    private previewCanvasSize: Vec2 = { x: CanvasConstants.DEFAULT_WIDTH, y: CanvasConstants.DEFAULT_HEIGHT };

    @Input() currentTool: Tool;
    constructor(private drawingService: DrawingService, public toolManager: ToolManagerService) {
        this.currentTool = toolManager.pencilService; // default value
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.drawingService.canvas.width = CanvasConstants.DEFAULT_WIDTH;
        this.drawingService.canvas.height = CanvasConstants.DEFAULT_HEIGHT;
        this.drawingService.previewCtx.canvas.width = CanvasConstants.DEFAULT_WIDTH;
        this.drawingService.previewCtx.canvas.height = CanvasConstants.DEFAULT_HEIGHT;

        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.baseCtx.canvas.width, this.baseCtx.canvas.height);
        console.log('ngAfterViewInit of drawing component called');
    }

    ngOnChanges(changes: SimpleChanges): void {
        const newTool = changes.currentTool.currentValue;
        const canvasStyle = (document.getElementById('previewLayer') as HTMLCanvasElement).style;
        if (newTool === this.toolManager.pencilService) {
            canvasStyle.cursor = 'url(assets/pencil.png) 0 15, auto';
        } else if (newTool === this.toolManager.eraserService) {
            canvasStyle.cursor = 'none';
        } else {
            canvasStyle.cursor = 'crosshair';
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

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: MouseEvent): void {
        event.preventDefault();
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
