import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { ClipboardCommand } from './clipboard-command';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    // TODO: change imagedata initialization values to 1, this is for tests
    clipboard: ImageData = new ImageData(1, 1);
    // TODO: add implementation for lasso polygonal
    currentTool: RectangleSelectionService | EllipseSelectionService;
    command: ClipboardCommand;
    isPasted: boolean = false;

    constructor(private drawingService: DrawingService, private toolManager: ToolManagerService) {
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
        }
    }

    cutSelection(): void {
        this.copySelection();
        // this.undoRedoService.executeCommand(this.command);
        this.deleteSelection();
    }

    pasteSelection(): void {
        if (this.clipboard.data.some((pixel) => pixel !== 0)) {
            // this.command = new ClipboardCommand(this.drawingService.baseCtx, this.drawingService.selectionCanvas, this);
            if (this.isSelected(this.drawingService.selectionCanvas)) {
                this.currentTool.undoSelection();
            }
            this.drawingService.selectionCanvas.height = this.clipboard.height;
            this.drawingService.selectionCanvas.width = this.clipboard.width;
            this.drawingService.selectionCanvas.style.left = 0 + 'px';
            this.drawingService.selectionCanvas.style.top = 0 + 'px';
            this.drawingService.selectionCtx.putImageData(this.clipboard, 0, 0);
            this.currentTool.isManipulating = true;
            this.isPasted = true;
            // TODO: change currentTool to selection tool
            // this.toolManager.selectTool()
            // TODO: add boolean in selection tools commands to not act like pasting is just moving the previous selection
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

    changeToSelectionTool(): void {}

    private isSelected(selectionCanvas: HTMLCanvasElement): boolean {
        return this.isSelectionTool() && selectionCanvas.width !== 0 && selectionCanvas.height !== 0;
    }

    private isSelectionTool(): boolean {
        return this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService;
    }
}
