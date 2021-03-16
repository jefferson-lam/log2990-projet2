import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as SelectionConstants from '@app/constants/selection-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService extends Tool {
    selectionHeight: number = 0;
    selectionWidth: number = 0;
    cornerCoords: Vec2[] = new Array<Vec2>(2);
    selectionTool: Tool;
    inUse: boolean = false;
    isManipulating: boolean = false;
    // Save selectionTool's lineWidth here and fillMode.
    selectionToolLineWidth: number;
    selectionToolFillMode: ToolConstants.FillMode;
    selectionToolPrimaryColor: string;
    selectionToolSecondaryColor: string;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, selectionTool: Tool) {
        super(drawingService, undoRedoService);
        this.selectionTool = selectionTool;
        if (selectionTool.lineWidth != null) {
            this.selectionToolLineWidth = selectionTool.lineWidth;
        }
        if (selectionTool.fillMode != null) {
            this.selectionToolFillMode = selectionTool.fillMode;
        }
        if (selectionTool.primaryColor != null) {
            this.selectionToolPrimaryColor = selectionTool.primaryColor;
        }
        if (selectionTool.secondaryColor != null) {
            this.selectionToolSecondaryColor = selectionTool.secondaryColor;
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (this.inUse) {
            this.setSelectionSettings();
            this.cornerCoords[SelectionConstants.START_INDEX] = this.getPositionFromMouse(event);
            this.selectionTool.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[SelectionConstants.END_INDEX] = this.getPositionFromMouse(event);
            this.selectionTool.onMouseUp(event);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.selectionTool.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent): void {
        this.selectionTool.onMouseEnter(event);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[SelectionConstants.END_INDEX] = this.getPositionFromMouse(event);
            this.selectionTool.onMouseMove(event);
        }
    }

    onKeyboardDown(event: KeyboardEvent): void {
        this.selectionTool.onKeyboardDown(event);
    }

    onKeyboardUp(event: KeyboardEvent): void {
        this.selectionTool.onKeyboardUp(event);
    }

    resetCanvasState(canvas: HTMLCanvasElement): void {
        canvas.style.left = SelectionConstants.DEFAULT_LEFT_POSITION + 'px';
        canvas.style.top = SelectionConstants.DEFAULT_TOP_POSITION + 'px';
        canvas.width = SelectionConstants.DEFAULT_WIDTH;
        canvas.height = SelectionConstants.DEFAULT_HEIGHT;
    }

    clearCorners(): void {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }

    setSelectionSettings(): void {
        this.selectionTool.setFillMode(ToolConstants.FillMode.OUTLINE);
        this.selectionTool.setLineWidth(SelectionConstants.SELECTION_LINE_WIDTH);
        this.selectionTool.setPrimaryColor('white');
        this.selectionTool.setSecondaryColor('black');
        this.drawingService.previewCtx.setLineDash([SelectionConstants.DEFAULT_LINE_DASH, SelectionConstants.DEFAULT_LINE_DASH]);
    }

    resetSelectedToolSettings(): void {
        this.selectionTool.setFillMode(this.selectionToolFillMode);
        this.selectionTool.setLineWidth(this.selectionToolLineWidth);
        this.selectionTool.setPrimaryColor(this.selectionToolPrimaryColor);
        this.selectionTool.setSecondaryColor(this.selectionToolSecondaryColor);
        this.drawingService.previewCtx.setLineDash([]);
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
}
