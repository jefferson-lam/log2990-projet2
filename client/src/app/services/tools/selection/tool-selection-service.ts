import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as SelectionConstants from '@app/constants/selection-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';
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

    constructor(
        drawingService: DrawingService,
        undoRedoService: UndoRedoService,
        public resizerHandlerService: ResizerHandlerService,
        selectionTool: Tool,
    ) {
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
        this.getSelectedToolSettings();
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

    validateCornerCoords(cornerCoords: Vec2[], selectionWidth: number, selectionHeight: number): Vec2[] {
        const tempCoord = Object.assign({}, cornerCoords[SelectionConstants.START_INDEX]);
        if (selectionHeight < 0 && selectionWidth < 0) {
            cornerCoords[SelectionConstants.START_INDEX] = cornerCoords[SelectionConstants.END_INDEX];
            cornerCoords[SelectionConstants.END_INDEX] = tempCoord;
        } else if (selectionWidth < 0 && selectionHeight > 0) {
            cornerCoords[SelectionConstants.START_INDEX].x = cornerCoords[SelectionConstants.END_INDEX].x;
            cornerCoords[SelectionConstants.END_INDEX].x = tempCoord.x;
        } else if (selectionWidth > 0 && selectionHeight < 0) {
            cornerCoords[SelectionConstants.START_INDEX].y = cornerCoords[SelectionConstants.END_INDEX].y;
            cornerCoords[SelectionConstants.END_INDEX].y = tempCoord.y;
        }
        return cornerCoords;
    }

    getSelectedToolSettings(): void {
        this.selectionToolLineWidth = this.selectionTool.lineWidth!;
        this.selectionToolFillMode = this.selectionTool.fillMode!;
        this.selectionToolPrimaryColor = this.selectionTool.primaryColor!;
        this.selectionToolSecondaryColor = this.selectionTool.secondaryColor!;
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
