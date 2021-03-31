import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as EllipseConstants from '@app/constants/ellipse-constants';
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
    fontStyle: string = 'Arial';
    fontSize: number = TextConstants.INIT_FONT_SIZE;
    textAlignment: string = 'center';
    textBold: boolean = false;
    textItalic: boolean = false;
    inputFromKeyboard: string = 'nothing to see here';

    previewCommand: TextCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        const MAX_PATH_DATA_SIZE = 2;
        this.cornerCoords = new Array<Vec2>(MAX_PATH_DATA_SIZE);
        this.clearCornerCoords();
        this.previewCommand = new TextCommand(this.drawingService.previewCtx, this);
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.cornerCoords[TextConstants.START_INDEX] = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[TextConstants.END_INDEX] = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.previewCommand.setValues(this.drawingService.previewCtx, this);
            this.previewCommand.execute();
            this.drawTextBox(this.drawingService.previewCtx, this.cornerCoords);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.inUse) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.cornerCoords[TextConstants.END_INDEX] = this.getPositionFromMouse(event);
            this.previewCommand.setValues(this.drawingService.previewCtx, this);
            this.previewCommand.execute();
            this.drawTextBox(this.drawingService.previewCtx, this.cornerCoords);
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
    }

    onKeyboardDown(event: KeyboardEvent): void {
        if (event.key === 'enter') {
            if (this.inUse) {
                const command: Command = new TextCommand(this.drawingService.baseCtx, this);
                this.undoRedoService.executeCommand(command);
            }
            this.inUse = false;
            this.clearCornerCoords();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        if (event.key === 'Escape') {
            this.inUse = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    drawTextBox(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const start = path[EllipseConstants.START_INDEX];
        const textLength = ctx.measureText(this.inputFromKeyboard);
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = EllipseConstants.PREDICTION_RECTANGLE_WIDTH;
        ctx.setLineDash([EllipseConstants.LINE_DISTANCE]);
        ctx.rect(start.x, start.y, textLength.width, this.fontSize);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    setFontStyle(fontStyle: string): void {
        this.fontStyle = fontStyle;
    }

    setFontSize(fontSize: number): void {
        this.fontSize = fontSize;
    }

    setTextAlignment(textAlignment: string): void {
        this.textAlignment = textAlignment;
    }

    setTextBold(textBold: boolean): void {
        this.textBold = textBold;
    }

    setTextItalic(textItalic: boolean): void {
        this.textItalic = textItalic;
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
