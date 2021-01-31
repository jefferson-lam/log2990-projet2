import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { Subscription } from 'rxjs';

// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private cursor: HTMLElement;
    @ViewChild('cursor', { static: false }) cursorDiv: ElementRef;
    @ViewChild('canvasContainer', { static: false }) parentDiv: ElementRef;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : Avoir un service dédié pour gérer tous les outils ? Ceci peut devenir lourd avec le temps
    private tools: Tool[];
    currentTool: Tool;
    eraserSizeSubscription: Subscription;
    constructor(private drawingService: DrawingService, pencilService: PencilService, eraserService: EraserService) {
        this.tools = [pencilService, eraserService];
        this.currentTool = this.tools[0];
        this.eraserSizeSubscription = eraserService.eraserSizeChanged$.subscribe((newSize) => {
            this.cursor.style.height = newSize + 'px';
            this.cursor.style.width = newSize + 'px';
        });
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;

        this.cursor = this.cursorDiv.nativeElement;
    }

    @HostListener('keydown.c', ['$event'])
    onKeyC(event: KeyboardEvent): void {
        this.currentTool = this.tools[0];
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.baseCtx.strokeStyle = 'black';
    }

    @HostListener('keydown.e', ['$event'])
    onKeyE(event: KeyboardEvent): void {
        this.currentTool = this.tools[1];
        this.drawingService.previewCtx.strokeStyle = 'white';
        this.drawingService.baseCtx.strokeStyle = 'white';
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.cursor.style.visibility = 'hidden';
        this.currentTool.onMouseMove(event);
        if (this.currentTool === this.tools[1]) {
            this.cursor.style.visibility = 'visible';
            this.cursor.style.top = event.pageY - this.parentDiv.nativeElement.offsetTop - parseInt(this.cursor.style.height, 10) / 2 + 'px';
            this.cursor.style.left = event.pageX - this.parentDiv.nativeElement.offsetLeft - parseInt(this.cursor.style.width, 10) / 2 + 'px';
        }
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
