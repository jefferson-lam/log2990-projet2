import { Component } from '@angular/core';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-new-drawing-box',
    templateUrl: './new-drawing-box.component.html',
    styleUrls: ['./new-drawing-box.component.scss'],
})
export class NewDrawingBoxComponent {
    constructor(private drawingService: DrawingService, private autoSaveService: AutoSaveService) {}

    newDrawing(): void {
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        localStorage.removeItem('autosave');
        this.autoSaveService.loadDrawing();
    }
}
