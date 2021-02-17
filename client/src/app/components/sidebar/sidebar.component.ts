import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SidebarToolButton } from '@app/classes/sidebar-tool-buttons';
import { Tool } from '@app/classes/tool';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnChanges {
    @Output() notifyOnToolSelect: EventEmitter<Tool> = new EventEmitter<Tool>();
    @Output() notifyEditorNewDrawing: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() currentTool: Tool;

    sidebarToolButtons: Map<string, SidebarToolButton> = new Map();
    @Input() selectedTool: SidebarToolButton;
    opened: boolean = false;
    shouldRun: boolean;
    isNewDrawing: boolean;

    constructor(public location: Location, public toolManagerService: ToolManagerService) {
        this.shouldRun = false;
        this.bindSidebarButtons();
        this.selectedTool = this.sidebarToolButtons.get('PencilService') as SidebarToolButton;
    }

    ngOnChanges(changes: SimpleChanges): void {
        const newTool = changes.currentTool.currentValue;
        if (newTool != undefined) {
            const serviceName = newTool.constructor.name;
            this.selectedTool = this.sidebarToolButtons.get(serviceName) as SidebarToolButton;
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
        this.notifyEditorNewDrawing.emit(this.isNewDrawing);
    }

    private bindSidebarButtons(): void {
        this.sidebarToolButtons
            .set('PencilService', { name: 'Crayon', icon: 'create', keyShortcut: 'c', helpShortcut: '(Touche C)' })
            .set('EraserService', { name: 'Efface', icon: 'settings_cell', keyShortcut: 'e', helpShortcut: '(Touche E)' })
            .set('RectangleService', { name: 'Rectangle', icon: 'crop_5_4', keyShortcut: '1', helpShortcut: '(Touche 1)' })
            .set('EllipseService', { name: 'Ellipse', icon: 'panorama_fish_eye', keyShortcut: '2', helpShortcut: '(Touche 2)' })
            .set('PolygoneService', { name: 'Polygone', icon: 'signal_cellular_null', keyShortcut: '3', helpShortcut: '(Touche 3)' })
            .set('LineService', { name: 'Ligne', icon: 'remove', keyShortcut: 'l', helpShortcut: '(Touche L)' })
            .set('TextService', { name: 'Texte', icon: 'text_format', keyShortcut: 't', helpShortcut: '(Touche T)' })
            .set('StampService', { name: 'Étampe', icon: 'how_to_vote', keyShortcut: 'd', helpShortcut: '(Touche D)' })
            .set('PipetteService', { name: 'Pipette', icon: 'invert_colors', keyShortcut: 'i', helpShortcut: '(Touche I)' })
            .set('SelectRectangleService', { name: 'Rectangle de Selection', icon: 'blur_linear', keyShortcut: 'r', helpShortcut: '(Touche R)' })
            .set('SelectEllipseService', { name: 'Ellipse de selection', icon: 'blur_circular', keyShortcut: 's', helpShortcut: '(Touche S)' })
            .set('SelectLassoService', { name: 'Lasso polygonal', icon: 'gesture', keyShortcut: 'v', helpShortcut: '(Touche V)' })
            .set('PaintBucketService', { name: 'Sceau de peinture', icon: 'format_color_fill', keyShortcut: 'b', helpShortcut: '(Touche C)' });
    }
}
