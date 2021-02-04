import { Location } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToolsInterface } from './tools-interface';
import { ToolsList } from './tools-list';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    @Input() selectedTool: ToolsList;
    @Output() notifyOnToolSelect: EventEmitter<ToolsList> = new EventEmitter<ToolsList>();

    opened: boolean = false;
    shouldRun: boolean;
    ToolsList: typeof ToolsList = ToolsList;
    toolListSelect: string[] = Object.values(ToolsList);

    constructor(private location: Location) {
        this.shouldRun = false;
    }

    TOOLSLIST: ToolsInterface[] = [
        { id: 0, name: 'Crayon', icon: 'create', keyShortcut: '(Touche C)' },
        { id: 1, name: 'Efface', icon: 'delete_outline', keyShortcut: '(Touche E)' },
        { id: 2, name: 'Rectangle', icon: 'crop_portrait', keyShortcut: '(Touche 1)' },
        { id: 3, name: 'Ellipse', icon: 'vignette', keyShortcut: '(Touche 2)' },
        { id: 4, name: 'Polygone', icon: 'brush', keyShortcut: '(Touche 3)' },
        { id: 5, name: 'Ligne', icon: 'trending_flat', keyShortcut: '(Touche L)' },
        { id: 6, name: 'Texte', icon: 'text_format', keyShortcut: '(Touche T)' },
        { id: 7, name: 'Étampe', icon: 'today', keyShortcut: '(Touche D)' },
        { id: 8, name: 'Pipette', icon: 'edit_location', keyShortcut: '(Touche I)' },
        { id: 9, name: 'Rectangle de selection', icon: 'tab_unselected', keyShortcut: '(Touche R)' },
        { id: 10, name: 'Ellipse de selection', icon: 'toys', keyShortcut: '(Touche S)' },
        { id: 11, name: 'Lasso polygonal', icon: 'gps_off', keyShortcut: '(Touche V)' },
        { id: 12, name: 'Sceau de peinture', icon: 'format_color_fill', keyShortcut: '(Touche B)' },
    ];

    onSelectTool(tool: string): void {
        console.log(ToolsList.Pencil);
        console.log(this.selectedTool);
        const toolName = tool as ToolsList;
        if (toolName) {
            this.selectedTool = toolName;
            this.notifyOnToolSelect.emit(toolName);
        }
    }

    toggleOpen(): void {
        this.opened = !this.opened;
    }

    backClick(): void {
        this.location.back();
    }
}
