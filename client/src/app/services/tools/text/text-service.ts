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
    private escapeKeyUsed: boolean;
    lockKeyboard: boolean;
    hasWeightChanged: boolean;
    hasStyleChanged: boolean;
    private hasTextBoxBeenCreated: boolean;

    placeHolderSpan: HTMLSpanElement;
    cornerCoords: Vec2;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        this.primaryColor = '#b5cf60';
        this.fontSize = TextConstants.INIT_FONT_SIZE;
        this.fontFamily = 'Arial';
        this.fontStyle = 'normal';
        this.fontWeight = 'normal';
        this.textAlign = 'center';
        this.escapeKeyUsed = false;
        this.lockKeyboard = false;
        this.hasStyleChanged = false;
        this.hasWeightChanged = false;
        this.cornerCoords = { x: 0, y: 0 };
        this.hasTextBoxBeenCreated = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (!this.inUse) return;
        if (this.lockKeyboard && !this.escapeKeyUsed) {
            this.drawTextOnCanvas();
            return;
        }
        this.createTextBox(event);
    }

    onMouseUp(): void {
        if (!this.inUse) {
            this.hasTextBoxBeenCreated = false;
            return;
        }
        this.placeHolderSpan.focus();
        if (!this.hasTextBoxBeenCreated) {
            this.setSelectedText();
        }
        this.hasTextBoxBeenCreated = true;
    }

    onEscapeKeyDown(): void {
        this.placeHolderSpan.style.display = 'none';
        this.escapeKeyUsed = true;
    }

    private createTextBox(event: MouseEvent): void {
        this.cornerCoords = this.getPositionFromMouse(event);
        this.setSpanValues();
        this.lockKeyboard = true;
        this.escapeKeyUsed = false;
        this.setSelectedText();
    }

    private drawTextOnCanvas(): void {
        const command: Command = new TextCommand(this.drawingService.baseCtx, this);
        this.undoRedoService.executeCommand(command);
        this.inUse = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.placeHolderSpan.style.visibility = 'hidden';
        this.lockKeyboard = false;
    }

    private setSpanValues(): void {
        this.placeHolderSpan.innerText = 'Ajoutez votre texte ici...';

        this.setSpanPosition();
        this.setSpanCss();
        this.setSpanFont();
        this.setSpanTextOptions();
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
        this.hasWeightChanged = textBold === 'bold';
    }

    setTextItalic(textItalic: string): void {
        this.fontStyle = textItalic;
        this.placeHolderSpan.style.fontStyle = textItalic;
        this.hasStyleChanged = textItalic === 'italic';
    }

    setPrimaryColor(newColor: string): void {
        this.primaryColor = newColor;
        if (this.placeHolderSpan !== undefined) {
            this.placeHolderSpan.style.color = newColor;
        }
    }

    onToolChange(): void {
        if (this.lockKeyboard && !this.escapeKeyUsed) {
            this.drawTextOnCanvas();
            this.hasTextBoxBeenCreated = false;
            this.lockKeyboard = false;
        }
    }

    private setSelectedText(): void {
        const selection = window.getSelection() as Selection;
        const range = document.createRange();
        range.selectNodeContents(this.placeHolderSpan);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    private setSpanFont(): void {
        this.placeHolderSpan.style.fontSize = this.fontSize + 'px';
        this.placeHolderSpan.style.fontFamily = this.fontFamily;
        this.placeHolderSpan.style.fontWeight = this.fontWeight;
        this.placeHolderSpan.style.fontStyle = this.fontStyle;
    }

    private setSpanCss(): void {
        this.placeHolderSpan.style.outline = '1px solid black';
        this.placeHolderSpan.style.padding = '5px';
        this.placeHolderSpan.style.display = 'block';
        this.placeHolderSpan.style.zIndex = '2';
        this.placeHolderSpan.style.visibility = 'visible';
        this.placeHolderSpan.style.position = 'absolute';
        this.placeHolderSpan.style.minWidth = this.fontSize * TextConstants.MIN_BOX_WIDTH + 'px';
    }

    private setSpanPosition(): void {
        this.placeHolderSpan.style.left = this.cornerCoords.x + 'px';
        this.placeHolderSpan.style.top = this.cornerCoords.y + 'px';
    }

    private setSpanTextOptions(): void {
        this.placeHolderSpan.style.textAlign = this.textAlign;
        this.placeHolderSpan.style.lineHeight = this.fontSize * TextConstants.LINE_HEIGHT_CONVERSION + 'px';
        this.placeHolderSpan.style.color = this.primaryColor;
        this.placeHolderSpan.style.whiteSpace = 'pre-line';
    }
}
