import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    selectedStamp: SVGImageElement;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
    }

    // TODO: implement liste deroulante for stamp choice
    // TODO: resizing

    onMouseDown(event: MouseEvent): void {
        this.addStamp(this.selectedStamp, this.getPositionFromMouse(event));
    }

    addStamp(selectedStamp: SVGImageElement, mousePosition: Vec2): void {
        this.drawingService.baseCtx.drawImage(selectedStamp, mousePosition.x, mousePosition.y);
    }
}
