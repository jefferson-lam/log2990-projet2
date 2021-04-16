import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as ToolManagerConstants from '@app/constants/tool-manager-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseClipboardCommand } from '@app/services/tools/selection/clipboard/ellipse-clipboard-command';
import { RectangleClipboardCommand } from '@app/services/tools/selection/clipboard/rectangle-clipboard-command';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    clipboard: ImageData = new ImageData(1, 1);
    currentTool: RectangleSelectionService | EllipseSelectionService;
    lastSelectionTool: string;
    cornerCoords: Vec2[];
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
            if (currentTool instanceof RectangleSelectionService || currentTool instanceof EllipseSelectionService) {
                this.currentTool = currentTool;
            }
        });
        this.lastSelectionTool = '';
        this.cornerCoords = new Array<Vec2>();
        this.isPasted = false;
    }

    copySelection(): void {
        if (this.isSelected(this.drawingService.selectionCanvas)) {
            this.clipboard = this.drawingService.selectionCtx.getImageData(
                0,
                0,
                this.drawingService.selectionCanvas.width,
                this.drawingService.selectionCanvas.height,
            );
            this.cornerCoords = this.currentTool.cornerCoords;
            this.lastSelectionTool = this.getCurrentSelectionToolName();
            this.isPasted = false;
        }
    }

    cutSelection(): void {
        this.copySelection();
        this.deleteSelection();
    }

    pasteSelection(): void {
        if (!this.clipboard.data.some((pixel) => pixel !== 0)) {
            return;
        }
        if (this.isSelected(this.drawingService.selectionCanvas)) {
            this.currentTool.confirmSelection();
        }
        this.changeToSelectionTool(this.lastSelectionTool);
        this.setPastedCanvasPosition();
        this.drawingService.selectionCtx.putImageData(this.clipboard, 0, 0);
        this.resizerHandlerService.setResizerPositions(this.drawingService.selectionCanvas);
        this.currentTool.cornerCoords = this.cornerCoords;
        this.currentTool.isManipulating = true;
        // This boolean is for avoiding behavior of simply moving the previous selection
        this.currentTool.isFromClipboard = true;
        this.isPasted = true;
    }

    deleteSelection(): void {
        if (!this.isPasted && this.isSelected(this.drawingService.selectionCanvas)) {
            this.cornerCoords = Object.assign([], this.currentTool.cornerCoords);
            this.deleteEllipse();
            this.deleteRectangle();
        }
        this.undoSelection();
        this.isPasted = false;
    }

    private undoSelection(): void {
        this.currentTool.resetSelectedToolSettings();
        this.currentTool.resetCanvasState(this.drawingService.selectionCanvas);
        this.currentTool.resetCanvasState(this.drawingService.previewSelectionCanvas);
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
    private setPastedCanvasPosition(): void {
        this.drawingService.previewSelectionCanvas.height = this.clipboard.height;
        this.drawingService.previewSelectionCanvas.width = this.clipboard.width;
        this.drawingService.selectionCanvas.height = this.clipboard.height;
        this.drawingService.selectionCanvas.width = this.clipboard.width;

        this.drawingService.selectionCanvas.style.left = 0 + 'px';
        this.drawingService.selectionCanvas.style.top = 0 + 'px';
        this.drawingService.previewSelectionCanvas.style.left = 0 + 'px';
        this.drawingService.previewSelectionCanvas.style.top = 0 + 'px';
    }

    private changeToSelectionTool(lastSelectionTool: string): void {
        this.toolManager.selectTool(lastSelectionTool);
    }

    private getCurrentSelectionToolName(): string {
        switch (this.currentTool.constructor) {
            case EllipseSelectionService:
                return ToolManagerConstants.ELLIPSE_SELECTION_KEY;
            default:
                return ToolManagerConstants.RECTANGLE_SELECTION_KEY;
        }
    }

    private isSelected(selectionCanvas: HTMLCanvasElement): boolean {
        const isSelectionTool = this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService;
        return isSelectionTool && selectionCanvas.width !== 0 && selectionCanvas.height !== 0;
    }
}
