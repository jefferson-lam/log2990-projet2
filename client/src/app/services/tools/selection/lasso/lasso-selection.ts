import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { LineService } from '../../line/line-service';
import { ToolSelectionService } from '../tool-selection-service';

@Injectable({
    providedIn: 'root',
})
export class LassoSelectionService extends ToolSelectionService {
    constructor(
        drawingService: DrawingService,
        undoRedoService: UndoRedoService,
        resizerHandlerService: ResizerHandlerService,
        public lineService: LineService,
    ) {
        super(drawingService, undoRedoService, resizerHandlerService, lineService);
    }
}
