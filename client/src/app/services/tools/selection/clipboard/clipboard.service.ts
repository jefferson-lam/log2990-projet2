import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as ToolManagerConstants from '@app/constants/tool-manager-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseClipboardCommand } from '@app/services/tools/selection/clipboard/ellipse-clipboard-command';
import { LassoClipboardCommand } from '@app/services/tools/selection/clipboard/lasso-clipboard-command';
import { RectangleClipboardCommand } from '@app/services/tools/selection/clipboard/rectangle-clipboard-command';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { LassoSelectionService } from '@app/services/tools/selection/lasso/lasso-selection';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    outlineClipboard: ImageData;
    clipboard: ImageData;
    currentTool: RectangleSelectionService | EllipseSelectionService | LassoSelectionService;
    lastSelectionTool: string;
    pathData: Vec2[];
    isPasted: boolean;
    isCircle: boolean;
    selectionHeight: number;
    selectionWidth: number;

    constructor(
        public drawingService: DrawingService,
        public toolManager: ToolManagerService,
        public undoRedoService: UndoRedoService,
        public resizerHandlerService: ResizerHandlerService,
    ) {
        toolManager.currentToolSubject.asObservable().subscribe((currentTool) => {
            if (
                currentTool instanceof RectangleSelectionService ||
                currentTool instanceof EllipseSelectionService ||
                currentTool instanceof LassoSelectionService
            ) {
                this.currentTool = currentTool;
            }
        });
        this.lastSelectionTool = '';
        this.pathData = new Array<Vec2>();
        this.isPasted = false;
        this.outlineClipboard = new ImageData(1, 1);
        this.clipboard = new ImageData(1, 1);
    }

    copySelection(): void {
        if (this.isSelected()) {
            this.clipboard = this.drawingService.selectionCtx.getImageData(
                0,
                0,
                this.drawingService.selectionCanvas.width,
                this.drawingService.selectionCanvas.height,
            );
            this.outlineClipboard = this.drawingService.borderCtx.getImageData(
                0,
                0,
                this.drawingService.borderCanvas.width,
                this.drawingService.borderCanvas.height,
            );
            this.pathData = Object.assign([], this.currentTool.pathData);
            this.lastSelectionTool = this.getCurrentSelectionToolName();
            this.isPasted = false;
        }
    }

    cutSelection(): void {
        this.copySelection();
        this.deleteSelection();
    }

    pasteSelection(): void {
        if (this.isClipboardEmpty()) {
            return;
        }
        if (this.isSelected()) {
            this.currentTool.confirmSelection();
        }
        this.changeToSelectionTool(this.lastSelectionTool);
        this.setPastedCanvasPosition();
        this.drawingService.selectionCtx.putImageData(this.clipboard, 0, 0);
        this.drawingService.borderCtx.putImageData(this.outlineClipboard, 0, 0);
        this.resizerHandlerService.setResizerPositions(this.drawingService.selectionCanvas);
        this.pathData = Object.assign([], this.currentTool.pathData);
        this.currentTool.isManipulating = true;
        // This boolean is for avoiding behavior of simply moving the previous selection
        this.currentTool.isFromClipboard = true;
        this.isPasted = true;
    }

    deleteSelection(): void {
        if (!this.isPasted && this.isSelected()) {
            this.pathData = Object.assign([], this.currentTool.pathData);
            this.deleteEllipse();
            this.deleteRectangle();
            this.deleteLasso();
        }
        this.undoSelection();
        this.isPasted = false;
    }

    isClipboardEmpty(): boolean {
        return !this.clipboard.data.some((pixel) => pixel !== 0);
    }

    isSelected(): boolean {
        const isSelectionTool =
            this.currentTool instanceof RectangleSelectionService ||
            this.currentTool instanceof EllipseSelectionService ||
            this.currentTool instanceof LassoSelectionService;
        return isSelectionTool && this.drawingService.selectionCanvas.width !== 0 && this.drawingService.selectionCanvas.height !== 0;
    }

    private undoSelection(): void {
        this.currentTool.resetSelectedToolSettings();
        this.currentTool.resetCanvasState(this.drawingService.selectionCanvas);
        this.currentTool.resetCanvasState(this.drawingService.previewSelectionCanvas);
        this.currentTool.resetCanvasState(this.drawingService.borderCanvas);
        this.currentTool.resizerHandlerService.resetResizers();
        this.currentTool.isManipulating = false;
        this.currentTool.isEscapeDown = false;
    }

    private deleteEllipse(): void {
        if (this.currentTool instanceof EllipseSelectionService) {
            this.isCircle = this.currentTool.isCircle;
            const command = new EllipseClipboardCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
        }
    }

    private deleteRectangle(): void {
        if (this.currentTool instanceof RectangleSelectionService) {
            this.selectionHeight = this.currentTool.selectionHeight;
            this.selectionWidth = this.currentTool.selectionWidth;
            const command = new RectangleClipboardCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
        }
    }

    private deleteLasso(): void {
        if (this.currentTool instanceof LassoSelectionService) {
            const command = new LassoClipboardCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
        }
    }

    private setPastedCanvasPosition(): void {
        this.drawingService.previewSelectionCanvas.height = this.clipboard.height;
        this.drawingService.previewSelectionCanvas.width = this.clipboard.width;
        this.drawingService.selectionCanvas.height = this.clipboard.height;
        this.drawingService.selectionCanvas.width = this.clipboard.width;
        this.drawingService.borderCanvas.height = this.clipboard.height;
        this.drawingService.borderCanvas.width = this.clipboard.width;

        this.drawingService.selectionCanvas.style.left = 0 + 'px';
        this.drawingService.selectionCanvas.style.top = 0 + 'px';
        this.drawingService.previewSelectionCanvas.style.left = 0 + 'px';
        this.drawingService.previewSelectionCanvas.style.top = 0 + 'px';
        this.drawingService.borderCanvas.style.left = '0px';
        this.drawingService.borderCanvas.style.top = '0px';
    }

    private changeToSelectionTool(lastSelectionTool: string): void {
        this.toolManager.selectTool(lastSelectionTool);
    }

    private getCurrentSelectionToolName(): string {
        switch (this.currentTool.constructor) {
            case LassoSelectionService:
                return ToolManagerConstants.LASSO_SELECTION_KEY;
            case EllipseSelectionService:
                return ToolManagerConstants.ELLIPSE_SELECTION_KEY;
            default:
                return ToolManagerConstants.RECTANGLE_SELECTION_KEY;
        }
    }
}
