import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as SelectionConstants from '@app/constants/selection-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { RectangleSelectionCommand } from '@app/services/tools/selection/rectangle-selection-command';
import { ToolSelectionService } from '@app/services/tools/selection/tool-selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends ToolSelectionService {
    transformValues: Vec2;
    isSquare: boolean = false;
    isShiftDown: boolean = false;
    isEscapeDown: boolean = false;
    cornerCoords: Vec2[] = new Array<Vec2>(2);
    inUse: boolean = false;
    isManipulating: boolean = false;
    selectionHeight: number = 0;
    selectionWidth: number = 0;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, public rectangleService: RectangleService) {
        super(drawingService, undoRedoService, rectangleService);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isManipulating) {
            this.transformValues = {
                x: parseInt(this.drawingService.selectionCanvas.style.left, 10),
                y: parseInt(this.drawingService.selectionCanvas.style.top, 10),
            };
            const command: Command = new RectangleSelectionCommand(this.drawingService.baseCtx, this.drawingService.selectionCanvas, this);
            this.undoRedoService.executeCommand(command);
            this.isManipulating = false;
            // Reset selection canvas to {w=0, h=0}, {top=0, left=0} and transform values
            this.resetCanvasState(this.drawingService.selectionCanvas);
            this.clearCorners();
            this.resetSelectedToolSettings();
        }
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.cornerCoords[SelectionConstants.START_INDEX] = this.getPositionFromMouse(event);
            super.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[SelectionConstants.END_INDEX] = this.getPositionFromMouse(event);
            this.rectangleService.inUse = false;
            super.onMouseUp(event);
            this.selectionWidth = this.cornerCoords[SelectionConstants.END_INDEX].x - this.cornerCoords[SelectionConstants.START_INDEX].x;
            this.selectionHeight = this.cornerCoords[SelectionConstants.END_INDEX].y - this.cornerCoords[SelectionConstants.START_INDEX].y;
            if (this.selectionWidth === 0 || this.selectionHeight === 0) {
                this.resetSelectedToolSettings();
                this.inUse = false;
                return;
            }
            this.validateCornerCoords();
            this.validateSelectionSize();
            this.drawingService.selectionCanvas.width = this.selectionWidth;
            this.drawingService.selectionCanvas.height = this.selectionHeight;
            this.drawingService.selectionCtx.fillStyle = 'white';
            this.drawingService.selectionCtx.fillRect(0, 0, this.drawingService.selectionCanvas.width, this.drawingService.selectionCanvas.height);
            this.drawingService.selectionCtx.drawImage(
                this.drawingService.canvas,
                this.cornerCoords[SelectionConstants.START_INDEX].x,
                this.cornerCoords[SelectionConstants.START_INDEX].y,
                this.selectionWidth,
                this.selectionHeight,
                0,
                0,
                this.selectionWidth,
                this.selectionHeight,
            );
            this.drawingService.baseCtx.clearRect(
                this.cornerCoords[SelectionConstants.START_INDEX].x,
                this.cornerCoords[SelectionConstants.START_INDEX].y,
                this.selectionWidth,
                this.selectionHeight,
            );
            this.drawingService.selectionCanvas.style.left = this.cornerCoords[SelectionConstants.START_INDEX].x + 'px';
            this.drawingService.selectionCanvas.style.top = this.cornerCoords[SelectionConstants.START_INDEX].y + 'px';
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
        if (this.inUse) {
            this.cornerCoords[SelectionConstants.END_INDEX] = this.getPositionFromMouse(event);
            super.onMouseMove(event);
        }
    }

    onKeyboardDown(event: KeyboardEvent): void {
        super.onKeyboardDown(event);
        if (this.inUse) {
            if (event.key === 'Shift' && !this.isShiftDown) {
                this.isSquare = true;
                this.isShiftDown = true;
            } else if (event.key === 'Escape' && !this.isEscapeDown) {
                this.isEscapeDown = true;
            }
        } else if (this.isManipulating) {
            if (event.key === 'Escape' && !this.isEscapeDown) {
                this.isEscapeDown = true;
            }
        }
    }

    onKeyboardUp(event: KeyboardEvent): void {
        super.onKeyboardUp(event);
        if (this.inUse) {
            if (event.key === 'Shift' && this.isShiftDown) {
                this.isSquare = false;
                this.isShiftDown = false;
            } else if (event.key === 'Escape' && this.isEscapeDown) {
                // Case where the user is still selecting.
                this.resetCanvasState(this.drawingService.selectionCanvas);
                this.resetSelectedToolSettings();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.inUse = false;
                this.isEscapeDown = false;
            }
        } else if (this.isManipulating) {
            if (event.key === 'Escape' && this.isEscapeDown) {
                // Case where user has defined the selection area
                this.drawingService.baseCtx.drawImage(
                    this.drawingService.selectionCanvas,
                    0,
                    0,
                    this.selectionWidth,
                    this.selectionHeight,
                    this.cornerCoords[SelectionConstants.START_INDEX].x,
                    this.cornerCoords[SelectionConstants.START_INDEX].y,
                    this.selectionWidth,
                    this.selectionHeight,
                );
                this.resetCanvasState(this.drawingService.selectionCanvas);
                this.resetSelectedToolSettings();
                this.isManipulating = false;
                this.isEscapeDown = false;
            }
        }
    }

    selectAll(): void {
        this.selectionWidth = this.drawingService.canvas.width;
        this.selectionHeight = this.drawingService.canvas.height;
        this.drawingService.selectionCanvas.width = this.selectionWidth;
        this.drawingService.selectionCanvas.height = this.selectionHeight;
        this.drawingService.selectionCtx.fillStyle = 'white';
        this.drawingService.selectionCtx.fillRect(0, 0, this.drawingService.selectionCanvas.width, this.drawingService.selectionCanvas.height);
        this.drawingService.selectionCtx.drawImage(
            this.drawingService.canvas,
            0,
            0,
            this.selectionWidth,
            this.selectionHeight,
            0,
            0,
            this.selectionWidth,
            this.selectionHeight,
        );
        this.drawingService.baseCtx.clearRect(0, 0, this.selectionWidth, this.selectionHeight);
        this.drawingService.selectionCanvas.style.left = SelectionConstants.DEFAULT_LEFT_POSITION + 'px';
        this.drawingService.selectionCanvas.style.top = SelectionConstants.DEFAULT_TOP_POSITION + 'px';
        this.cornerCoords = [
            { x: 0, y: 0 },
            { x: this.selectionWidth, y: this.selectionHeight },
        ];
        this.inUse = false;
        this.isManipulating = true;
    }

    validateCornerCoords() {
        const tempCoord = this.cornerCoords[SelectionConstants.START_INDEX];
        if (this.selectionHeight < 0 && this.selectionWidth < 0) {
            this.cornerCoords[SelectionConstants.START_INDEX] = this.cornerCoords[SelectionConstants.END_INDEX];
            this.cornerCoords[SelectionConstants.END_INDEX] = tempCoord;
        } else if (this.selectionWidth < 0 && this.selectionHeight > 0) {
            this.cornerCoords[SelectionConstants.START_INDEX].x = this.cornerCoords[SelectionConstants.END_INDEX].x;
            this.cornerCoords[SelectionConstants.END_INDEX].x = tempCoord.x;
        } else if (this.selectionWidth > 0 && this.selectionHeight < 0) {
            this.cornerCoords[SelectionConstants.START_INDEX].y = this.cornerCoords[SelectionConstants.END_INDEX].y;
            this.cornerCoords[SelectionConstants.END_INDEX].y = tempCoord.y;
        }
    }

    validateSelectionSize() {
        this.selectionWidth = Math.abs(this.selectionWidth);
        this.selectionHeight = Math.abs(this.selectionHeight);
        if (this.isSquare) {
            const shortestSide = Math.min(this.selectionWidth, this.selectionHeight);
            this.selectionWidth = Math.sign(this.selectionWidth) * shortestSide;
            this.selectionHeight = Math.sign(this.selectionHeight) * shortestSide;
        }
    }

    clearCorners(): void {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }
}
