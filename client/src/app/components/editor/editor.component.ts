import { Component, HostListener } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { RECTANGLE_SELECTION_KEY } from '@app/constants/tool-manager-constants';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { PopupManagerService } from '@app/services/manager/popup-manager.service';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    currentTool: Tool;
    isUndoSelection: boolean;

    constructor(
        public toolManager: ToolManagerService,
        public settingsManager: SettingsManagerService,
        public undoRedoService: UndoRedoService,
        public canvasGridService: CanvasGridService,
        public popupManager: PopupManagerService,
    ) {
        this.currentTool = toolManager.currentTool;
        this.settingsManager.editorComponent = this;
        this.isUndoSelection = false;
    }

    @HostListener('window:keydown.control.e', ['$event'])
    onCtrlEKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        this.popupManager.openExportPopUp();
    }

    @HostListener('window:keydown.control.o', ['$event'])
    onCtrlOKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        this.popupManager.openNewDrawingPopUp();
    }

    @HostListener('window:keydown.control.s', ['$event'])
    onCtrlSKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        this.popupManager.openSavePopUp();
    }

    @HostListener('window:keydown.control.shift.z', ['$event'])
    onCtrlShiftZKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.popupManager.isPopUpOpen && !this.currentTool.inUse) {
            this.undoRedoService.redo();
        }
    }

    @HostListener('window:keydown.control.z', ['$event'])
    onCtrlZKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService) {
            if (this.currentTool.isManipulating) {
                this.currentTool.undoSelection();
                this.isUndoSelection = true;
            }
        }
        if (!this.popupManager.isPopUpOpen && !this.currentTool.inUse && !this.isUndoSelection) {
            this.undoRedoService.undo();
        }
        this.isUndoSelection = false;
    }

    @HostListener('window:keydown', ['$event'])
    onKeyboardDown(event: KeyboardEvent): void {
        if (!this.popupManager.isPopUpOpen && event.key.match(/^(1|2|c|l|e|r|s|a|3|i)$/)) {
            this.setTool(this.toolManager.selectTool(event));
        }
    }

    @HostListener('window:keydown.control.a', ['$event'])
    onCtrlAKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        this.setTool(this.toolManager.getTool(RECTANGLE_SELECTION_KEY));
        if (this.currentTool instanceof RectangleSelectionService) {
            this.currentTool.selectAll();
        }
    }

    @HostListener('window:keydown.g', ['$event'])
    showGridOnCanvas(): void {
        this.canvasGridService.toggleGrid();
    }

    @HostListener('window:keydown.-', ['$event'])
    reduceGridSize(): void {
        this.canvasGridService.reduceGridSize();
    }

    @HostListener('window:keydown.+', ['$event'])
    @HostListener('window:keydown.=', ['$event'])
    increaseGridSize(): void {
        this.canvasGridService.increaseGridSize();
    }

    setTool(newTool: Tool): void {
        this.currentTool = newTool;
    }
}
