import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as SelectionConstants from '@app/constants/selection-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { LineService } from '../../line/line-service';
import { ToolSelectionService } from '../tool-selection-service';

@Injectable({
    providedIn: 'root',
})
export class LassoSelectionService extends ToolSelectionService {
    isManipulating: boolean;
    isConnected: boolean;
    linePathData: Vec2[];
    initialPoint: Vec2;

    constructor(
        drawingService: DrawingService,
        undoRedoService: UndoRedoService,
        resizerHandlerService: ResizerHandlerService,
        public lineService: LineService,
    ) {
        super(drawingService, undoRedoService, resizerHandlerService, lineService);
        this.isManipulating = false;
        this.isConnected = false;
        this.linePathData = new Array<Vec2>();
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.inUse) {
            this.initialPoint = this.getPositionFromMouse(event);
            this.linePathData[SelectionConstants.START_INDEX] = this.initialPoint;
            this.linePathData.push(this.initialPoint);
        } else {
            this.linePathData.push(this.linePathData[this.linePathData.length - 1]);
        }
        super.onMouseDown(event);
    }

    onMouseMove(event: MouseEvent): void {
        super.onMouseMove(event);
    }
}
