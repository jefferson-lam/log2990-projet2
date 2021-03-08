import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
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
    inUse: boolean = false;
    isManipulating: boolean = false;
    selectionHeight: number = 0;
    selectionWidth: number = 0;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, public rectangleService: RectangleService) {
        super(drawingService, undoRedoService, rectangleService);
        // Set rectangle settings when tool is changed, not when constructed TODO.
        this.selectionTool.setFillMode(ToolConstants.FillMode.OUTLINE);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isManipulating) {
            const transformValues = this.getTransformValues(this.drawingService.selectionCanvas);
            this.cornerCoords[0] = {
                x: this.cornerCoords[0].x + transformValues.x,
                y: this.cornerCoords[0].y + transformValues.y,
            };
            const command: Command = new RectangleSelectionCommand(this.drawingService.baseCtx, this.drawingService.selectionCanvas, this);
            this.undoRedoService.executeCommand(command);
            this.isManipulating = false;
            this.resetCanvasState(this.drawingService.selectionCanvas);
            this.clearCorners();
        }
        // Reset selection canvas to {w=0, h=0}, {top=0, left=0} and transform values
        super.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[1] = this.getPositionFromMouse(event);
            super.onMouseUp(event);
            const selectionWidth = Math.abs(this.cornerCoords[1].x - this.cornerCoords[0].x);
            const selectionHeight = Math.abs(this.cornerCoords[1].y - this.cornerCoords[0].y);
            if (selectionWidth == 0 || selectionHeight == 0) {
                this.inUse = false;
                return;
            }
            this.drawingService.selectionCanvas.width = selectionWidth;
            this.drawingService.selectionCanvas.height = selectionHeight;
            this.drawingService.selectionCtx.drawImage(
                this.drawingService.canvas,
                this.cornerCoords[0].x,
                this.cornerCoords[0].y,
                selectionWidth,
                selectionHeight,
                0,
                0,
                selectionWidth,
                selectionHeight,
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
            this.drawingService.selectionCanvas.style.transform = '';
            this.selectionWidth = selectionWidth;
            this.selectionHeight = selectionHeight;
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

    private clearCorners(): void {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }
}
