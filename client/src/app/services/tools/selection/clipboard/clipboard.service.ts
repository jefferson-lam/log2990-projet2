import { Injectable } from '@angular/core';
import * as ToolManagerConstants from '@app/constants/tool-manager-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    // TODO: change imagedata initialization values to 1, this is for tests
    clipboard: ImageData = new ImageData(1, 1);
    // TODO: add implementation for lasso polygonal
    currentTool: RectangleSelectionService | EllipseSelectionService;
    lastSelectionTool: string;

    constructor(public drawingService: DrawingService, public toolManager: ToolManagerService, public undoRedoService: UndoRedoService) {
        this.toolManager.currentToolSubject.asObservable().subscribe((currentTool) => {
            if (currentTool instanceof RectangleSelectionService || currentTool instanceof EllipseSelectionService) {
                this.currentTool = currentTool;
            }
        });
    }

    copySelection(): void {
        if (this.isSelected(this.drawingService.selectionCanvas)) {
            this.clipboard = this.drawingService.selectionCtx.getImageData(
                0,
                0,
                this.drawingService.selectionCanvas.width,
                this.drawingService.selectionCanvas.height,
            );
            this.lastSelectionTool = this.getCurrentSelectionToolName();
        }
    }

    cutSelection(): void {
        this.copySelection();
        this.deleteSelection();
    }

    pasteSelection(): void {
        if (this.clipboard.data.some((pixel) => pixel !== 0)) {
            if (this.isSelected(this.drawingService.selectionCanvas)) {
                this.currentTool.onMouseDown({} as MouseEvent);
            }
            this.drawingService.selectionCanvas.height = this.clipboard.height;
            this.drawingService.selectionCanvas.width = this.clipboard.width;
            this.drawingService.selectionCanvas.style.left = 0 + 'px';
            this.drawingService.selectionCanvas.style.top = 0 + 'px';
            this.drawingService.selectionCtx.putImageData(this.clipboard, 0, 0);
            this.currentTool.isManipulating = true;
            // this.command.setValues(this.drawingService.baseCtx, this.drawingService.selectionCanvas, this);
            // this.command.execute();
            this.changeToSelectionTool(this.lastSelectionTool);
            // This boolean is for avoiding behavior of simply moving the previous selection
            this.currentTool.isFromClipboard = true;

            // This simulates a mouse click on the corner of the canvas to automatically
            // select the pasted selection
            // const topLeftMouseClick: MouseEvent = { x: this.clipboard.width / 2, y: this.clipboard.height / 2 } as MouseEvent;
            // this.currentTool.onMouseDown(topLeftMouseClick);
        }
    }

    deleteSelection(): void {
        if (this.isSelected(this.drawingService.selectionCanvas)) {
            this.currentTool.undoSelection();
            if (this.currentTool instanceof EllipseSelectionService) {
                this.currentTool.fillEllipse(this.drawingService.baseCtx, this.currentTool.cornerCoords, this.currentTool.isCircle, 'white');
            } else if (this.currentTool instanceof RectangleSelectionService) {
                this.currentTool.fillRectangle(
                    this.drawingService.baseCtx,
                    this.currentTool.cornerCoords,
                    this.currentTool.selectionWidth,
                    this.currentTool.selectionHeight,
                    'white',
                );
            }
        }
    }

    private changeToSelectionTool(lastSelectionTool: string): void {
        const selectionKeyEvent: KeyboardEvent = {
            key: lastSelectionTool,
        } as KeyboardEvent;
        this.toolManager.selectTool(selectionKeyEvent);
    }

    private getCurrentSelectionToolName(): string {
        switch (this.currentTool.constructor) {
            case EllipseSelectionService:
                return ToolManagerConstants.ELLIPSE_SELECTION_KEY;
            case RectangleSelectionService:
                return ToolManagerConstants.RECTANGLE_SELECTION_KEY;
            default:
                return '';
        }
    }

    private isSelected(selectionCanvas: HTMLCanvasElement): boolean {
        const isSelectionTool = this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService;
        return isSelectionTool && selectionCanvas.width !== 0 && selectionCanvas.height !== 0;
    }
}
