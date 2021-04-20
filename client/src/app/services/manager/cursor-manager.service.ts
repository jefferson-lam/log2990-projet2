import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class CursorManagerService {
    private cursors: Map<Tool, string>;
    previewCanvas: HTMLCanvasElement;
    mousePosition: Vec2;
    private onCanvas: boolean;

    constructor(public undoRedoService: UndoRedoService, public toolManager: ToolManagerService) {
        this.onCanvas = false;
        this.mousePosition = { x: 0, y: 0 };

        this.cursors = new Map<Tool, string>();
        this.cursors
            .set(toolManager.pencilService, 'url(assets/pencil.png) 0 15, auto')
            .set(toolManager.eraserService, 'none')
            .set(toolManager.stampService, 'none')
            .set(toolManager.pipetteService, 'url(assets/eyedroper.png) 0 21, auto')
            .set(toolManager.paintBucketService, 'url(assets/paint-bucket.png) 0 18, auto')
            .set(toolManager.aerosolService, 'url(assets/spray.png) 0 0, auto')
            .set(toolManager.textService, 'text');

        this.undoRedoService.pileSizeObservable.subscribe(() => {
            this.toolManager.currentTool.drawCursor(this.mousePosition);
        });
    }

    changeCursor(tool: Tool): void {
        this.previewCanvas.style.cursor = 'crosshair';
        if (this.cursors.get(tool)) this.previewCanvas.style.cursor = this.cursors.get(tool) as string;
        if (this.onCanvas) tool.drawCursor(this.mousePosition);
    }

    onMouseMove(position: Vec2): void {
        this.mousePosition = position;
    }

    onMouseLeave(): void {
        this.onCanvas = false;
    }

    onMouseEnter(): void {
        this.onCanvas = true;
    }
}
