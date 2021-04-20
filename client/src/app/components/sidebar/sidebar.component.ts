import { Component, Input } from '@angular/core';
import { SidebarToolButton } from '@app/classes/sidebar-tool-buttons';
import { SIDEBAR_TOOL_BUTTONS } from '@app/constants/sidebar-constants';
import { RECTANGLE_SELECTION_KEY } from '@app/constants/tool-manager-constants';
import { PopupManagerService } from '@app/services/manager/popup-manager.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { ClipboardService } from '@app/services/tools/selection/clipboard/clipboard.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { ToolSelectionService } from '@app/services/tools/selection/tool-selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    @Input() selectedTool: SidebarToolButton;
    @Input() isMagnetismOptionsDisplayed: boolean;
    isGridOptionsDisplayed: boolean;
    shouldRun: boolean;

    sidebarToolButtons: SidebarToolButton[];

    constructor(
        public toolManager: ToolManagerService,
        public undoRedoService: UndoRedoService,
        public clipboardService: ClipboardService,
        public popupManager: PopupManagerService,
    ) {
        this.shouldRun = false;
        this.sidebarToolButtons = SIDEBAR_TOOL_BUTTONS;
        this.selectedTool = this.sidebarToolButtons[0];
        this.toolManager.currentToolSubject.asObservable().subscribe((tool) => {
            this.selectedTool = this.sidebarToolButtons.find((sidebarToolButton) => {
                return sidebarToolButton.service === tool.constructor.name;
            }) as SidebarToolButton;
            this.isMagnetismOptionsDisplayed = false;
            this.isGridOptionsDisplayed = false;
        });
    }

    onSelectTool(tool: SidebarToolButton): void {
        this.toolManager.selectTool(tool.keyShortcut);
    }

    openNewDrawing(): void {
        this.popupManager.openNewDrawingPopUp();
    }

    exportDrawing(): void {
        this.popupManager.openExportPopUp();
    }

    saveDrawing(): void {
        this.popupManager.openSavePopUp();
    }

    openGridOptions(): void {
        this.isGridOptionsDisplayed = !this.isGridOptionsDisplayed;
    }

    toggleMagnetismOptions(): void {
        this.isMagnetismOptionsDisplayed = !this.isMagnetismOptionsDisplayed;
    }

    undo(): void {
        if (this.toolManager.currentTool instanceof ToolSelectionService && this.toolManager.currentTool.isManipulating) {
            this.toolManager.currentTool.undoSelection();
        } else {
            this.undoRedoService.undo();
        }
    }

    redo(): void {
        this.undoRedoService.redo();
    }

    selectAll(): void {
        this.toolManager.selectTool(RECTANGLE_SELECTION_KEY);
        (this.toolManager.currentTool as RectangleSelectionService).selectAll();
    }

    copySelection(): void {
        this.clipboardService.copySelection();
    }

    cutSelection(): void {
        this.clipboardService.cutSelection();
    }

    deleteSelection(): void {
        this.clipboardService.deleteSelection();
    }

    pasteSelection(): void {
        this.clipboardService.pasteSelection();
    }
}
