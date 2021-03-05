import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { EllipseService } from '../ellipse/ellipse-service';
import { ToolSelectionService } from './tool-selection-service';

@Injectable({
    providedIn: 'root',
})
export class EllipseToolSelectionService extends ToolSelectionService {
    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, public ellipseService: EllipseService) {
        super(drawingService, undoRedoService);
    }

    onMouseDown(event: MouseEvent) {
        this.ellipseService.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent) {
        this.ellipseService.onMouseUp(event);
    }

    onMouseMove(event: MouseEvent) {
        this.ellipseService.onMouseMove(event);
    }

    onMouseLeave(event: MouseEvent) {
        this.ellipseService.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent) {
        this.ellipseService.onMouseEnter(event);
    }

    onKeyboardDown(event: KeyboardEvent) {
        this.ellipseService.onKeyboardDown(event);
    }

    onKeyboardUp(event: KeyboardEvent) {
        this.ellipseService.onKeyboardUp(event);
    }
}
