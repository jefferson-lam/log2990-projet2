import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ExportDrawingComponent } from '@app/components/sidebar/export-drawing/export-drawing.component';
import { NewDrawingBoxComponent } from '@app/components/sidebar/new-drawing-box/new-drawing-box.component';
import { SaveDrawingComponent } from '@app/components/sidebar/save-drawing-page/save-drawing.component';
import { WHITE_RGBA_DECIMAL } from '@app/constants/color-constants';
import { MAX_HEIGHT_FORM, MAX_WIDTH_FORM } from '@app/constants/popup-constants';
import { RECTANGLE_SELECTION_KEY } from '@app/constants/tool-manager-constants';
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
export class EditorComponent implements OnInit {
    cornerCoords: Vec2[] = [];

    currentTool: Tool;
    isPopUpOpen: boolean;
    isUndoSelection: boolean;
    // fontStyle: string = 'Arial';
    // fontFamily: string;
    // fontSize: number = TextConstants.INIT_FONT_SIZE;
    // textAlignment: string = 'center';
    // textBold: boolean = false;
    // textItalic: boolean = false;
    // visibility: string = 'hidden';

    @ViewChild('canvasTextBox', { static: false }) canvasTextBox: ElementRef<HTMLElement>;

    constructor(
        public toolManager: ToolManagerService,
        public newDialog: MatDialog,
        public settingsManager: SettingsManagerService,
        public undoRedoService: UndoRedoService,
    ) {
        this.currentTool = toolManager.currentTool;
        this.settingsManager.editorComponent = this;
        this.isPopUpOpen = false;
        this.isUndoSelection = false;
    }

    ngOnInit(): void {
        this.newDialog.afterAllClosed.subscribe(() => {
            this.isPopUpOpen = false;
        });
    }

    @HostListener('window:keydown.control.e', ['$event'])
    onCtrlEKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        this.openExportPopUp();
    }

    @HostListener('window:keydown.control.o', ['$event'])
    onCtrlOKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        this.openNewDrawingPopUp();
    }

    @HostListener('window:keydown.control.s', ['$event'])
    onCtrlSKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        this.openSavePopUp();
    }

    @HostListener('window:keydown.control.shift.z', ['$event'])
    onCtrlShiftZKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isPopUpOpen && !this.currentTool.inUse) {
            this.undoRedoService.redo();
        }
    }

    @HostListener('window:keydown.control.z', ['$event'])
    onCtrlZKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService) {
            if (this.currentTool.isManipulating) {
                this.currentTool.undoSelection();
                this.isUndoSelection = true;
            }
        }
        if (!this.isPopUpOpen && !this.currentTool.inUse && !this.isUndoSelection) {
            this.undoRedoService.undo();
        }
        this.isUndoSelection = false;
    }

    @HostListener('window:keydown', ['$event'])
    onKeyboardDown(event: KeyboardEvent): void {
        if (!this.isPopUpOpen && event.key.match(/^(1|2|c|l|e|r|s|a|3|i|t)$/)) {
            this.setTool(this.toolManager.selectTool(event));
        }
    }

    @HostListener('window:keydown.control.a', ['$event'])
    onCtrlAKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        this.setTool(this.toolManager.getTool(RECTANGLE_SELECTION_KEY));
        if (this.currentTool instanceof RectangleSelectionService) {
            this.currentTool.selectAll();
        }
    }

    // @HostListener('mouseup', ['$event'])
    // setInitialPositionTextBox(): void {
    //     if (this.currentTool instanceof TextService) {
    //         this.canvasTextBox.nativeElement.style.visibility = 'visible';
    //         this.canvasTextBox.nativeElement.style.left = this.cornerCoords[TextConstants.START_INDEX].x + 'px';
    //         this.canvasTextBox.nativeElement.style.top = this.cornerCoords[TextConstants.START_INDEX].y + 'px';
    //     }
    // }

    setTool(newTool: Tool): void {
        this.currentTool = newTool;
    }

    openExportPopUp(): void {
        if (!this.isPopUpOpen) {
            if (this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService) {
                this.currentTool.onToolChange();
            }
            this.newDialog.open(ExportDrawingComponent, {
                maxWidth: MAX_WIDTH_FORM + 'px',
                maxHeight: MAX_HEIGHT_FORM + 'px',
            });
            this.isPopUpOpen = true;
        }
    }

    openNewDrawingPopUp(): void {
        if (!this.isCanvasEmpty() && !this.isPopUpOpen) {
            if (this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService) {
                this.currentTool.onToolChange();
            }
            this.newDialog.open(NewDrawingBoxComponent);
            this.isPopUpOpen = true;
        }
    }

    openSavePopUp(): void {
        if (!this.isCanvasEmpty() && !this.isPopUpOpen) {
            if (this.currentTool instanceof RectangleSelectionService || this.currentTool instanceof EllipseSelectionService) {
                this.currentTool.onToolChange();
            }
            this.newDialog.open(SaveDrawingComponent);
            this.isPopUpOpen = true;
        }
    }

    isCanvasEmpty(): boolean {
        // Thanks to user Kaiido on stackoverflow.com
        // https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank/17386803#comment96825186_17386803
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const baseCtx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
        const pixelBuffer = new Uint32Array(baseCtx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
        return !pixelBuffer.some((color) => color !== WHITE_RGBA_DECIMAL);
    }
}
