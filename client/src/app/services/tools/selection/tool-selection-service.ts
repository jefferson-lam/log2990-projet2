import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as SelectionConstants from '@app/constants/selection-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService extends Tool {
    selectionTool: Tool;
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
        this.setSelectionSettings();
        this.selectionTool.onMouseDown(event);
    }

    onMouseUp(event: MouseEvent): void {
        this.selectionTool.onMouseUp(event);
    }

    onMouseLeave(event: MouseEvent): void {
        this.selectionTool.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent): void {
        this.selectionTool.onMouseEnter(event);
    }

    onMouseMove(event: MouseEvent): void {
        this.selectionTool.onMouseMove(event);
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

    setSelectionSettings(): void {
        this.drawingService.baseCtx.fillStyle = '#fffff';
        this.selectionTool.setFillMode(ToolConstants.FillMode.OUTLINE);
        this.selectionTool.setLineWidth(SelectionConstants.SELECTION_LINE_WIDTH);
        this.selectionTool.setPrimaryColor('white');
        this.selectionTool.setSecondaryColor('black');
        this.drawingService.previewCtx.setLineDash([SelectionConstants.DEFAULT_LINE_DASH, SelectionConstants.DEFAULT_LINE_DASH]);
    }

    resetSelectedToolSettings(): void {
        this.drawingService.baseCtx.fillStyle = 'black';
        this.selectionTool.setFillMode(this.selectionToolFillMode);
        this.selectionTool.setLineWidth(this.selectionToolLineWidth);
        this.selectionTool.setPrimaryColor(this.selectionToolPrimaryColor);
        this.selectionTool.setSecondaryColor(this.selectionToolSecondaryColor);
        this.drawingService.previewCtx.setLineDash([]);
    }
}
