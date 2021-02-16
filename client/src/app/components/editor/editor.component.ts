import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { NewDrawingBoxComponent } from '@app/components/sidebar/new-drawing-box/new-drawing-box.component';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    isNewDrawing: boolean = false;
    currentTool: Tool;

    constructor(public toolManager: ToolManagerService, public newDialog: MatDialog, public settingsManager: SettingsManagerService) {
        this.currentTool = toolManager.currentTool;
        this.settingsManager.editorComponent = this;
    }

    @HostListener('window:keydown', ['$event'])
    onKeyboardDown(event: KeyboardEvent): void {
        if (event.key.match(/^(1|2|c|l|e)$/)) {
            this.currentTool = this.toolManager.selectTool(event);
        }
        // problem with openModalPopUp and isNewDrawing value
        else if (event.ctrlKey && event.key === 'o') {
            event.preventDefault();
            this.openModalPopUp();
        }
    }

    updateToolFromSidebarClick(newTool: Tool): void {
        this.currentTool = newTool;
    }

    openModalPopUp(): void {
        this.isNewDrawing = !this.isNewDrawing;
        if (this.isNewDrawing) {
            this.newDialog.open(NewDrawingBoxComponent, {
                width: '100px;',
                height: '200px',
            });
        }
    }

    toggleNewDrawing(fun: boolean): void {
        this.isNewDrawing = fun;
        this.openModalPopUp();
    }
}
