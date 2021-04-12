import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SidebarToolButton } from '@app/classes/sidebar-tool-buttons';
import { Tool } from '@app/classes/tool';
import { SIDEBAR_TOOL_BUTTONS } from '@app/constants/sidebar-constants';
import { RECTANGLE_SELECTION_KEY } from '@app/constants/tool-manager-constants';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnChanges {
    @Output() notifyOnToolSelect: EventEmitter<Tool>;
    @Output() openExportPopUp: EventEmitter<void>;
    @Output() openNewDrawingPopUp: EventEmitter<void>;
    @Output() openSavePopUp: EventEmitter<void>;
    @Input() currentTool: Tool;
    @Input() isUndoPossible: boolean;
    @Input() isRedoPossible: boolean;
    @Input() selectedTool: SidebarToolButton;
    @Input() isCanvasEmpty: boolean;
    @Input() isGridOptionsDisplayed: boolean;
    shouldRun: boolean;
    isUndoSelection: boolean;

    sidebarToolButtons: SidebarToolButton[];

    constructor(public toolManagerService: ToolManagerService, private undoRedoService: UndoRedoService) {
        this.notifyOnToolSelect = new EventEmitter<Tool>();
        this.openExportPopUp = new EventEmitter<void>();
        this.openNewDrawingPopUp = new EventEmitter<void>();
        this.openSavePopUp = new EventEmitter<void>();
        this.isUndoPossible = false;
        this.isRedoPossible = false;
        this.shouldRun = false;
        this.isUndoSelection = false;
        this.sidebarToolButtons = SIDEBAR_TOOL_BUTTONS;
        this.selectedTool = this.sidebarToolButtons[0];
        this.undoRedoService.pileSizeObservable.subscribe((sizes: number[]) => {
            this.isUndoPossible = sizes[0] > 0;
            this.isRedoPossible = sizes[1] > 0;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const newTool = changes.currentTool.currentValue;
        if (newTool != undefined) {
            const serviceName = newTool.constructor.name;
            this.selectedTool = this.sidebarToolButtons.find((sidebarToolButton) => {
                return sidebarToolButton.service === serviceName;
            }) as SidebarToolButton;
        }
    }

    onSelectTool(tool: SidebarToolButton): void {
        this.currentTool = this.toolManagerService.getTool(tool.keyShortcut);
        this.notifyOnToolSelect.emit(this.currentTool);
        this.selectedTool = tool;
    }

    openNewDrawing(): void {
        this.openNewDrawingPopUp.emit();
    }

    exportDrawing(): void {
        this.openExportPopUp.emit();
    }

    saveDrawing(): void {
        this.openSavePopUp.emit();
    }

    openGridOptions(): void {
        this.isGridOptionsDisplayed = !this.isGridOptionsDisplayed;
    }

    undo(): void {
        if (this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService) {
            if (this.currentTool.isManipulating) {
                this.currentTool.undoSelection();
                this.isUndoSelection = true;
            }
        }
        if (!this.currentTool.inUse && !this.isUndoSelection) {
            this.undoRedoService.undo();
        }
        this.isUndoSelection = false;
    }

    redo(): void {
        if (!this.currentTool.inUse) {
            this.undoRedoService.redo();
        }
    }

    selectAll(): void {
        this.currentTool = this.toolManagerService.getTool(RECTANGLE_SELECTION_KEY);
        this.notifyOnToolSelect.emit(this.currentTool);
        if (this.currentTool instanceof RectangleSelectionService) {
            this.currentTool.selectAll();
        }
    }
}
