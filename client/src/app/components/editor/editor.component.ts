import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { NewDrawingBoxComponent } from '@app/components/sidebar/new-drawing-box/new-drawing-box.component';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
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
        if (event.key.match(/^(1|2|c|l|e|r|s)$/)) {
            this.setTool(this.toolManager.selectTool(event));
        } else if (event.ctrlKey && event.code === 'KeyO') {
            event.preventDefault();
            this.openModalPopUp();
        } else if (event.ctrlKey && event.code === 'KeyZ') {
            // TODO: lineTool can have mouseup and be drawing
            if (!this.currentTool.inUse) {
                if (event.shiftKey) {
                    this.undoRedoService.redo();
                } else {
                    this.undoRedoService.undo();
                }
            }
        } else if (event.ctrlKey && event.code === 'KeyA') {
            event.preventDefault();
            this.currentTool = this.toolManager.getTool('r');
            if (this.currentTool instanceof RectangleSelectionService) {
                this.currentTool.selectAll();
            }
        } else if (event.key === 'Escape') {
            if (this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService) {
                this.currentTool.onKeyboardDown(event);
            }
        }
    }

    @HostListener('window:keyup', ['$event'])
    onKeyboardUp(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            if (this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService) {
                this.currentTool.onKeyboardUp(event);
            }
        }
    }

    updateToolFromSidebarClick(newTool: Tool): void {
        this.setTool(newTool);
    }

    setTool(newTool: Tool): void {
        if (this.currentTool != newTool) {
            if (this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService) {
                if (this.currentTool.isManipulating) {
                    const emptyMouseEvent: MouseEvent = {} as MouseEvent;
                    this.currentTool.onMouseDown(emptyMouseEvent);
                } else if (this.currentTool.inUse) {
                    const resetKeyboardEvent: KeyboardEvent = {
                        key: 'Escape',
                    } as KeyboardEvent;
                    this.currentTool.isEscapeDown = true;
                    this.currentTool.onKeyboardUp(resetKeyboardEvent);
                }
            }
            this.currentTool = newTool;
        }
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
