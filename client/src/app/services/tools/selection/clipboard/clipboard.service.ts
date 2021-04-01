import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleSelectionService } from '../rectangle/rectangle-selection-service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    clipboard: ImageData;
    canvasWidth: number;
    canvasHeight: number;

    // TODO: get selected tool for proper dimensions
    constructor(private drawingService: DrawingService, private rectangleSelection: RectangleSelectionService) {}

    copySelection(): void {
        if (this.isSelected(this.drawingService.selectionCtx, this.rectangleSelection.selectionWidth, this.rectangleSelection.selectionHeight)) {
            this.clipboard = this.drawingService.selectionCtx.getImageData(
                0,
                0,
                this.rectangleSelection.selectionWidth,
                this.rectangleSelection.selectionHeight,
            );
            console.log(this.clipboard.data);
        }
    }

    cutSelection(): void {
        this.copySelection();
        this.drawingService.selectionCtx.fillStyle = 'white';
        this.drawingService.selectionCtx.fillRect(0, 0, this.rectangleSelection.selectionWidth, this.rectangleSelection.selectionHeight);
        // this.rectangleSelection.resetCanvasState(this.drawingService.selectionCanvas);
        // this.rectangleSelection.resetCanvasState(this.drawingService.previewSelectionCanvas);
        // this.rectangleSelection.resetSelectedToolSettings();
        // this.drawingService.clearCanvas(this.drawingService.previewCtx);
        // this.rectangleSelection.inUse = false;
    }

    pasteSelection(): void {
        if (this.clipboard.data !== undefined) {
            // TODO: paste selection to corner of base canvas as a selection
            this.drawingService.baseCtx.putImageData(this.clipboard, 0, 0);
        }
    }

    private isSelected(selectionCtx: CanvasRenderingContext2D, selectionWidth: number, selectionHeight: number): boolean {
        return selectionCtx.getImageData(0, 0, selectionWidth, selectionHeight).data.some((pixel) => pixel !== 0);
    }
}
