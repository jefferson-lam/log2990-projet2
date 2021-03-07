import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SidebarToolButton } from '@app/classes/sidebar-tool-buttons';
import { Tool } from '@app/classes/tool';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnChanges {
    @Output() notifyOnToolSelect: EventEmitter<Tool> = new EventEmitter<Tool>();
    @Output() newDrawingClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() currentTool: Tool;
    @Input() isUndoPossible: boolean = false;
    @Input() isRedoPossible: boolean = false;
    @Input() selectedTool: SidebarToolButton;
    @Input() isCanvasEmpty: boolean;
    opened: boolean = false;
    shouldRun: boolean;

    sidebarToolButtons: SidebarToolButton[] = [
        { service: 'PencilService', name: 'Crayon', icon: 'create', keyShortcut: 'c', helpShortcut: '(Touche C)' },
        { service: 'EraserService', name: 'Efface', icon: 'settings_cell', keyShortcut: 'e', helpShortcut: '(Touche E)' },
        { service: 'RectangleService', name: 'Rectangle', icon: 'crop_5_4', keyShortcut: '1', helpShortcut: '(Touche 1)' },
        { service: 'EllipseService', name: 'Ellipse', icon: 'panorama_fish_eye', keyShortcut: '2', helpShortcut: '(Touche 2)' },
        { service: 'PolygoneService', name: 'Polygone', icon: 'signal_cellular_null', keyShortcut: '3', helpShortcut: '(Touche 3)' },
        { service: 'LineService', name: 'Ligne', icon: 'remove', keyShortcut: 'l', helpShortcut: '(Touche L)' },
        { service: 'TextService', name: 'Texte', icon: 'text_format', keyShortcut: 't', helpShortcut: '(Touche T)' },
        { service: 'StampService', name: 'Étampe', icon: 'how_to_vote', keyShortcut: 'd', helpShortcut: '(Touche D)' },
        { service: 'PipetteService', name: 'Pipette', icon: 'invert_colors', keyShortcut: 'i', helpShortcut: '(Touche I)' },
        { service: 'RectangleSelectionService', name: 'Rectangle de Selection', icon: 'blur_linear', keyShortcut: 'r', helpShortcut: '(Touche R)' },
        { service: 'EllipseSelectionService', name: 'Ellipse de selection', icon: 'blur_circular', keyShortcut: 's', helpShortcut: '(Touche S)' },
        { service: 'SelectLassoService', name: 'Lasso polygonal', icon: 'gesture', keyShortcut: 'v', helpShortcut: '(Touche V)' },
        { service: 'PaintBucketService', name: 'Sceau de peinture', icon: 'format_color_fill', keyShortcut: 'b', helpShortcut: '(Touche C)' },
    ];

    constructor(public toolManagerService: ToolManagerService, private undoRedoService: UndoRedoService) {
        this.shouldRun = false;
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

    openSettings(): void {
        this.opened = true;
    }

    closeSettings(): void {
        this.opened = false;
    }

    openNewDrawing(): void {
        this.newDrawingClicked.emit(true);
    }

    undo(): void {
        if (!this.currentTool.inUse) {
            this.undoRedoService.undo();
        }
    }

    redo(): void {
        if (!this.currentTool.inUse) {
            this.undoRedoService.redo();
        }
    }
}
