import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DEFAULT_TOLERANCE_VALUE } from '@app/constants/paint-bucket-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    primaryColor: string;
    toleranceValue: number = DEFAULT_TOLERANCE_VALUE;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
    }

    setPrimaryColor(newColor: string): void {
        this.primaryColor = newColor;
    }

    setToleranceValue(toleranceValue: number): void {
        this.toleranceValue = toleranceValue;
    }

    onMouseDown(event: MouseEvent) {
        console.log(this.toleranceValue);
        console.log(this.primaryColor);
        console.log(this.drawingService.baseCtx.getImageData(0, 0, 100, 100));
    }
}
