import { Injectable } from '@angular/core';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { EllipseService } from '../ellipse/ellipse-service';
import { ToolSelectionService } from './tool-selection-service';

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionService extends ToolSelectionService {
    inUse: boolean = false;
    isManipulating: boolean = false;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, public ellipseService: EllipseService) {
        super(drawingService, undoRedoService, ellipseService);
    }

    onMouseDown(event: MouseEvent) {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        super.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent) {
        super.onMouseUp(event);
    }

    onMouseMove(event: MouseEvent) {
        super.onMouseMove(event);
    }

    onMouseLeave(event: MouseEvent) {
        super.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent) {
        super.onMouseEnter(event);
    }

    onKeyboardDown(event: KeyboardEvent) {
        super.onKeyboardDown(event);
    }

    onKeyboardUp(event: KeyboardEvent) {
        super.onKeyboardUp(event);
    }
}
