import { Injectable } from '@angular/core';
import { ResizerCommand } from '@app/components/resizer/resizer-command';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class AutoSaveService {
    constructor(private drawingService: DrawingService, private undoRedoService: UndoRedoService) {
        this.undoRedoService.pileSizeObservable.subscribe((sizes: number[]) => {
            if (sizes[0] + sizes[1] > 0) this.autoSaveDrawing();
        });
    }

    autoSaveDrawing(): void {
        if (this.drawingService.canvas) {
            localStorage.setItem('autosave', this.drawingService.canvas.toDataURL('image/png'));
        }
    }

    loadDrawing(): void {
        if (localStorage.getItem('autosave')) {
            const image = new Image();
            image.src = localStorage.getItem('autosave') as string;
            this.undoRedoService.resetCanvasSize = new ResizerCommand(image.width, image.height);
            this.undoRedoService.resetCanvasSize.execute();
            image.onload = () => {
                this.drawingService.baseCtx.drawImage(image, 0, 0, image.width, image.height);
                this.undoRedoService.reset();
            };
        } else {
            this.undoRedoService.resetCanvasSize = new ResizerCommand(CanvasConstants.DEFAULT_WIDTH, CanvasConstants.DEFAULT_HEIGHT);
            this.undoRedoService.resetCanvasSize.execute();
        }
        this.autoSaveDrawing();
    }
}
