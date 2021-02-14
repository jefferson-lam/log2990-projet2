import { Component, HostListener } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    currentTool: Tool;
    constructor(public toolManager: ToolManagerService, public settingsManager: SettingsManagerService) {
        this.currentTool = toolManager.pencilService;
        this.settingsManager.editorComponent = this;
    }

    @HostListener('keypress', ['$event'])
    onKeyboardPress(event: KeyboardEvent): void {
        if (event.key.match(/^(1|2|c|l|e)$/)) {
            this.currentTool = this.toolManager.selectTool(event);
        }
    }
}
