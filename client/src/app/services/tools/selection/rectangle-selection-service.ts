import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
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
        super(drawingService, undoRedoService, rectangleService);
        // Set rectangle settings when tool is changed, not when constructed TODO.
        this.selectionTool.setFillMode(ToolConstants.FillMode.OUTLINE);
    }

    onMouseDown(event: MouseEvent): void {
        super.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent): void {
        super.onMouseUp(event);
        // Delete the contents of the rectangle on the base canvas
    }

    onMouseLeave(event: MouseEvent): void {
        super.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent): void {
        super.onMouseEnter(event);
    }

    onMouseMove(event: MouseEvent): void {
        super.onMouseMove(event);
    }

    onKeyboardDown(event: KeyboardEvent): void {
        super.onKeyboardDown(event);
    }

    onKeyboardUp(event: KeyboardEvent): void {
        super.onKeyboardUp(event);
    }
}
