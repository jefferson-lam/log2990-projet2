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

    constructor() {
        this.shouldRun = false;
    }

    TOOLSLIST: ToolsInterface[] = [
        { id: 0, name: 'Crayon', icon: 'create' },
        { id: 1, name: 'Efface', icon: 'delete_outline' },
        { id: 2, name: 'Rectangle', icon: 'crop_portrait' },
        { id: 3, name: 'Ellipse', icon: 'vignette' },
        { id: 4, name: 'Airbrush', icon: 'brush' },
        { id: 5, name: 'Color-Picker', icon: 'format_color_fill' },
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

}
