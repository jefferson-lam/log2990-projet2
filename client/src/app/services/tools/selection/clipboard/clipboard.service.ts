import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as ToolManagerConstants from '@app/constants/tool-manager-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { ToolSelectionService } from '../tool-selection-service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    clipboard: ImageData = new ImageData(1, 1);
    // TODO: add implementation for lasso polygonal
    currentTool: RectangleSelectionService | EllipseSelectionService;
    lastSelectionTool: string = '';
    cornerCoords: Vec2[] = new Array<Vec2>(2);

    constructor(public drawingService: DrawingService, public toolManager: ToolManagerService) {
        toolManager.currentToolSubject.asObservable().subscribe((currentTool: ToolSelectionService) => {
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
            this.cornerCoords = this.currentTool.cornerCoords;
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
            this.changeToSelectionTool(this.lastSelectionTool);

            this.setPastedCanvasPosition({ x: 0, y: 0 });

            this.drawingService.selectionCtx.putImageData(this.clipboard, 0, 0);
            this.currentTool.cornerCoords = this.cornerCoords;
            this.currentTool.isManipulating = true;
            // This boolean is for avoiding behavior of simply moving the previous selection
            this.currentTool.isFromClipboard = true;
        }
    }

    deleteSelection(): void {
        if (this.isSelected(this.drawingService.selectionCanvas)) {
            // Because there are three selection tools, this if else imbrication is inevitable (switch case doesn't work)
            if (this.currentTool instanceof EllipseSelectionService) {
                this.currentTool.undoSelection();
                this.currentTool.fillEllipse(this.drawingService.baseCtx, this.currentTool.cornerCoords, this.currentTool.isCircle);
            } else if (this.currentTool instanceof RectangleSelectionService) {
                this.currentTool.undoSelection();
                this.currentTool.fillRectangle(
                    this.drawingService.baseCtx,
                    this.currentTool.cornerCoords,
                    this.currentTool.selectionWidth,
                    this.currentTool.selectionHeight,
                );
            }
        }
    }

    private setPastedCanvasPosition(topLeft: Vec2): void {
        this.drawingService.previewSelectionCanvas.height = this.clipboard.height;
        this.drawingService.previewSelectionCanvas.width = this.clipboard.width;
        this.drawingService.selectionCanvas.height = this.clipboard.height;
        this.drawingService.selectionCanvas.width = this.clipboard.width;
        this.currentTool.setSelectionCanvasPosition(topLeft);
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
            default:
                return ToolManagerConstants.RECTANGLE_SELECTION_KEY;
        }
    }

    private isSelected(selectionCanvas: HTMLCanvasElement): boolean {
        const isSelectionTool = this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService;
        return isSelectionTool && selectionCanvas.width !== 0 && selectionCanvas.height !== 0;
    }
}
