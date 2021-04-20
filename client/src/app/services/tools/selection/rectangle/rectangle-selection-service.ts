import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as SelectionConstants from '@app/constants/selection-constants';
import * as ShapeConstants from '@app/constants/shapes-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { RectangleSelectionCommand } from '@app/services/tools/selection/rectangle/rectangle-selection-command';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { ToolSelectionService } from '@app/services/tools/selection/tool-selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends ToolSelectionService {
    transformValues: Vec2;
    isSquare: boolean;
    private isShiftDown: boolean;
    isEscapeDown: boolean;
    pathData: Vec2[];
    inUse: boolean;
    isManipulating: boolean;
    selectionHeight: number;
    selectionWidth: number;
    isFromClipboard: boolean;

    constructor(
        drawingService: DrawingService,
        undoRedoService: UndoRedoService,
        resizerHandlerService: ResizerHandlerService,
        public rectangleService: RectangleService,
    ) {
        super(drawingService, undoRedoService, resizerHandlerService, rectangleService);
        this.isSquare = false;
        this.inUse = false;
        this.isManipulating = false;
        this.isShiftDown = false;
        this.isEscapeDown = false;
        this.pathData = new Array<Vec2>(ShapeConstants.DIMENSION);
        this.selectionHeight = 0;
        this.selectionWidth = 0;
        this.isFromClipboard = false;
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isManipulating) {
            this.confirmSelection();
        }
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.pathData[SelectionConstants.START_INDEX] = this.getPositionFromMouse(event);
            super.onMouseDown(event);
        }
    }

    /**
     * onMouseUp is called when the user has finished defining the selection. All pixels defined inside the rectangle
     * are drawn onto a third canvas, and we will the afromentioned rectangle with white pixels.
     */
    onMouseUp(event: MouseEvent): void {
        if (!this.inUse) return;
        this.initializeSelection(event);
    }

    onMouseLeave(event: MouseEvent): void {
        super.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent): void {
        super.onMouseEnter(event);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            this.pathData[SelectionConstants.END_INDEX] = this.getPositionFromMouse(event);
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
                this.resetProperties();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.isEscapeDown = false;
            }
        } else if (this.isManipulating) {
            if (event.key === 'Escape' && this.isEscapeDown) {
                this.confirmSelection();
                this.isEscapeDown = false;
            }
        }
    }

    selectAll(): void {
        if (this.isManipulating) {
            this.confirmSelection();
        }
        this.selectionWidth = this.drawingService.canvas.width;
        this.selectionHeight = this.drawingService.canvas.height;
        this.setSelectionCanvasSize(this.selectionWidth, this.selectionHeight);
        this.pathData = [
            { x: 0, y: 0 },
            { x: this.selectionWidth, y: this.selectionHeight },
        ];

        this.selectRectangle(this.drawingService.selectionCtx, this.drawingService.baseCtx);
        this.setSelectionCanvasPosition({ x: SelectionConstants.DEFAULT_LEFT_POSITION, y: SelectionConstants.DEFAULT_TOP_POSITION });

        this.inUse = false;
        this.isManipulating = true;
    }

    onToolEnter(): void {
        super.onToolEnter();
    }

    onToolChange(): void {
        super.onToolChange();
        if (this.isManipulating) {
            this.confirmSelection();
        } else if (this.inUse) {
            const resetKeyboardEvent: KeyboardEvent = {
                key: 'Escape',
            } as KeyboardEvent;
            this.isEscapeDown = true;
            this.onKeyboardUp(resetKeyboardEvent);
            this.rectangleService.inUse = false;
        }
    }

    private initializeSelection(event: MouseEvent): void {
        this.lockMouseInsideCanvas(event);
        this.rectangleService.inUse = false;
        super.onMouseUp(event);
        this.computeSelectionDimensions();
        if (!this.validateSelectionHeightAndWidth()) {
            return;
        }
        this.setSelectionCanvasSize(this.selectionWidth, this.selectionHeight);
        this.selectRectangle(this.drawingService.selectionCtx, this.drawingService.baseCtx);
        this.setSelectionCanvasPosition(this.pathData[SelectionConstants.START_INDEX]);
        this.inUse = false;
        this.isManipulating = true;
    }

    confirmSelection(): void {
        // transformValues represent where the canvas' topleft corner was moved
        this.transformValues = {
            x: parseInt(this.drawingService.selectionCanvas.style.left, 10),
            y: parseInt(this.drawingService.selectionCanvas.style.top, 10),
        };
        const command: Command = new RectangleSelectionCommand(this.drawingService.baseCtx, this.drawingService.selectionCanvas, this);
        this.undoRedoService.executeCommand(command);
        this.resetProperties();
    }

    undoSelection(): void {
        if (!this.isManipulating) {
            return;
        }
        if (!this.isFromClipboard) {
            this.drawingService.baseCtx.drawImage(
                this.originalImageCanvas,
                0,
                0,
                this.selectionWidth,
                this.selectionHeight,
                this.pathData[SelectionConstants.START_INDEX].x,
                this.pathData[SelectionConstants.START_INDEX].y,
                this.selectionWidth,
                this.selectionHeight,
            );
        }
        this.resetProperties();
    }

    private fillRectangle(baseCtx: CanvasRenderingContext2D): void {
        // Erase the contents on the base canvas
        baseCtx.fillStyle = 'white';
        baseCtx.fillRect(
            this.pathData[SelectionConstants.START_INDEX].x,
            this.pathData[SelectionConstants.START_INDEX].y,
            this.selectionWidth,
            this.selectionHeight,
        );
    }

    private validateSelectionHeightAndWidth(): boolean {
        if (this.selectionWidth === 0 || this.selectionHeight === 0) {
            this.inUse = false;
            return false;
        }
        this.pathData = this.validateCornerCoords(this.pathData, this.selectionWidth, this.selectionHeight);
        if (this.isSquare) {
            const shortestSide = Math.min(Math.abs(this.selectionWidth), Math.abs(this.selectionHeight));
            this.pathData = this.computeSquareCoords(this.pathData, this.selectionWidth, this.selectionHeight);
            this.selectionHeight = this.selectionWidth = shortestSide;
        }
        this.selectionWidth = Math.abs(this.selectionWidth);
        this.selectionHeight = Math.abs(this.selectionHeight);
        return true;
    }

    private selectRectangle(selectionCtx: CanvasRenderingContext2D, baseCtx: CanvasRenderingContext2D): void {
        this.drawingService.selectionCanvas.style.visibility = 'visible';
        selectionCtx.drawImage(
            baseCtx.canvas,
            this.pathData[SelectionConstants.START_INDEX].x,
            this.pathData[SelectionConstants.START_INDEX].y,
            this.selectionWidth,
            this.selectionHeight,
            0,
            0,
            this.selectionWidth,
            this.selectionHeight,
        );
        this.originalImageCtx.drawImage(
            baseCtx.canvas,
            this.pathData[SelectionConstants.START_INDEX].x,
            this.pathData[SelectionConstants.START_INDEX].y,
            this.selectionWidth,
            this.selectionHeight,
            0,
            0,
            this.selectionWidth,
            this.selectionHeight,
        );
        this.fillRectangle(baseCtx);
    }

    private lockMouseInsideCanvas(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        mousePosition.x = mousePosition.x > this.drawingService.canvas.width ? this.drawingService.canvas.width : mousePosition.x;
        mousePosition.y = mousePosition.y > this.drawingService.canvas.height ? this.drawingService.canvas.height : mousePosition.y;
        this.pathData[SelectionConstants.END_INDEX] = mousePosition;
    }

    private resetProperties(): void {
        this.resetAllCanvasState();
        this.clearCorners(this.pathData);
        this.resizerHandlerService.resetResizers();
        this.isFromClipboard = false;
        this.inUse = false;
        this.isManipulating = false;
        this.isSquare = false;
        this.isShiftDown = false;
        this.rectangleService.isShiftDown = false;
    }

    private computeSelectionDimensions(): void {
        this.selectionWidth = this.pathData[SelectionConstants.END_INDEX].x - this.pathData[SelectionConstants.START_INDEX].x;
        this.selectionHeight = this.pathData[SelectionConstants.END_INDEX].y - this.pathData[SelectionConstants.START_INDEX].y;
    }
}
