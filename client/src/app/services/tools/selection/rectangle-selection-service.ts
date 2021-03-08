import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleSelectionCommand } from '@app/services/tools/selection/rectangle-selection-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { RectangleService } from '../rectangle/rectangle-service';
import { ToolSelectionService } from './tool-selection-service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends ToolSelectionService {
    isManipulating: boolean = false;
    selectionHeight: number = 0;
    selectionWidth: number = 0;
    transformValues: Vec2;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, public rectangleService: RectangleService) {
        super(drawingService, undoRedoService, rectangleService);
        // TODO:
        // Set rectangle settings when tool is changed, not when constructed.
        this.selectionTool.setFillMode(ToolConstants.FillMode.OUTLINE);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isManipulating) {
            // TODO:
            // Extract this into a single function allowing it to be called when tool is changed.
            this.transformValues = this.getTransformValues(this.drawingService.selectionCanvas);
            const command: Command = new RectangleSelectionCommand(this.drawingService.baseCtx, this.drawingService.selectionCanvas, this);
            this.undoRedoService.executeCommand(command);
            this.isManipulating = false;
            // Reset selection canvas to {w=0, h=0}, {top=0, left=0} and transform values
            this.resetCanvasState(this.drawingService.selectionCanvas);
            this.clearCorners();
        }
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        super.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[1] = this.getPositionFromMouse(event);
            // TODO:
            // Make it so super.onMouseUp does not draw on baseCtx, but uniquely on
            // previewCtx.
            super.onMouseUp(event);
            this.selectionWidth = this.cornerCoords[1].x - this.cornerCoords[0].x;
            this.selectionHeight = this.cornerCoords[1].y - this.cornerCoords[0].y;
            if (this.selectionWidth == 0 || this.selectionHeight == 0) {
                this.inUse = false;
                return;
            }
            this.drawingService.selectionCanvas.width = this.selectionWidth;
            this.drawingService.selectionCanvas.height = this.selectionHeight;
            this.drawingService.selectionCtx.drawImage(
                this.drawingService.canvas,
                this.cornerCoords[0].x,
                this.cornerCoords[0].y,
                this.selectionWidth,
                this.selectionHeight,
                0,
                0,
                this.selectionWidth,
                this.selectionHeight,
            );
            this.drawingService.baseCtx.rect(this.cornerCoords[0].x, this.cornerCoords[0].y, this.selectionWidth, this.selectionHeight);
            this.drawingService.baseCtx.strokeStyle = 'white';
            this.drawingService.baseCtx.stroke();
            this.drawingService.baseCtx.fillStyle = 'white';
            this.drawingService.baseCtx.fill();
            this.drawingService.selectionCanvas.style.left = this.cornerCoords[0].x + 'px';
            this.drawingService.selectionCanvas.style.top = this.cornerCoords[0].y + 'px';
            this.inUse = false;
            this.isManipulating = true;
        }
    }

    onMouseLeave(event: MouseEvent): void {
        super.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent): void {
        super.onMouseEnter(event);
    }

    onMouseMove(event: MouseEvent): void {
        super.onMouseMove(event);
    }

    onKeyboardDown(event: KeyboardEvent): void {
        super.onKeyboardDown(event);
    }

    onKeyboardUp(event: KeyboardEvent): void {
        super.onKeyboardUp(event);
    }
}
