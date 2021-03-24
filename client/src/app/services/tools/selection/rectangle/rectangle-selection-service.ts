import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as SelectionConstants from '@app/constants/selection-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { RectangleSelectionCommand } from '@app/services/tools/selection/rectangle/rectangle-selection-command';
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

    constructor(
        drawingService: DrawingService,
        undoRedoService: UndoRedoService,
        resizerHandlerService: ResizerHandlerService,
        public rectangleService: RectangleService,
    ) {
        super(drawingService, undoRedoService, resizerHandlerService, rectangleService);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isManipulating) {
            // transformValues represent where the canvas' topleft corner was moved
            this.transformValues = {
                x: parseInt(this.drawingService.selectionCanvas.style.left, 10),
                y: parseInt(this.drawingService.selectionCanvas.style.top, 10),
            };
            const command: Command = new RectangleSelectionCommand(this.drawingService.baseCtx, this.drawingService.selectionCanvas, this);
            this.undoRedoService.executeCommand(command);
            this.isManipulating = false;
            this.isSquare = false;
            this.isShiftDown = false;
            this.rectangleService.isShiftDown = false;
            // Reset selection canvas to {w=0, h=0}, {top=0, left=0} and transform values
            this.resetCanvasState(this.drawingService.selectionCanvas);
            this.resetCanvasState(this.drawingService.previewSelectionCanvas);
            this.clearCorners(this.cornerCoords);
            this.resetSelectedToolSettings();
            this.resizerHandlerService.resetResizers();
        }
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.cornerCoords[SelectionConstants.START_INDEX] = this.getPositionFromMouse(event);
            super.onMouseDown(event);
        }
    }

    /**
     * onMouseUp is called when the user has finished defining the selection. All pixels defined inside the rectangle
     * are drawn onto a third canvas, and we will the afromentioned rectangle with white pixels.
     */
    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[SelectionConstants.END_INDEX] = this.getPositionFromMouse(event);
            this.rectangleService.inUse = false;
            super.onMouseUp(event);
            this.selectionWidth = this.cornerCoords[SelectionConstants.END_INDEX].x - this.cornerCoords[SelectionConstants.START_INDEX].x;
            this.selectionHeight = this.cornerCoords[SelectionConstants.END_INDEX].y - this.cornerCoords[SelectionConstants.START_INDEX].y;
            if (!this.validateSelectionHeightAndWidth()) {
                return;
            }
            this.drawingService.selectionCanvas.width = this.drawingService.previewSelectionCanvas.width = this.selectionWidth;
            this.drawingService.selectionCanvas.height = this.drawingService.previewSelectionCanvas.height = this.selectionHeight;
            this.selectRectangle(
                this.drawingService.selectionCtx,
                this.drawingService.baseCtx,
                this.cornerCoords,
                this.selectionWidth,
                this.selectionHeight,
            );
            this.setSelectionCanvasPosition(this.cornerCoords[SelectionConstants.START_INDEX], this.selectionWidth, this.selectionHeight);
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
                this.resetCanvasState(this.drawingService.previewSelectionCanvas);
                this.resetSelectedToolSettings();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.inUse = false;
                this.isEscapeDown = false;
            }
        } else if (this.isManipulating) {
            if (event.key === 'Escape' && this.isEscapeDown) {
                this.onMouseDown({} as MouseEvent);
                this.isEscapeDown = false;
            }
        }
    }

    undoSelection(): void {
        if (this.isManipulating) {
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
            this.resetSelectedToolSettings();
            this.resetCanvasState(this.drawingService.selectionCanvas);
            this.resetCanvasState(this.drawingService.previewSelectionCanvas);
            this.resizerHandlerService.resetResizers();
            this.isManipulating = false;
            this.isEscapeDown = false;
        }
    }

    selectAll(): void {
        this.selectionWidth = this.drawingService.canvas.width;
        this.selectionHeight = this.drawingService.canvas.height;
        this.drawingService.selectionCanvas.width = this.drawingService.previewSelectionCanvas.width = this.selectionWidth;
        this.drawingService.selectionCanvas.height = this.drawingService.previewSelectionCanvas.height = this.selectionHeight;
        this.cornerCoords = [
            { x: 0, y: 0 },
            { x: this.selectionWidth, y: this.selectionHeight },
        ];

        this.selectRectangle(
            this.drawingService.selectionCtx,
            this.drawingService.baseCtx,
            this.cornerCoords,
            this.selectionWidth,
            this.selectionHeight,
        );
        this.setSelectionCanvasPosition(
            { x: SelectionConstants.DEFAULT_LEFT_POSITION, y: SelectionConstants.DEFAULT_TOP_POSITION },
            this.selectionWidth,
            this.selectionHeight,
        );

        this.inUse = false;
        this.isManipulating = true;
    }

    onToolChange(): void {
        if (this.isManipulating) {
            const emptyMouseEvent: MouseEvent = {} as MouseEvent;
            this.onMouseDown(emptyMouseEvent);
        } else if (this.inUse) {
            const resetKeyboardEvent: KeyboardEvent = {
                key: 'Escape',
            } as KeyboardEvent;
            this.isEscapeDown = true;
            this.onKeyboardUp(resetKeyboardEvent);
            this.rectangleService.inUse = false;
        }
    }

    private setSelectionCanvasPosition(topLeft: Vec2, selectionWidth: number, selectionHeight: number): void {
        this.drawingService.selectionCanvas.style.left = topLeft.x + 'px';
        this.drawingService.selectionCanvas.style.top = topLeft.y + 'px';
        this.drawingService.previewSelectionCanvas.style.left = topLeft.x + 'px';
        this.drawingService.previewSelectionCanvas.style.top = topLeft.y + 'px';
        this.resizerHandlerService.setResizerPosition(topLeft, selectionWidth, selectionHeight);
    }

    private validateSelectionHeightAndWidth(): boolean {
        if (this.selectionWidth === 0 || this.selectionHeight === 0) {
            this.resetSelectedToolSettings();
            this.inUse = false;
            return false;
        }
        this.cornerCoords = this.validateCornerCoords(this.cornerCoords, this.selectionWidth, this.selectionHeight);
        if (this.isSquare) {
            const shortestSide = Math.min(Math.abs(this.selectionWidth), Math.abs(this.selectionHeight));
            this.cornerCoords = this.computeSquareCoords(this.cornerCoords, this.selectionWidth, this.selectionHeight, shortestSide);
            this.selectionHeight = this.selectionWidth = shortestSide;
        }
        this.selectionWidth = Math.abs(this.selectionWidth);
        this.selectionHeight = Math.abs(this.selectionHeight);
        return true;
    }

    private selectRectangle(
        selectionCtx: CanvasRenderingContext2D,
        baseCtx: CanvasRenderingContext2D,
        cornerCoords: Vec2[],
        selectionWidth: number,
        selectionHeight: number,
    ): void {
        selectionCtx.drawImage(
            baseCtx.canvas,
            cornerCoords[SelectionConstants.START_INDEX].x,
            cornerCoords[SelectionConstants.START_INDEX].y,
            selectionWidth,
            selectionHeight,
            0,
            0,
            selectionWidth,
            selectionHeight,
        );
        // Erase the contents on the base canvas
        baseCtx.fillStyle = 'white';
        baseCtx.fillRect(
            cornerCoords[SelectionConstants.START_INDEX].x,
            cornerCoords[SelectionConstants.START_INDEX].y,
            selectionWidth,
            selectionHeight,
        );
    }
}
