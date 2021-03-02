import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { ExportDrawingComponent } from '@app/components/sidebar/export-drawing/export-drawing.component';
import { NewDrawingBoxComponent } from '@app/components/sidebar/new-drawing-box/new-drawing-box.component';
import { MAX_HEIGHT_FORM, MAX_WIDTH_FORM } from '@app/constants/popup-constants';
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
        if (event.ctrlKey) {
            event.preventDefault();
            switch (event.code) {
                case 'KeyO':
                    this.openModalPopUp('new');
                    break;
                case 'KeyE':
                    this.openModalPopUp('export');
                    break;
                case 'KeyZ':
                    if (!this.currentTool.inUse) {
                        if (event.shiftKey) {
                            this.undoRedoService.redo();
                        } else {
                            this.undoRedoService.undo();
                        }
                    }
                    break;
                default:
                    break;
            }
        } else if (event.key.match(/^(1|2|c|l|e)$/)) {
            this.currentTool = this.toolManager.selectTool(event);
        }
    }

    updateToolFromSidebarClick(newTool: Tool): void {
        this.currentTool = newTool;
    }

    openModalPopUp(type: string): void {
        if (!this.isCanvasEmpty()) {
            if (type === 'export') {
                this.newDialog.open(ExportDrawingComponent, {
                    maxWidth: MAX_WIDTH_FORM + 'px',
                    maxHeight: MAX_HEIGHT_FORM + 'px',
                });
            } else {
                this.newDialog.open(NewDrawingBoxComponent, {
                    width: '100px',
                    height: '200px',
                });
            }
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
