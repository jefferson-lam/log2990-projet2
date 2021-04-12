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
        this.lineService.linePathDataSubject.asObservable().subscribe((point) => {
            this.linePathData.push(point);
        });
    }

    onMouseDown(event: MouseEvent): void {
        super.onMouseDown(event);
        if (!this.inUse && !this.isManipulating) {
            this.clearPath();
            this.initialPoint = this.getPositionFromMouse(event);
            this.linePathData[SelectionConstants.START_INDEX] = this.initialPoint;
            this.inUse = true;
            console.log(this.initialPoint);
        } else if (this.inUse && !this.isManipulating) {
            if (
                this.linePathData[this.linePathData.length - 1].x === this.initialPoint.x &&
                this.linePathData[this.linePathData.length - 1].y === this.initialPoint.y
            ) {
                this.isConnected = true;
            }
        }

        if (this.isConnected) {
            this.inUse = false;
            this.lineService.onToolChange();
            console.log('Hello!');
            this.isConnected = false;
        }
    }

    onMouseDoubleClick(event: MouseEvent): void {
        this.lineService.inUse = false;
        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    isIntersect() {}

    private clearPath(): void {
        this.linePathData = [];
    }
}
