import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { RectangleService } from '../rectangle/rectangle-service';
import { ToolSelectionService } from './tool-selection-service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends ToolSelectionService {
    cornerCoords: Vec2[] = new Array<Vec2>(2);
    inUse: boolean = false;
    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, public rectangleService: RectangleService) {
        super(drawingService, undoRedoService);
        // Set rectangle settings when tool is changed, not when constructed TODO.
        this.rectangleService.setFillMode(ToolConstants.FillMode.OUTLINE);
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.drawingService.baseCtx.setLineDash([3, 3]);
            this.drawingService.previewCtx.setLineDash([3, 3]);
            this.cornerCoords[0] = this.getPositionFromMouse(event);
            this.rectangleService.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[1] = this.getPositionFromMouse(event);
            this.rectangleService.onMouseUp(event);
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
            // Delete the rectangle formed.
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.rectangleService.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.inUse) {
            this.rectangleService.onMouseEnter(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            this.rectangleService.onMouseMove(event);
        }
    }

    onKeyboardDown(event: KeyboardEvent): void {
        this.rectangleService.onKeyboardDown(event);
    }

    onKeyboardUp(event: KeyboardEvent): void {
        this.rectangleService.onKeyboardUp(event);
    }
}
