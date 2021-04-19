import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as SelectionConstants from '@app/constants/selection-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService extends Tool {
    originalImageCanvas: HTMLCanvasElement;
    originalImageCtx: CanvasRenderingContext2D;

    selectionTool: Tool;
    // Save selectionTool's lineWidth here and fillMode.
    selectionToolLineWidth: number;
    selectionToolFillMode: ToolConstants.FillMode;
    selectionToolPrimaryColor: string;
    selectionToolSecondaryColor: string;
    isManipulating: boolean;

    constructor(
        drawingService: DrawingService,
        undoRedoService: UndoRedoService,
        public resizerHandlerService: ResizerHandlerService,
        selectionTool: Tool,
    ) {
        super(drawingService, undoRedoService);
        this.selectionTool = selectionTool;
        this.originalImageCanvas = document.createElement('canvas');
        this.originalImageCtx = this.originalImageCanvas.getContext('2d') as CanvasRenderingContext2D;
    }

    // implemented in child classes
    // tslint:disable-next-line:no-empty
    undoSelection(): void {}

    onMouseDown(event: MouseEvent): void {
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

    /**
     * Simple swap functions that will always place the top-left corner as the START_INDEX
     * and the bottom-right corner as the END_INDEX, no matter the orientation of the selection
     */
    validateCornerCoords(cornerCoords: Vec2[], selectionWidth: number, selectionHeight: number): Vec2[] {
        const tempCoord = Object.assign({}, cornerCoords[SelectionConstants.START_INDEX]);
        if (selectionHeight < 0 && selectionWidth < 0) {
            cornerCoords[SelectionConstants.START_INDEX] = cornerCoords[SelectionConstants.END_INDEX];
            cornerCoords[SelectionConstants.END_INDEX] = tempCoord;
        } else if (selectionWidth < 0) {
            cornerCoords[SelectionConstants.START_INDEX].x = cornerCoords[SelectionConstants.END_INDEX].x;
            cornerCoords[SelectionConstants.END_INDEX].x = tempCoord.x;
        } else if (selectionHeight < 0) {
            cornerCoords[SelectionConstants.START_INDEX].y = cornerCoords[SelectionConstants.END_INDEX].y;
            cornerCoords[SelectionConstants.END_INDEX].y = tempCoord.y;
        }
        return cornerCoords;
    }

    /**
     * This function is called uniquely when the user has shift down.
     * Ensures that no matter how the user starts his selection, that the
     * cornerCoords will match the ones displayed on screen.
     */
    computeSquareCoords(cornerCoords: Vec2[], selectionWidth: number, selectionHeight: number): Vec2[] {
        const shortestSide = Math.min(Math.abs(selectionWidth), Math.abs(selectionHeight));
        if (selectionWidth < 0 && selectionHeight < 0) {
            cornerCoords[0] = this.addScalarToVec2(cornerCoords[1], -shortestSide);
        } else if (selectionWidth < 0) {
            if (shortestSide === selectionHeight) {
                cornerCoords[0] = this.addScalarToVec2(cornerCoords[1], -shortestSide);
            }
        } else if (selectionHeight < 0) {
            if (shortestSide === selectionWidth) {
                cornerCoords[0] = this.addScalarToVec2(cornerCoords[1], -shortestSide);
            } else {
                cornerCoords[1] = this.addScalarToVec2(cornerCoords[0], shortestSide);
            }
        }
        return cornerCoords;
    }

    /**
     * Saves the selectionTool's past settings so we can reset to them later.
     */
    getSelectedToolSettings(): void {
        if (this.selectionTool.lineWidth != undefined) {
            this.selectionToolLineWidth = this.selectionTool.lineWidth;
        }
        if (this.selectionTool.fillMode != undefined) {
            this.selectionToolFillMode = this.selectionTool.fillMode;
        }
        if (this.selectionTool.primaryColor != undefined) {
            this.selectionToolPrimaryColor = this.selectionTool.primaryColor;
        }
        if (this.selectionTool.secondaryColor != undefined) {
            this.selectionToolSecondaryColor = this.selectionTool.secondaryColor;
        }
    }

    setSelectionSettings(): void {
        this.drawingService.baseCtx.fillStyle = 'white';
        this.selectionTool.setFillMode(ToolConstants.FillMode.OUTLINE);
        this.selectionTool.setLineWidth(SelectionConstants.SELECTION_LINE_WIDTH);
        this.selectionTool.setPrimaryColor('black');
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

    setSelectionCanvasSize(width: number, height: number): void {
        this.drawingService.selectionCanvas.width = width;
        this.drawingService.selectionCanvas.height = height;
        this.drawingService.previewSelectionCanvas.width = width;
        this.drawingService.previewSelectionCanvas.height = height;
        this.drawingService.borderCanvas.width = width;
        this.drawingService.borderCanvas.height = height;
        this.originalImageCanvas.width = width;
        this.originalImageCanvas.height = height;
    }

    setSelectionCanvasPosition(topLeft: Vec2): void {
        this.drawingService.selectionCanvas.style.left = topLeft.x + 'px';
        this.drawingService.selectionCanvas.style.top = topLeft.y + 'px';
        this.drawingService.previewSelectionCanvas.style.left = topLeft.x + 'px';
        this.drawingService.previewSelectionCanvas.style.top = topLeft.y + 'px';
        this.drawingService.borderCanvas.style.left = topLeft.x + 'px';
        this.drawingService.borderCanvas.style.top = topLeft.y + 'px';
        this.resizerHandlerService.setResizerPositions(this.drawingService.selectionCanvas);
    }

    resetCanvasState(canvas: HTMLCanvasElement): void {
        canvas.style.left = SelectionConstants.DEFAULT_LEFT_POSITION + 'px';
        canvas.style.top = SelectionConstants.DEFAULT_TOP_POSITION + 'px';
        canvas.width = SelectionConstants.DEFAULT_WIDTH;
        canvas.height = SelectionConstants.DEFAULT_HEIGHT;
    }

    addScalarToVec2(point: Vec2, scalar: number): Vec2 {
        return {
            x: point.x + scalar,
            y: point.y + scalar,
        };
    }

    clearCorners(cornerCoords: Vec2[]): Vec2[] {
        return cornerCoords.fill({ x: 0, y: 0 });
    }

    onToolEnter(): void {
        this.getSelectedToolSettings();
        this.setSelectionSettings();
    }

    onToolChange(): void {
        this.resizerHandlerService.inUse = false;
        this.resetSelectedToolSettings();
    }

    resetAllCanvasState(): void {
        this.resetCanvasState(this.drawingService.selectionCanvas);
        this.resetCanvasState(this.drawingService.previewSelectionCanvas);
        this.resetCanvasState(this.drawingService.borderCanvas);
    }
}
