import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService extends Tool {
    cornerCoords: Vec2[] = new Array<Vec2>(2);
    selectionTool: Tool;
    inUse: boolean = false;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, selectionTool: Tool) {
        super(drawingService, undoRedoService);
        this.selectionTool = selectionTool;
    }

    onMouseDown(event: MouseEvent): void {
        if (this.inUse) {
            this.drawingService.previewCtx.setLineDash([3, 3]);
            this.cornerCoords[0] = this.getPositionFromMouse(event);
            this.selectionTool.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[1] = this.getPositionFromMouse(event);
            this.selectionTool.onMouseUp(event);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.selectionTool.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent): void {
        this.selectionTool.onMouseEnter(event);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[1] = this.getPositionFromMouse(event);
            this.selectionTool.onMouseMove(event);
        }
    }

    onKeyboardDown(event: KeyboardEvent): void {
        this.selectionTool.onKeyboardDown(event);
    }

    onKeyboardUp(event: KeyboardEvent): void {
        this.selectionTool.onKeyboardUp(event);
    }

    // Get values from the transform style property of an element.
    getTransformValues(element: HTMLElement): Vec2 {
        const style = window.getComputedStyle(element);
        const matrix = new WebKitCSSMatrix(style.transform);
        if (!matrix) {
            return { x: 0, y: 0 };
        }
        return {
            x: matrix.m41,
            y: matrix.m42,
        };
    }

    resetCanvasState(canvas: HTMLCanvasElement): void {
        canvas.style.left = 0 + 'px';
        canvas.style.top = 0 + 'px';
        canvas.width = 0;
        canvas.height = 0;
    }

    clearCorners() {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }
}
