import { Injectable } from '@angular/core';
import { ResizerCommand } from '@app/components/resizer/resizer-command';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class AutoSaveService {
    constructor(public drawingService: DrawingService, public undoRedoService: UndoRedoService) {
        this.undoRedoService.pileSizeObservable.subscribe((sizes: number[]) => {
            if (sizes[0] + sizes[1] > 0) {
                this.autoSaveDrawing();
            }
        });
    }

    autoSaveDrawing(): void {
        if (this.drawingService.canvas) {
            localStorage.setItem('autosave', this.drawingService.canvas.toDataURL('image/png'));
        }
    }

    async loadDrawing(): Promise<void> {
        if (localStorage.getItem('autosave')) {
            await new Promise((r) => {
                this.undoRedoService.initialImage.onload = r;
                this.undoRedoService.initialImage.src = localStorage.getItem('autosave') as string;
            });

            this.undoRedoService.resetCanvasSize = new ResizerCommand(
                this.drawingService,
                this.undoRedoService.initialImage.width,
                this.undoRedoService.initialImage.height,
            );
            this.undoRedoService.resetCanvasSize.execute();
            this.drawingService.baseCtx.drawImage(
                this.undoRedoService.initialImage,
                0,
                0,
                this.undoRedoService.initialImage.width,
                this.undoRedoService.initialImage.height,
            );
        } else {
            this.undoRedoService.initialImage.src = '';
            this.undoRedoService.resetCanvasSize = new ResizerCommand(
                this.drawingService,
                CanvasConstants.DEFAULT_WIDTH,
                CanvasConstants.DEFAULT_HEIGHT,
            );
            this.undoRedoService.resetCanvasSize.execute();
        }
        this.undoRedoService.reset();
        this.autoSaveDrawing();
    }
}
