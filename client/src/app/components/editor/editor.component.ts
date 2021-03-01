import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { NewDrawingBoxComponent } from '@app/components/sidebar/new-drawing-box/new-drawing-box.component';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    currentTool: Tool;

    constructor(
        public toolManager: ToolManagerService,
        public newDialog: MatDialog,
        public settingsManager: SettingsManagerService,
        public undoRedoService: UndoRedoService,
    ) {
        this.currentTool = toolManager.currentTool;
        this.settingsManager.editorComponent = this;
    }

    @HostListener('window:keydown', ['$event'])
    onKeyboardDown(event: KeyboardEvent): void {
        if (event.key.match(/^(1|2|3|c|l|e)$/)) {
            this.currentTool = this.toolManager.selectTool(event);
        } else if (event.ctrlKey && event.code === 'KeyO') {
            event.preventDefault();
            this.openModalPopUp();
        } else if (event.ctrlKey && event.code === 'KeyZ') {
            // TODO : lineTool can have mouseup and be drawing
            if (!this.currentTool.inUse) {
                if (event.shiftKey) {
                    this.undoRedoService.redo();
                } else {
                    this.undoRedoService.undo();
                }
            }
        }
    }

    updateToolFromSidebarClick(newTool: Tool): void {
        this.currentTool = newTool;
    }

    openModalPopUp(): void {
        if (!this.isCanvasEmpty()) {
            this.newDialog.open(NewDrawingBoxComponent, {
                width: '130px;',
                height: '200px',
            });
        }
    }

    isCanvasEmpty(): boolean {
        // Thanks to user Kaiido on stackoverflow.com
        // https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank/17386803#comment96825186_17386803
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const baseCtx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
        const pixelBuffer = new Uint32Array(baseCtx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
        return !pixelBuffer.some((color) => color !== 0);
    }
}
