import { Component } from '@angular/core';
import { ToolsList } from './tools-interface';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    selectedTool: ToolsList;

    TOOLSLIST: ToolsList[] = [
        { id: 0, name: 'Pencil', icon: 'create' },
        { id: 1, name: 'Eraser', icon: 'delete_outline' },
        { id: 2, name: 'Rectangle', icon: 'crop_portrait' },
        { id: 3, name: 'Ellipse', icon: 'vignette' },
        { id: 4, name: 'Airbrush', icon: 'brush' },
        { id: 5, name: 'Color-Picker', icon: 'format_color_fill' },
    ];

    onSelectTool(tool: ToolsList): void {
        this.selectedTool = tool;
    }
}
