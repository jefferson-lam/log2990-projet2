import { Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-new-drawing-box',
    templateUrl: './new-drawing-box.component.html',
    styleUrls: ['./new-drawing-box.component.scss'],
})
export class NewDrawingBoxComponent {
    constructor(private drawingService: DrawingService, private undoRedoService: UndoRedoService) {}

    newDrawing(): void {
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.undoRedoService.reset();
    }
}
