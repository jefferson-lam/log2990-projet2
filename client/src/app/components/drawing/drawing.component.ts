import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CursorManagerService } from '@app/services/manager/cursor-manager.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, OnDestroy {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('gridCanvas', { static: false }) gridCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private gridCtx: CanvasRenderingContext2D;
    private defaultSize: Vec2;

    @Input() currentTool: Tool;

    constructor(
        private drawingService: DrawingService,
        private autoSaveService: AutoSaveService,
        public toolManager: ToolManagerService,
        public canvasGridService: CanvasGridService,
        private undoRedoService: UndoRedoService,
        public cursorManager: CursorManagerService,
    ) {
        this.currentTool = toolManager.pencilService; // default value
        this.defaultSize = { x: CanvasConstants.DEFAULT_WIDTH, y: CanvasConstants.DEFAULT_HEIGHT };
    }

    ngAfterViewInit(): void {
        this.assignContextValues();
        this.propagateValuesToDrawingService();
        this.canvasGridService.gridCtx = this.gridCtx;

        this.autoSaveService.loadDrawing();

        this.resizeGridCanvasOnSizeChange();
        this.changeCursorOnToolChange();
    }

    ngOnDestroy(): void {
        this.drawingService.imageURL = '';
    }

    @HostListener('keydown', ['$event'])
    onKeyboardDown(event: KeyboardEvent): void {
        this.currentTool.onKeyboardDown(event);
    }

    @HostListener('keyup', ['$event'])
    onKeyboardUp(event: KeyboardEvent): void {
        this.currentTool.onKeyboardUp(event);
    }

    @HostListener('dblclick', ['$event'])
    onMouseDoubleClick(event: MouseEvent): void {
        this.currentTool.onMouseDoubleClick(event);
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
        this.cursorManager.onMouseMove(this.currentTool.getPositionFromMouse(event));
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
        this.undoRedoService.updateActionsAllowed(!this.currentTool.inUse);
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
        this.undoRedoService.updateActionsAllowed(!this.currentTool.inUse);
    }

    @HostListener('window:mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.currentTool.onMouseLeave(event);
        this.cursorManager.onMouseLeave();
    }

    @HostListener('window:mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.currentTool.onMouseEnter(event);
        this.cursorManager.onMouseEnter();
    }

    @HostListener('mousewheel', ['$event'])
    onMouseWheel(event: WheelEvent): void {
        this.currentTool.onMouseWheel(event);
    }

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: MouseEvent): void {
        event.preventDefault();
    }

    get defaultWidth(): number {
        return this.defaultSize.x;
    }

    get defaultHeight(): number {
        return this.defaultSize.y;
    }

    private assignContextValues(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridCtx = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    private propagateValuesToDrawingService(): void {
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.gridCtx = this.gridCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
    }

    private resizeGridCanvasOnSizeChange(): void {
        this.drawingService.canvasSizeSubject = new BehaviorSubject<number[]>([this.drawingService.canvas.width, this.drawingService.canvas.height]);
        this.drawingService.canvasSizeSubject.asObservable().subscribe((dimensions) => {
            this.canvasGridService.resize(dimensions[0], dimensions[1]);
        });
    }

    private changeCursorOnToolChange(): void {
        this.cursorManager.previewCanvas = this.previewCanvas.nativeElement;
        this.toolManager.currentToolSubject.asObservable().subscribe((tool) => {
            this.currentTool = tool;
            this.cursorManager.changeCursor(tool);
        });
    }
}
