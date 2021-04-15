import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as TextConstants from '@app/constants/text-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextCommand } from '@app/services/tools/text/text-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    primaryColor: string;
    fontSize: number;
    fontStyle: string;
    fontFamily: string;
    fontWeight: string;
    textAlign: string;
    textWidth: number;
    textHeight: number;
    escapeKeyUsed: boolean;
    lockKeyboard: boolean;

    placeHolderSpan: HTMLSpanElement;
    cornerCoords: Vec2[];
    previewCommand: TextCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        const MAX_PATH_DATA_SIZE = 2;
        this.primaryColor = '#b5cf60';
        this.fontSize = TextConstants.INIT_FONT_SIZE;
        this.escapeKeyUsed = false;
        this.lockKeyboard = false;
        this.cornerCoords = new Array<Vec2>(MAX_PATH_DATA_SIZE);
        this.clearCornerCoords();
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse && (!this.lockKeyboard || this.escapeKeyUsed)) {
            this.cornerCoords[TextConstants.START_INDEX] = this.getPositionFromMouse(event);
            this.textWidth = this.cornerCoords[TextConstants.START_INDEX].x;
            this.textHeight = this.cornerCoords[TextConstants.START_INDEX].y;
        }
        if (this.lockKeyboard && !this.escapeKeyUsed) {
            this.drawTextOnCanvas();
            this.lockKeyboard = false;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse && (!this.lockKeyboard || this.escapeKeyUsed)) {
            this.placeHolderSpan.id = 'placeHolderSpan';
            this.placeHolderSpan.innerText = 'Ajoutez du texte ici...';

            this.placeHolderSpan.style.left = this.cornerCoords[TextConstants.START_INDEX].x + 'px';
            this.placeHolderSpan.style.top = this.cornerCoords[TextConstants.START_INDEX].y + 'px';
            this.placeHolderSpan.style.display = 'block';
            this.placeHolderSpan.style.zIndex = '2';
            this.placeHolderSpan.style.visibility = 'visible';

            this.cornerCoords[TextConstants.END_INDEX] = this.getPositionFromMouse(event);
            this.lockKeyboard = true;
            this.escapeKeyUsed = false;
            this.placeHolderSpan.focus();
            this.setSelectedText();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.inUse) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (event.buttons === MouseConstants.PRIMARY_BUTTON && this.inUse) {
            this.inUse = event.button === MouseConstants.MouseButton.Left;
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.inUse = false;
        }
        this.placeHolderSpan.style.color = this.primaryColor;
    }

    drawTextOnCanvas(): void {
        const command: Command = new TextCommand(this.drawingService.baseCtx, this);
        this.undoRedoService.executeCommand(command);
        this.inUse = false;
        this.clearCornerCoords();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.placeHolderSpan.style.visibility = 'hidden';
    }

    setSelectedText(): void {
        const selection = window.getSelection() as Selection;
        const range = document.createRange();
        range.selectNodeContents(this.placeHolderSpan);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    setFontFamily(fontFamily: string): void {
        this.fontFamily = fontFamily;
        this.placeHolderSpan.style.fontFamily = fontFamily;
    }

    setFontSize(fontSize: number): void {
        this.fontSize = fontSize;
        this.placeHolderSpan.style.fontSize = fontSize + 'px';
        this.placeHolderSpan.style.lineHeight = fontSize * TextConstants.LINE_HEIGHT_CONVERSION + 'px';
    }

    setTextAlign(textAlign: string): void {
        this.textAlign = textAlign;
        this.placeHolderSpan.style.textAlign = textAlign;
    }

    setTextBold(textBold: string): void {
        this.fontWeight = textBold;
        this.placeHolderSpan.style.fontWeight = textBold;
    }

    setTextItalic(textItalic: string): void {
        this.fontStyle = textItalic;
        this.placeHolderSpan.style.fontStyle = textItalic;
    }

    setPrimaryColor(newColor: string): void {
        this.primaryColor = newColor;
    }

    private clearCornerCoords(): void {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }

    onToolChange(): void {
        if (this.lockKeyboard && !this.escapeKeyUsed) {
            this.drawTextOnCanvas();
            this.lockKeyboard = false;
        }
    }
}
