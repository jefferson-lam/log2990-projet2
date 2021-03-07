import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolSelectionCommand } from '@app/services/tools/selection/tool-selection-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService extends Tool {
    cornerCoords: Vec2[] = new Array<Vec2>(2);
    selectionTool: Tool;
    inUse: boolean = false;

    previewCommand: ToolSelectionCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, selectionTool: Tool) {
        super(drawingService, undoRedoService);
        this.selectionTool = selectionTool;
        this.previewCommand = new ToolSelectionCommand(drawingService.previewCtx, this);
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.drawingService.baseCtx.setLineDash([3, 3]);
            this.drawingService.previewCtx.setLineDash([3, 3]);
            this.cornerCoords[0] = this.getPositionFromMouse(event);
            this.selectionTool.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[1] = this.getPositionFromMouse(event);
            this.selectionTool.onMouseUp(event);
            // Copy over contents inside the rectangle onto the selection canvas.
            const selectionWidth = this.cornerCoords[1].x - this.cornerCoords[0].x;
            const selectionHeight = this.cornerCoords[1].y - this.cornerCoords[0].y;
            this.drawingService.selectionCanvas.width = selectionWidth;
            this.drawingService.selectionCanvas.height = selectionHeight;
            this.drawingService.selectionCtx.drawImage(
                this.drawingService.canvas,
                this.cornerCoords[0].x,
                this.cornerCoords[0].y,
                selectionWidth,
                selectionHeight,
                0,
                0,
                selectionWidth,
                selectionHeight,
            );
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.selectionTool.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.inUse) {
            this.selectionTool.onMouseEnter(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            this.selectionTool.onMouseMove(event);
        }
    }

    onKeyboardDown(event: KeyboardEvent): void {
        this.selectionTool.onKeyboardDown(event);
    }

    onKeyboardUp(event: KeyboardEvent): void {
        this.selectionTool.onKeyboardUp(event);
    }
}
