import { Location } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarToolButton } from '@app/classes/sidebar-tool-buttons';
import { Tool } from '@app/classes/tool';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    @Input() selectedTool: string;
    @Output() notifyOnToolSelect: EventEmitter<Tool> = new EventEmitter<Tool>();
    @Output() notifyEditorNewDrawing: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() currentTool: Tool;

    opened: boolean = false;
    shouldRun: boolean;
    isNewDrawing: boolean;

    constructor(public location: Location, public toolManagerService: ToolManagerService) {
        this.shouldRun = false;
    }

    sidebarToolButtons: SidebarToolButton[] = [
        { id: 0, name: 'Crayon', icon: 'create', keyShortcut: 'c', helpShortcut: '(Touche C)' },
        { id: 1, name: 'Efface', icon: 'delete_outline', keyShortcut: 'e', helpShortcut: '(Touche E)' },
        { id: 2, name: 'Rectangle', icon: 'crop_portrait', keyShortcut: '1', helpShortcut: '(Touche 1)' },
        { id: 3, name: 'Ellipse', icon: 'vignette', keyShortcut: '2', helpShortcut: '(Touche 2)' },
        { id: 4, name: 'Polygone', icon: 'brush', keyShortcut: '3', helpShortcut: '(Touche 3)' },
        { id: 5, name: 'Ligne', icon: 'trending_flat', keyShortcut: 'l', helpShortcut: '(Touche L)' },
        { id: 6, name: 'Texte', icon: 'text_format', keyShortcut: 't', helpShortcut: '(Touche T)' },
        { id: 7, name: 'Étampe', icon: 'today', keyShortcut: 'd', helpShortcut: '(Touche D)' },
        { id: 8, name: 'Pipette', icon: 'edit_location', keyShortcut: 'i', helpShortcut: '(Touche I)' },
        { id: 9, name: 'Rectangle de selection', icon: 'tab_unselected', keyShortcut: 'r', helpShortcut: '(Touche R)' },
        { id: 10, name: 'Ellipse de selection', icon: 'toys', keyShortcut: 's', helpShortcut: '(Touche S)' },
        { id: 11, name: 'Lasso polygonal', icon: 'gps_off', keyShortcut: 'v', helpShortcut: '(Touche V)' },
        { id: 12, name: 'Sceau de peinture', icon: 'format_color_fill', keyShortcut: 'b', helpShortcut: '(Touche B)' },
    ];

    onSelectTool(keyShortcut: string): void {
        this.currentTool = this.toolManagerService.getTool(keyShortcut);
        this.notifyOnToolSelect.emit(this.currentTool);
        this.selectedTool = keyShortcut;
        console.log(this.toolManagerService.currentTool.withJunction);
    }

    openSettings(): void {
        this.opened = true;
    }

    closeSettings(): void {
        this.opened = false;
    }

    backClick(): void {
        this.location.back();
    }

    openNewDrawing(): void {
        this.notifyEditorNewDrawing.emit(this.isNewDrawing);
    }
}
