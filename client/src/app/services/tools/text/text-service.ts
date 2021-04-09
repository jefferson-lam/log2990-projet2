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
    cornerCoords: Vec2[] = [];
    primaryColor: string = '#b5cf60';
    fontSize: number = TextConstants.INIT_FONT_SIZE;
    inputFromKeyboard: string;
    textWidth: number;
    textHeight: number;
    lockKeyboard: boolean = false;
    placeHolderSpan: HTMLSpanElement;

    previewCommand: TextCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        const MAX_PATH_DATA_SIZE = 2;
        this.cornerCoords = new Array<Vec2>(MAX_PATH_DATA_SIZE);
        this.clearCornerCoords();
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse && !this.lockKeyboard) {
            this.cornerCoords[TextConstants.START_INDEX] = this.getPositionFromMouse(event);
            this.textWidth = this.cornerCoords[TextConstants.START_INDEX].x;
            this.textHeight = this.cornerCoords[TextConstants.START_INDEX].y;
        }
        if (this.lockKeyboard && this.placeHolderSpan.style.zIndex === '2') {
            this.drawTextOnCanvas();
            this.lockKeyboard = false;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            // this.setMouseOnSpanElement();
            this.placeHolderSpan.style.zIndex = '2';
            this.placeHolderSpan.style.visibility = 'visible';
            this.placeHolderSpan.innerText = 'Ajoutez du texte ici...';
            this.placeHolderSpan.style.left = this.cornerCoords[TextConstants.START_INDEX].x + 'px';
            this.placeHolderSpan.style.top = this.cornerCoords[TextConstants.START_INDEX].y + 'px';
            this.cornerCoords[TextConstants.END_INDEX] = this.getPositionFromMouse(event);
            this.lockKeyboard = true;
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.inUse) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        const LEFT_CLICK_BUTTONS = 1;
        if (event.buttons === LEFT_CLICK_BUTTONS && this.inUse) {
            this.inUse = true;
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.inUse = false;
        }
        this.placeHolderSpan.style.color = this.primaryColor;
    }

    onKeyboardDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.placeHolderSpan.style.visibility = 'hidden';
        }
    }

    drawTextOnCanvas(): void {
        const command: Command = new TextCommand(this.drawingService.baseCtx, this);
        this.undoRedoService.executeCommand(command);
        this.inUse = false;
        this.clearCornerCoords();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.placeHolderSpan.style.visibility = 'hidden';
    }

    // setMouseOnSpanElement(): void {
    //     const range = document.createRange();
    //     range.setStartAfter(this.placeHolderSpan);
    //     const sel = window.getSelection();
    //     range.collapse(true);
    //     // @ts-ignore
    //     sel.removeAllRanges();
    //     // @ts-ignore
    //     sel.addRange(range);
    //     this.placeHolderSpan.focus();
    // }

    setFontFamily(fontFamily: string): void {
        this.placeHolderSpan.style.fontFamily = fontFamily;
    }

    setFontSize(fontSize: number): void {
        this.fontSize = fontSize;
        this.placeHolderSpan.style.fontSize = fontSize + 'px';
        this.placeHolderSpan.style.lineHeight = fontSize * TextConstants.LINE_HEIGHT_CONVERSION + 'px';
    }

    setTextAlign(textAlign: string): void {
        this.placeHolderSpan.style.textAlign = textAlign;
    }

    setTextBold(textBold: string): void {
        this.placeHolderSpan.style.fontWeight = textBold;
    }

    setTextItalic(textItalic: string): void {
        this.placeHolderSpan.style.fontStyle = textItalic;
    }

    setInputFromKeyboard(inputFromKeyboard: string): void {
        this.inputFromKeyboard = inputFromKeyboard;
    }

    setPrimaryColor(newColor: string): void {
        this.primaryColor = newColor;
    }

    private clearCornerCoords(): void {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }

    onToolChange(): void {
        this.onMouseUp({} as MouseEvent);
    }
}
