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
    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, public rectangleService: RectangleService) {
        super(drawingService, undoRedoService);
        // Set rectangle settings when tool is changed, not when constructed TODO.
        this.rectangleService.setFillMode(ToolConstants.FillMode.OUTLINE);
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.baseCtx.setLineDash([3, 3]);
        this.drawingService.previewCtx.setLineDash([3, 3]);
        this.rectangleService.onMouseDown(event);
        this.cornerCoords[0] = this.rectangleService.cornerCoords[0];
    }

    onMouseUp(event: MouseEvent): void {
        this.rectangleService.onMouseUp(event);
    }

    onMouseLeave(event: MouseEvent): void {
        this.rectangleService.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent): void {
        this.rectangleService.onMouseEnter(event);
    }

    onMouseMove(event: MouseEvent): void {
        this.rectangleService.onMouseMove(event);
        this.cornerCoords[1] = this.rectangleService.cornerCoords[1];
        console.log(this.cornerCoords);
    }
    onKeyboardDown(event: KeyboardEvent): void {
        this.rectangleService.onKeyboardDown(event);
    }

    onKeyboardUp(event: KeyboardEvent): void {
        this.rectangleService.onKeyboardUp(event);
    }
}
