import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleSelectionCommand } from '@app/services/tools/selection/rectangle-selection-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { RectangleService } from '../rectangle/rectangle-service';
import { ToolSelectionService } from './tool-selection-service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends ToolSelectionService {
    transformValues: Vec2;
    isSquare: boolean = false;
    isShiftDown: boolean = false;
    isEscapeDown: boolean = false;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, public rectangleService: RectangleService) {
        super(drawingService, undoRedoService, rectangleService);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isManipulating) {
            // TODO:
            // Extract this into a single function allowing it to be called when tool is changed.
            this.transformValues = {
                x: parseInt(this.drawingService.selectionCanvas.style.left),
                y: parseInt(this.drawingService.selectionCanvas.style.top),
            };
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
            this.rectangleService.inUse = false;
            super.onMouseUp(event);
            this.selectionWidth = this.cornerCoords[1].x - this.cornerCoords[0].x;
            this.selectionHeight = this.cornerCoords[1].y - this.cornerCoords[0].y;
            if (this.selectionWidth == 0 || this.selectionHeight == 0) {
                this.inUse = false;
                this.resetSelectedToolSettings();
                return;
            }
            if (this.isSquare) {
                const shortestSide = Math.min(Math.abs(this.selectionWidth), Math.abs(this.selectionHeight));
                this.selectionWidth = Math.sign(this.selectionWidth) * shortestSide;
                this.selectionHeight = Math.sign(this.selectionHeight) * shortestSide;
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
            this.drawingService.baseCtx.clearRect(this.cornerCoords[0].x, this.cornerCoords[0].y, this.selectionWidth, this.selectionHeight);
            this.drawingService.selectionCanvas.style.left = this.cornerCoords[0].x + 'px';
            this.drawingService.selectionCanvas.style.top = this.cornerCoords[0].y + 'px';
            this.inUse = false;
            this.isManipulating = true;
            this.isSquare = false;
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
        if (this.inUse) {
            if (event.key === 'Shift' && !this.isShiftDown) {
                console.log('Shift down');
                this.isSquare = true;
                this.isShiftDown = true;
            } else if (event.key === 'Escape' && !this.isEscapeDown) {
                console.log('Hello from escape');
                this.isEscapeDown = true;
                console.log(this.isEscapeDown);
            }
        }
    }

    onKeyboardUp(event: KeyboardEvent): void {
        super.onKeyboardUp(event);
        if (this.inUse) {
            if (event.key === 'Shift' && this.isShiftDown) {
                console.log('Shift up');
                this.isSquare = false;
                this.isShiftDown = false;
            } else if (event.key === 'Escape' && this.isEscapeDown) {
                this.isEscapeDown = false;
            }
        }
    }

    selectAll(): void {
        super.selectAll();
    }
}
